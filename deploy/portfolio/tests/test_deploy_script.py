"""Exercise production swapping and rollback with Docker replaced by a local fake."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "deploy.sh"
BASH = "C:/Program Files/Git/bin/bash.exe" if os.name == "nt" else shutil.which("bash")

FAKE_DOCKER = r'''
import json, os, sys
from pathlib import Path
path = Path(os.environ["FAKE_DOCKER_STATE"])
state = json.loads(path.read_text()) if path.exists() else {"calls": [], "app": 0, "studio": 0}
args = sys.argv[1:]
state["calls"].append(args)
scenario = os.environ.get("FAKE_DOCKER_SCENARIO", "success")
mode = os.environ.get("FAKE_COMPOSE_MODE", "v2")
code = 0
output = ""
if args[:2] == ["compose", "version"]:
    code = 1 if mode == "v1" else 0
elif args[0] in ("compose", "--compose-v1"):
    command = next(arg for arg in args if arg in ("ps", "build", "run", "rm", "up"))
    service = args[-1]
    if command == "ps":
        output = "opaque-id-" + service
    if command == "up":
        state[service] += 1
        if scenario == "app_start_failure" and service == "app" and state[service] == 1:
            code = 1
elif args[0] == "inspect":
    container = args[-1]
    if args[2] == "{{.Image}}":
        output = "sha256:old-" + container
    else:
        output = "healthy"
        if scenario == "preflight_failure" and container == "portfolio-production_preflight":
            output = "unhealthy"
        if scenario == "studio_preflight_failure" and container == "portfolio-production_studio_preflight":
            output = "unhealthy"
        if scenario == "app_health_failure" and container == "opaque-id-app" and state["app"] == 1:
            output = "unhealthy"
        if scenario == "studio_health_failure" and container == "opaque-id-studio" and state["studio"] == 1:
            output = "unhealthy"
path.write_text(json.dumps(state))
if output:
    sys.stdout.buffer.write((output + "\n").encode())
sys.exit(code)
'''


@unittest.skipUnless(BASH, "Bash is required")
class DeployScriptTests(unittest.TestCase):
    def execute(self, scenario="success", mode="v2"):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bin_path = root / "bin"
            bin_path.mkdir()
            fake = root / "fake_docker.py"
            fake.write_text(FAKE_DOCKER, encoding="utf-8")
            python = Path(sys.executable).as_posix()
            wrappers = {
                "docker": f'exec "{python}" "{fake.as_posix()}" "$@"',
                "docker-compose": f'exec "{python}" "{fake.as_posix()}" --compose-v1 "$@"',
                "python3": f'exec "{python}" "$@"',
            }
            if os.name == "nt":
                # MSYS permissions differ from Linux; the production stat check runs on Linux CI.
                wrappers.update(stat="printf '600\\n'", flock="exit 0")
            for name, content in wrappers.items():
                wrapper = bin_path / name
                wrapper.write_text("#!/usr/bin/env bash\n" + content + "\n", encoding="utf-8", newline="\n")
                wrapper.chmod(0o755)
            env_file = root / "production.env"
            env_file.write_text("HOST_PORT=8011\n", encoding="utf-8")
            env_file.chmod(0o600)
            state_path = root / "docker.json"
            command = [BASH, str(SCRIPT), "production", str(env_file)]
            if os.name == "nt":
                command = [BASH, "-c", 'export PATH="$(cygpath -u "$1"):$PATH"; shift; exec bash "$@"',
                           "test", bin_path.as_posix(), SCRIPT.as_posix(), "production", env_file.as_posix()]
            result = subprocess.run(
                command,
                env={**os.environ, "PATH": str(bin_path) + os.pathsep + os.environ["PATH"],
                     "FAKE_DOCKER_STATE": str(state_path), "FAKE_DOCKER_SCENARIO": scenario,
                     "FAKE_COMPOSE_MODE": mode}, capture_output=True, text=True, timeout=30,
            )
            self.assertTrue(state_path.exists(), result.stdout + result.stderr)
            return result, json.loads(state_path.read_text())

    def test_success_with_compose_v1_and_v2_uses_actual_container_ids(self):
        for mode in ("v1", "v2"):
            with self.subTest(mode=mode):
                result, state = self.execute(mode=mode)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                self.assertEqual((state["app"], state["studio"]), (1, 1))
                self.assertIn(["tag", "sha256:old-opaque-id-app", "portfolio-production:previous"], state["calls"])

    def test_app_or_studio_preflight_failure_does_not_stop_running_services(self):
        for scenario in ("preflight_failure", "studio_preflight_failure"):
            with self.subTest(scenario=scenario):
                result, state = self.execute(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual((state["app"], state["studio"]), (0, 0))
                self.assertFalse(any("--stop" in call for call in state["calls"]))

    def test_start_or_health_failure_restores_previous_app(self):
        for scenario in ("app_start_failure", "app_health_failure"):
            with self.subTest(scenario=scenario):
                result, state = self.execute(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual((state["app"], state["studio"]), (2, 0))
                self.assertIn(["tag", "portfolio-production:previous", "portfolio-production:latest"], state["calls"])

    def test_studio_failure_restores_both_running_images(self):
        result, state = self.execute("studio_health_failure")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((state["app"], state["studio"]), (2, 2))
        self.assertIn(["tag", "portfolio-studio-production:previous", "portfolio-studio-production:latest"], state["calls"])


if __name__ == "__main__":
    unittest.main()
