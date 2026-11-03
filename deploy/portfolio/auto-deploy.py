#!/usr/bin/env python3
"""Deploy only the main revision approved by Portfolio CI. No third-party modules."""

import argparse
import datetime
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

REPOSITORY = "e-limaa/EduardoLima-Portfolio"
REPOSITORY_URL = f"https://github.com/{REPOSITORY}.git"
WORKFLOW = "portfolio-ci.yml"
ROOT = Path("/home/eduardo/portfolio")
SHA_PATTERN = re.compile(r"[0-9a-f]{40}")


def run(*args, cwd=None, capture=False):
    return subprocess.run(
        args, cwd=cwd, check=True, text=True,
        stdout=subprocess.PIPE if capture else None,
        timeout=1500,
        env={**os.environ, "GIT_TERMINAL_PROMPT": "0"},
    ).stdout


def fetch_main(root):
    repository = root / "autodeploy" / "repository.git"
    if not repository.exists():
        run("git", "init", "--bare", str(repository))
    git = ("git", "--git-dir", str(repository))
    run(*git, "fetch", "--no-tags", "--depth=1", REPOSITORY_URL, "refs/heads/main")
    sha = run(*git, "rev-parse", "FETCH_HEAD", capture=True).strip()
    if not SHA_PATTERN.fullmatch(sha):
        raise ValueError("Git did not return a full commit SHA")
    return sha


def successful_ci(sha):
    query = urllib.parse.urlencode({
        "branch": "main", "event": "push", "head_sha": sha, "per_page": 1,
    })
    request = urllib.request.Request(
        f"https://api.github.com/repos/{REPOSITORY}/actions/workflows/{WORKFLOW}/runs?{query}",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "portfolio-autodeploy"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        runs = json.load(response).get("workflow_runs", [])
    if not runs:
        return False
    latest = runs[0]
    return all((
        latest.get("head_sha") == sha,
        latest.get("head_branch") == "main",
        latest.get("event") == "push",
        latest.get("path") == f".github/workflows/{WORKFLOW}",
        latest.get("status") == "completed",
        latest.get("conclusion") == "success",
    ))


def write_state(path, state):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def read_state(path):
    if not path.exists():
        return {}
    state = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(state, dict):
        raise ValueError("Invalid deployment state")
    for key in ("deployed_sha", "attempted_sha"):
        if key in state and not SHA_PATTERN.fullmatch(str(state[key])):
            raise ValueError("Invalid SHA in deployment state")
    return state


def prepare_release(root, sha):
    releases = root / "releases"
    releases.mkdir(mode=0o700, exist_ok=True)
    # A unique directory also makes an explicit retry start from a clean tree.
    release = Path(tempfile.mkdtemp(prefix=f"{sha}-", dir=releases))
    run("git", "--git-dir", str(root / "autodeploy" / "repository.git"),
        "--work-tree", str(release), "checkout", "--force", sha, "--", ".")
    return release


def replace_link(path, target):
    if path.exists() and not path.is_symlink():
        raise ValueError(f"Refusing to replace a directory or file at {path.name}")
    temporary = path.with_name(f".{path.name}.next")
    if temporary.is_symlink():
        temporary.unlink()
    temporary.symlink_to(target, target_is_directory=True)
    os.replace(temporary, path)


def require_private_environment(env_file):
    if env_file.is_symlink() or not env_file.is_file() or env_file.stat().st_mode & 0o077:
        raise ValueError("production.env must be a private regular file")


def deploy_once(root=ROOT, retry_failed=False):
    state_path = root / "autodeploy" / "status.json"
    state = read_state(state_path)
    sha = fetch_main(root)
    if state.get("deployed_sha") == sha:
        return "unchanged"
    if state.get("attempted_sha") == sha and not retry_failed:
        return "blocked-after-failure"
    if not successful_ci(sha):
        return "waiting-for-ci"

    # Check bookkeeping before touching the database or running containers.
    for name in ("current", "previous"):
        path = root / name
        if path.exists() and not path.is_symlink():
            raise ValueError(f"{name} must be a symlink or absent")
    env_file = root / "production.env"
    require_private_environment(env_file)

    release = prepare_release(root, sha)
    state.update(attempted_sha=sha, result="deploying",
                 updated_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
    write_state(state_path, state)
    try:
        run("bash", str(release / "scripts/portfolio/backup.sh"),
            "production", str(env_file), cwd=release)
        run("bash", str(release / "deploy/portfolio/deploy.sh"),
            "production", str(env_file), cwd=release)
        current = root / "current"
        if current.is_symlink():
            replace_link(root / "previous", os.readlink(current))
        replace_link(current, release)
    except Exception:
        state.update(result="failed")
        write_state(state_path, state)
        raise
    state.update(deployed_sha=sha, result="success", release=str(release),
                 updated_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
    write_state(state_path, state)
    print(f"Deployed {sha} to production", flush=True)
    return "deployed"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--retry-failed", action="store_true",
                        help="Explicitly retry the failed current main revision after diagnosis")
    args = parser.parse_args()
    # Imported here so policy and failure-path tests can also run on Windows.
    import fcntl

    os.umask(0o077)
    with (ROOT / "autodeploy" / "controller.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return 0
        try:
            deploy_once(retry_failed=args.retry_failed)
        except Exception as error:
            # The journal contains command output; never print env-file contents.
            print(f"Autodeploy stopped: {type(error).__name__}. Inspect the service journal.",
                  file=sys.stderr, flush=True)
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
