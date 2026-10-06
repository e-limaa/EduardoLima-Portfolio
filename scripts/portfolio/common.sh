#!/usr/bin/env bash

portfolio_fail() {
  printf '%s\n' "$1" >&2
  exit 1
}

portfolio_require_private_file() {
  local path="$1"
  [[ -f "$path" && ! -L "$path" ]] || portfolio_fail 'Required file is missing or is a symlink.'
  local mode
  mode="$(stat -c '%a' -- "$path")"
  (( (8#$mode & 077) == 0 )) || portfolio_fail 'File permissions must exclude group and other access (for example, chmod 600).'
}

portfolio_read_env() {
  local path="$1"
  local key="$2"
  python3 - "$path" "$key" <<'PY'
import sys

path, requested = sys.argv[1:]
found = []
with open(path, encoding="utf-8") as source:
    for raw in source:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        key, separator, value = line.partition("=")
        if not separator:
            raise SystemExit("Invalid environment file line.")
        if key.strip() == requested:
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            found.append(value)

if len(found) != 1 or not found[0] or "\n" in found[0] or "\r" in found[0]:
    raise SystemExit("Required environment variable is missing or duplicated.")
print(found[0])
PY
}

portfolio_pg_query() {
  local container="$1"
  local database_url="$2"
  local query="$3"
  printf '%s\n%s\n' "$database_url" "$query" | docker exec -i "$container" sh -c '
    IFS= read -r DB_URL || exit 2
    IFS= read -r QUERY || exit 2
    export DB_URL
    exec psql -X -v ON_ERROR_STOP=1 -A -t --dbname="$DB_URL" --command="$QUERY"
  '
}
