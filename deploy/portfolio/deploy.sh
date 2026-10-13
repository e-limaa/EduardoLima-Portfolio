#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <staging|production> [protected-env-file]\n' "$0" >&2
  exit 2
}

[[ $# -ge 1 && $# -le 2 ]] || usage
environment="$1"
case "$environment" in
  staging)
    project=portfolio-staging
    default_port=8010
    node_environment=development
    profile_args=()
    ;;
  production)
    project=portfolio-production
    default_port=8011
    node_environment=production
    profile_args=(--profile cms)
    export STUDIO_DNS_ALIAS=portfolio-studio-production
    export STUDIO_IMAGE=portfolio-studio-production
    ;;
  *) usage ;;
esac

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "$script_dir/../.." && pwd)"
env_file="${2:-/home/eduardo/portfolio/${environment}.env}"
[[ -f "$env_file" && ! -L "$env_file" ]] || {
  printf 'Protected environment file is missing or is a symlink.\n' >&2
  exit 1
}
mode="$(stat -c '%a' -- "$env_file")"
(( (8#$mode & 077) == 0 )) || {
  printf 'Environment file permissions must exclude group and other access (for example, chmod 600).\n' >&2
  exit 1
}

export HOST_PORT="$(python3 - "$env_file" "$default_port" <<'PY'
import sys

path, default_port = sys.argv[1:]
values = {}
with open(path, encoding="utf-8") as source:
    for raw in source:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        key, separator, value = line.partition("=")
        if not separator:
            raise SystemExit("Invalid environment file line.")
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        if key in values:
            raise SystemExit("Duplicate environment variable in protected file.")
        values[key] = value

configured = values.get("HOST_PORT", default_port)
if not configured.isdigit() or not 1 <= int(configured) <= 65535:
    raise SystemExit("HOST_PORT must be a TCP port number.")
if int(configured) != int(default_port):
    raise SystemExit("HOST_PORT does not match the selected deployment environment.")
print(configured)
PY
)"
export NODE_ENV="$node_environment"
export PORTFOLIO_IMAGE="portfolio-${environment}"

# Compose v2 when available; v1 otherwise. v1 cannot recreate containers on
# Docker 25+ (KeyError: 'ContainerConfig'), so services are always removed
# before `up` instead of being recreated in place.
if docker compose version >/dev/null 2>&1; then
  compose_bin=(docker compose)
else
  compose_bin=(docker-compose)
fi
compose=("${compose_bin[@]}" --project-name "$project" --env-file "$env_file" -f "$script_dir/compose.yml" "${profile_args[@]}")
app_container="${project}_app_1"
preflight_container="${project}_preflight"

wait_healthy() {
  local container="$1" timeout="$2" status=""
  for (( waited = 0; waited < timeout; waited += 3 )); do
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container" 2>/dev/null || true)"
    [[ "$status" == healthy ]] && return 0
    [[ "$status" == unhealthy || "$status" == exited || "$status" == dead ]] && break
    sleep 3
  done
  printf 'Container %s did not become healthy (last status: %s).\n' "$container" "${status:-missing}" >&2
  docker logs --tail 30 "$container" >&2 2>&1 || true
  return 1
}

# Keep the image that is serving traffic so a failed release can roll back.
if docker image inspect "$PORTFOLIO_IMAGE:latest" >/dev/null 2>&1; then
  docker tag "$PORTFOLIO_IMAGE:latest" "$PORTFOLIO_IMAGE:previous"
fi

"${compose[@]}" build app
if [[ "$environment" == production ]]; then
  "${compose[@]}" build studio
fi
"${compose[@]}" --profile tools run --rm migrate

# Preflight: boot the new image next to the running app (no published port,
# no tunnel route) and require a healthy database connection before swapping.
docker rm -f "$preflight_container" >/dev/null 2>&1 || true
"${compose[@]}" run -d --no-deps --name "$preflight_container" app >/dev/null
if ! wait_healthy "$preflight_container" 120; then
  docker rm -f "$preflight_container" >/dev/null 2>&1 || true
  printf 'Preflight failed; the running %s app was not touched.\n' "$environment" >&2
  exit 1
fi
docker rm -f "$preflight_container" >/dev/null

# Swap. Downtime is limited to the stop/start of the container itself.
"${compose[@]}" rm --stop --force app
"${compose[@]}" up -d --no-deps app
if ! wait_healthy "$app_container" 120; then
  if docker image inspect "$PORTFOLIO_IMAGE:previous" >/dev/null 2>&1; then
    printf 'Rolling back %s to the previous image. Applied migrations are kept.\n' "$environment" >&2
    docker tag "$PORTFOLIO_IMAGE:previous" "$PORTFOLIO_IMAGE:latest"
    "${compose[@]}" rm --stop --force app
    "${compose[@]}" up -d --no-deps app
    wait_healthy "$app_container" 120 || printf 'Rollback did not become healthy either. Check the server now.\n' >&2
  fi
  exit 1
fi

if [[ "$environment" == production ]]; then
  "${compose[@]}" rm --stop --force studio
  "${compose[@]}" up -d --no-deps studio
  wait_healthy "${project}_studio_1" 120 || exit 1
fi

printf 'Deployment finished for %s on 127.0.0.1:%s.\n' "$environment" "$HOST_PORT"
printf 'Check health with: curl -fsS http://127.0.0.1:%s/api/health\n' "$HOST_PORT"
if [[ "$environment" == production ]]; then
  printf 'Studio service target on the Cloudflare Tunnel network: http://%s:3333\n' "$STUDIO_DNS_ALIAS"
fi
