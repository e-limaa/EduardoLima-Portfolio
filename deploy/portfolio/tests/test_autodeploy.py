import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "auto_deploy", Path(__file__).resolve().parents[1] / "auto-deploy.py")
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
SHA = "a" * 40
OLD_SHA = "b" * 40


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        (self.root / "autodeploy").mkdir()
        self.state_path = self.root / "autodeploy/status.json"
        self.calls = []
        for name, value in (("fetch_main", SHA), ("successful_ci", True),
                            ("prepare_release", self.root / "release"),
                            ("require_private_environment", None)):
            mock = patch.object(deploy, name, return_value=value)
            setattr(self, name, mock.start())
            self.addCleanup(mock.stop)
        commands = patch.object(deploy, "run", side_effect=self.command)
        self.run = commands.start()
        self.addCleanup(commands.stop)
        links = patch.object(deploy, "replace_link", side_effect=lambda *args: self.calls.append("link"))
        links.start()
        self.addCleanup(links.stop)

    def command(self, *args, **kwargs):
        self.calls.append(Path(args[1]).name)

    def state(self, **values):
        deploy.write_state(self.state_path, values)

    def test_waits_for_ci_without_touching_release_or_database(self):
        self.successful_ci.return_value = False
        self.assertEqual(deploy.deploy_once(self.root), "waiting-for-ci")
        self.prepare_release.assert_not_called()
        self.assertEqual(self.calls, [])
        self.assertFalse(self.state_path.exists())

    def test_deploys_once_after_backup_and_health_checked_script(self):
        self.assertEqual(deploy.deploy_once(self.root), "deployed")
        self.assertEqual(self.calls, ["backup.sh", "deploy.sh", "link"])
        self.assertEqual(deploy.read_state(self.state_path)["deployed_sha"], SHA)
        self.assertEqual(deploy.deploy_once(self.root), "unchanged")
        self.assertEqual(len(self.calls), 3)

    def test_backup_failure_prevents_deploy_and_automatic_retry(self):
        self.run.side_effect = subprocess.CalledProcessError(1, ["bash", "backup.sh"])
        with self.assertRaises(subprocess.CalledProcessError):
            deploy.deploy_once(self.root)
        self.assertEqual(self.run.call_count, 1)
        self.assertEqual(deploy.read_state(self.state_path)["result"], "failed")
        self.assertEqual(deploy.deploy_once(self.root), "blocked-after-failure")
        self.assertEqual(self.run.call_count, 1)

    def test_failed_deploy_preserves_previous_revision_and_current_link(self):
        self.state(deployed_sha=OLD_SHA)
        self.run.side_effect = [None, subprocess.CalledProcessError(1, ["bash", "deploy.sh"])]
        with self.assertRaises(subprocess.CalledProcessError):
            deploy.deploy_once(self.root)
        self.assertEqual(deploy.read_state(self.state_path)["deployed_sha"], OLD_SHA)
        self.assertNotIn("link", self.calls)

    def test_crashed_attempt_requires_explicit_retry(self):
        self.state(attempted_sha=SHA, result="deploying")
        self.assertEqual(deploy.deploy_once(self.root), "blocked-after-failure")
        self.run.assert_not_called()
        self.assertEqual(deploy.deploy_once(self.root, retry_failed=True), "deployed")

    def test_next_commit_can_deploy_after_a_failure(self):
        self.state(attempted_sha=OLD_SHA, result="failed")
        self.assertEqual(deploy.deploy_once(self.root), "deployed")

    def test_does_not_replace_existing_current_directory(self):
        (self.root / "current").mkdir()
        with self.assertRaises(ValueError):
            deploy.deploy_once(self.root)
        self.run.assert_not_called()

    def test_invalid_state_fails_closed(self):
        self.state_path.write_text('{"deployed_sha":"invalid"}', encoding="utf-8")
        with self.assertRaises(ValueError):
            deploy.deploy_once(self.root)
        self.fetch_main.assert_not_called()


class GitHubGateTests(unittest.TestCase):
    def check(self, runs):
        response = io.StringIO(json.dumps({"workflow_runs": runs}))
        with patch.object(deploy.urllib.request, "urlopen", return_value=response) as request:
            result = deploy.successful_ci(SHA)
            self.assertIn(f"head_sha={SHA}", request.call_args.args[0].full_url)
            return result

    def test_accepts_only_exact_main_push_completed_success(self):
        success = dict(head_sha=SHA, head_branch="main", event="push",
                       path=".github/workflows/portfolio-ci.yml", status="completed", conclusion="success")
        self.assertTrue(self.check([success]))
        self.assertFalse(self.check([]))
        for key, value in (("head_sha", OLD_SHA), ("head_branch", "feature"),
                           ("event", "pull_request"), ("status", "in_progress"),
                           ("conclusion", "failure"), ("conclusion", "cancelled"),
                           ("path", ".github/workflows/other.yml")):
            with self.subTest(key=key, value=value):
                self.assertFalse(self.check([{**success, key: value}]))

    def test_latest_failed_attempt_cannot_fall_back_to_old_success(self):
        success = dict(head_sha=SHA, head_branch="main", event="push",
                       path=".github/workflows/portfolio-ci.yml", status="completed", conclusion="success")
        self.assertFalse(self.check([{**success, "conclusion": "failure"}, success]))


@unittest.skipUnless(shutil.which("git"), "Git is required")
class ReleaseSnapshotTests(unittest.TestCase):
    def test_release_is_exact_fetched_commit_and_old_release_is_preserved(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "source"
            source.mkdir()
            (root / "autodeploy").mkdir()
            def git(*args):
                return subprocess.run(["git", "-c", "user.name=Test", "-c", "user.email=test@example.invalid",
                                       *args], cwd=source, check=True, capture_output=True, text=True).stdout.strip()
            git("init", "-b", "main")
            (source / "version.txt").write_text("one", encoding="utf-8")
            git("add", "version.txt")
            git("commit", "-m", "first")
            first_sha = git("rev-parse", "HEAD")
            with patch.object(deploy, "REPOSITORY_URL", str(source)):
                self.assertEqual(deploy.fetch_main(root), first_sha)
                first = deploy.prepare_release(root, first_sha)
                (source / "version.txt").write_text("two", encoding="utf-8")
                git("commit", "-am", "second")
                second_sha = git("rev-parse", "HEAD")
                self.assertEqual(deploy.fetch_main(root), second_sha)
                second = deploy.prepare_release(root, second_sha)
            self.assertEqual((first / "version.txt").read_text(), "one")
            self.assertEqual((second / "version.txt").read_text(), "two")

    @unittest.skipIf(os.name == "nt", "Unix file permissions are verified on Linux CI")
    def test_environment_must_be_private_and_links_are_atomic(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            env = root / "production.env"
            env.write_text("HOST_PORT=8011\n")
            env.chmod(0o644)
            with self.assertRaises(ValueError):
                deploy.require_private_environment(env)
            env.chmod(0o600)
            deploy.require_private_environment(env)
            release = root / "release"
            release.mkdir()
            deploy.replace_link(root / "current", release)
            self.assertEqual((root / "current").resolve(), release)
            deploy.replace_link(root / "previous", os.readlink(root / "current"))
            self.assertEqual((root / "previous").resolve(), release)


if __name__ == "__main__":
    unittest.main()
