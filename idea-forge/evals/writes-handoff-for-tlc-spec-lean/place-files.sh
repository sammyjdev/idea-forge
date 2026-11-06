#!/usr/bin/env bash
# Copies the fixture into the run directory and stamps today's date on every
# check date, so the fixture findings never expire.
set -eu
cp -R "$(dirname "$0")/files/." .
today="$(date +%F)"
find . -name '*.md' -not -path './.git/*' -print0 | xargs -0 sed -i "s/2026-11-05/${today}/g"
