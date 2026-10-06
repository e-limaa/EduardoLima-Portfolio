#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <staging|production> <protected-env-file>\n' "$0" >&2
  exit 2
}

[[ $# -eq 2 ]] || usage
instance="$1"
case "$instance" in
  staging|production) ;;
  *) usage ;;
esac
env_file="$2"
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/portfolio/common.sh
source "$script_dir/common.sh"
portfolio_require_private_file "$env_file"

container="${PORTFOLIO_POSTGRES_CONTAINER:-postgres-apps}"
database_url="$(portfolio_read_env "$env_file" MIGRATION_DATABASE_URL)"
dump_role="$(portfolio_read_env "$env_file" MIGRATION_OWNER_ROLE)"
[[ "$dump_role" =~ ^portfolio_owner_[a-z0-9_]+$ ]] || portfolio_fail 'Migration owner role is invalid.'
backup_dir=/home/eduardo/portfolio/backups
umask 077
mkdir -p -m 700 -- "$backup_dir"
[[ ! -L "$backup_dir" ]] || portfolio_fail 'Backup directory must not be a symlink.'
dir_mode="$(stat -c '%a' -- "$backup_dir")"
(( (8#$dir_mode & 077) == 0 )) || portfolio_fail 'Backup directory permissions must exclude group and other access.'

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
temporary_dump="$(mktemp "$backup_dir/.portfolio-${instance}-${timestamp}.XXXXXX.partial")"
temporary_manifest="$(mktemp "$backup_dir/.portfolio-${instance}-${timestamp}.XXXXXX.manifest")"
cleanup() {
  rm -f -- "$temporary_dump" "$temporary_manifest"
}
trap cleanup EXIT

printf '%s\n%s\n' "$database_url" "$dump_role" | docker exec -i "$container" sh -c '
  IFS= read -r DB_URL || exit 2
  export DB_URL
  IFS= read -r DUMP_ROLE || exit 2
  export DUMP_ROLE
  exec pg_dump --role="$DUMP_ROLE" --format=custom --no-owner --no-acl --serializable-deferrable --dbname="$DB_URL"
' > "$temporary_dump"

docker exec -i "$container" pg_restore --list < "$temporary_dump" > /dev/null
digest="$(sha256sum -- "$temporary_dump" | cut -d ' ' -f 1)"
temporary_name="${temporary_dump##*/}"
token="${temporary_name#".portfolio-${instance}-${timestamp}."}"
token="${token%.partial}"
backup_file="$backup_dir/portfolio-${instance}-${timestamp}-${token}.dump"
manifest_file="${backup_file}.sha256"
printf '%s  %s\n' "$digest" "$(basename -- "$backup_file")" > "$temporary_manifest"
chmod 600 -- "$temporary_dump" "$temporary_manifest"
mv -- "$temporary_dump" "$backup_file"
mv -- "$temporary_manifest" "$manifest_file"
trap - EXIT

printf 'Backup saved: %s\n' "$backup_file"
printf 'SHA-256 manifest saved: %s\n' "$manifest_file"
