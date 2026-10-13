#!/usr/bin/env bash
# Daily portfolio database backup, meant for cron:
#   15 4 * * * /path/to/release/scripts/portfolio/backup-scheduled.sh >> /home/eduardo/portfolio/backups/scheduled.log 2>&1
#
# - Dumps production and staging with backup.sh (verified custom-format dumps + SHA-256).
# - Keeps dumps for PORTFOLIO_BACKUP_RETENTION_DAYS (default 14), but never fewer
#   than the newest PORTFOLIO_BACKUP_MIN_KEEP (default 3) per instance.
# - Copies the dumps off the server when PORTFOLIO_BACKUP_RSYNC_TARGET is set
#   (for example user@host:/backups/portfolio/). Set it in the crontab line.
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
env_dir="${PORTFOLIO_ENV_DIR:-/home/eduardo/portfolio}"
backup_dir=/home/eduardo/portfolio/backups
retention_days="${PORTFOLIO_BACKUP_RETENTION_DAYS:-14}"
min_keep="${PORTFOLIO_BACKUP_MIN_KEEP:-3}"
[[ "$retention_days" =~ ^[0-9]+$ && "$min_keep" =~ ^[0-9]+$ && "$min_keep" -ge 1 ]] || { echo 'Invalid retention settings.' >&2; exit 2; }

log() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

status=0
for instance in production staging; do
  env_file="$env_dir/$instance.env"
  if [[ ! -f "$env_file" ]]; then
    log "skip $instance: $env_file not found"
    continue
  fi
  if bash "$script_dir/backup.sh" "$instance" "$env_file"; then
    log "backup ok: $instance"
  else
    log "backup FAILED: $instance"
    status=1
  fi
done

# Retention only runs after a successful round, so a broken backup never
# deletes the last good dumps.
if (( status == 0 )); then
  for instance in production staging; do
    mapfile -t dumps < <(find "$backup_dir" -maxdepth 1 -type f -name "portfolio-${instance}-*.dump" -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2-)
    for (( i = min_keep; i < ${#dumps[@]}; i++ )); do
      dump="${dumps[$i]}"
      if [[ -n "$(find "$dump" -mtime +"$retention_days" -print)" ]]; then
        rm -f -- "$dump" "$dump.sha256"
        log "removed expired $(basename -- "$dump")"
      fi
    done
  done
fi

if [[ -n "${PORTFOLIO_BACKUP_RSYNC_TARGET:-}" ]]; then
  if rsync -a --chmod=F600,D700 --include='portfolio-*.dump' --include='portfolio-*.dump.sha256' --exclude='*' "$backup_dir/" "$PORTFOLIO_BACKUP_RSYNC_TARGET"; then
    log "off-site copy ok"
  else
    log "off-site copy FAILED"
    status=1
  fi
else
  log "off-site copy not configured (PORTFOLIO_BACKUP_RSYNC_TARGET is empty)"
fi

exit "$status"
