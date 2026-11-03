#!/usr/bin/env bash
# Run only through the approved server-administration plan.
set -euo pipefail
[[ "$EUID" == 0 ]] || { printf 'Root is required to install the systemd units.\n' >&2; exit 1; }
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
root=/home/eduardo/portfolio
controller_dir=/usr/local/lib/portfolio-autodeploy

# Fail before changes if the existing production deployment is not ready.
for command in python3 git docker flock runuser systemctl; do
  command -v "$command" >/dev/null
done
[[ -d "$root" && ! -L "$root" && -f "$root/production.env" && ! -L "$root/production.env" ]]
[[ ! -e "$controller_dir" && ! -L "$controller_dir" ]]
[[ ! -e "$root/autodeploy" && ! -L "$root/autodeploy" ]]
[[ ! -e /etc/systemd/system/portfolio-autodeploy.service ]]
[[ ! -e /etc/systemd/system/portfolio-autodeploy.timer ]]
for name in current previous; do
  [[ ! -e "$root/$name" || -L "$root/$name" ]]
done
runuser -u eduardo -- test -r "$root/production.env"
runuser -u eduardo -- test -w "$root"
runuser -u eduardo -- docker info >/dev/null
mode="$(stat -c '%a' -- "$root/production.env")"
(( (8#$mode & 077) == 0 ))
python3 -c 'import fcntl, json, urllib.request; import sys; assert sys.version_info >= (3, 8)'
systemd-analyze verify "$script_dir/portfolio-autodeploy.service" "$script_dir/portfolio-autodeploy.timer"

install -d -o root -g root -m 755 "$controller_dir"
install -o root -g root -m 755 "$script_dir/auto-deploy.py" "$controller_dir/auto-deploy.py"
install -d -o eduardo -g eduardo -m 700 "$root/autodeploy" "$root/autodeploy/docker"
install -o root -g root -m 644 "$script_dir/portfolio-autodeploy.service" /etc/systemd/system/
install -o root -g root -m 644 "$script_dir/portfolio-autodeploy.timer" /etc/systemd/system/
systemctl daemon-reload
# Only the timer is enabled: the first check happens after installation.
systemctl enable --now portfolio-autodeploy.timer
systemctl is-active portfolio-autodeploy.timer
printf 'Installed: validated main releases will be checked every two minutes.\n'
printf 'Stop automatic publication with: systemctl disable --now portfolio-autodeploy.timer\n'
