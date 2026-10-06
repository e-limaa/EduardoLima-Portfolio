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

compose=(docker-compose --project-name "$project" --env-file "$env_file" -f "$script_dir/compose.yml" "${profile_args[@]}")
"${compose[@]}" build app
if [[ "$environment" == production ]]; then
  "${compose[@]}" build studio
fi
"${compose[@]}" --profile tools run --rm migrate
"${compose[@]}" rm --stop --force app
"${compose[@]}" up -d --no-deps app
if [[ "$environment" == production ]]; then
  "${compose[@]}" up -d --no-deps studio
fi

printf 'Deployment started for %s on 127.0.0.1:%s.\n' "$environment" "$HOST_PORT"
printf 'Check health with: curl -fsS http://127.0.0.1:%s/api/health\n' "$HOST_PORT"
if [[ "$environment" == production ]]; then
  printf 'Studio service target on the Cloudflare Tunnel network: http://%s:3333\n' "$STUDIO_DNS_ALIAS"
fi
