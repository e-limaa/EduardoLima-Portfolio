#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <backup.dump> <protected-env-file>\n' "$0" >&2
  exit 2
}

[[ $# -eq 2 ]] || usage
backup_file="$1"
env_file="$2"
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/portfolio/common.sh
source "$script_dir/common.sh"
portfolio_require_private_file "$backup_file"
portfolio_require_private_file "$env_file"
manifest_file="${backup_file}.sha256"
portfolio_require_private_file "$manifest_file"

container="${PORTFOLIO_POSTGRES_CONTAINER:-postgres-apps}"
verify_url="$(portfolio_read_env "$env_file" VERIFY_DATABASE_URL)"

database_name="${verify_url#*://}"
database_name="${database_name#*/}"
database_name="${database_name%%\?*}"
[[ "$database_name" == portfolio_verify || "$database_name" == portfolio_verify_staging ]] || portfolio_fail 'Restore target must be the dedicated portfolio_verify database.'

expected_digest="$(awk 'NR == 1 { print $1 }' "$manifest_file")"
[[ "$expected_digest" =~ ^[0-9a-f]{64}$ ]] || portfolio_fail 'Backup digest manifest is invalid.'
actual_digest="$(sha256sum -- "$backup_file" | cut -d ' ' -f 1)"
[[ "$expected_digest" == "$actual_digest" ]] || portfolio_fail 'Backup digest does not match its manifest.'

empty_check="$(portfolio_pg_query "$container" "$verify_url" "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname NOT IN ('pg_catalog','information_schema') AND c.relkind IN ('r','p','v','m','S','f')")"
[[ "$empty_check" == 0 ]] || portfolio_fail "Restore target $database_name already has user relations; no changes were made."

{
  printf '%s\n' "$verify_url"
  cat -- "$backup_file"
} | docker exec -i "$container" sh -c '
  IFS= read -r DB_URL || exit 2
  export DB_URL
  exec pg_restore --exit-on-error --single-transaction --no-owner --no-acl --dbname="$DB_URL"
'

counts_query="SELECT json_build_object('app_users',(SELECT count(*) FROM app_users),'profiles',(SELECT count(*) FROM profiles),'newsletter_subscribers',(SELECT count(*) FROM newsletter_subscribers),'interaction_logs',(SELECT count(*) FROM interaction_logs),'agent_knowledge',(SELECT count(*) FROM agent_knowledge))::text"
counts="$(portfolio_pg_query "$container" "$verify_url" "$counts_query")"
printf 'Restore verified in %s. Row counts: %s\n' "$database_name" "$counts"
