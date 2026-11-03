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

# Share the same lock across manual deployments and the automatic publisher.
umask 077
exec 9>"$(dirname -- "$env_file")/.deploy-${environment}.lock"
flock -n 9 || { printf 'Another %s deployment is running.\n' "$environment" >&2; exit 1; }
# Preserve the underscore DNS names already used by the Cloudflare Tunnel.
export COMPOSE_COMPATIBILITY=1

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
preflight_container="${project}_preflight"
studio_preflight="${project}_studio_preflight"

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

# Snapshot the images actually serving traffic, including after a failed build.
save_running_image() {
  local service="$1" image="$2" container image_id
  container="$("${compose[@]}" ps -q "$service")"
  if [[ -n "$container" ]]; then
    image_id="$(docker inspect --format '{{.Image}}' "$container")"
    docker tag "$image_id" "$image:previous"
    return 0
  fi
  return 1
}
app_previous=false
studio_previous=false
save_running_image app "$PORTFOLIO_IMAGE" && app_previous=true
if [[ "$environment" == production ]]; then
  save_running_image studio "$STUDIO_IMAGE" && studio_previous=true
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

if [[ "$environment" == production ]]; then
  docker rm -f "$studio_preflight" >/dev/null 2>&1 || true
  "${compose[@]}" run -d --no-deps --name "$studio_preflight" studio >/dev/null
  if ! wait_healthy "$studio_preflight" 120; then
    docker rm -f "$studio_preflight" >/dev/null 2>&1 || true
    printf 'Studio preflight failed; running services were not touched.\n' >&2
    exit 1
  fi
  docker rm -f "$studio_preflight" >/dev/null
fi

app_swapped=false
studio_swapped=false
rollback_service() {
  local service="$1" image="$2"
  docker tag "$image:previous" "$image:latest"
  "${compose[@]}" rm --stop --force "$service"
  "${compose[@]}" up -d --no-deps "$service"
  wait_healthy "$("${compose[@]}" ps -q "$service")" 120 || printf 'Rollback of %s failed; check the server.\n' "$service" >&2
}
deployment_failed() {
  local code="$1"
  trap - ERR
  set +e
  printf 'Release failed; restoring previous running images. Applied migrations are kept.\n' >&2
  if "$studio_swapped" && "$studio_previous"; then rollback_service studio "$STUDIO_IMAGE"; fi
  if "$app_swapped" && "$app_previous"; then rollback_service app "$PORTFOLIO_IMAGE"; fi
  exit "$code"
}
trap 'deployment_failed "$?"' ERR

# Swap. Downtime is limited to the stop/start of the container itself.
app_swapped=true
"${compose[@]}" rm --stop --force app
"${compose[@]}" up -d --no-deps app
wait_healthy "$("${compose[@]}" ps -q app)" 120

if [[ "$environment" == production ]]; then
  studio_swapped=true
  "${compose[@]}" rm --stop --force studio
  "${compose[@]}" up -d --no-deps studio
  wait_healthy "$("${compose[@]}" ps -q studio)" 120
fi
trap - ERR

printf 'Deployment finished for %s on 127.0.0.1:%s.\n' "$environment" "$HOST_PORT"
printf 'Check health with: curl -fsS http://127.0.0.1:%s/api/health\n' "$HOST_PORT"
if [[ "$environment" == production ]]; then
  printf 'Studio service target on the Cloudflare Tunnel network: http://%s:3333\n' "$STUDIO_DNS_ALIAS"
fi
