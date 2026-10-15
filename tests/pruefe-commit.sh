#!/bin/sh
# Prüft einen Commit in einem Schnappschuss, damit am Arbeitsbaum weitergearbeitet werden kann.
#   sh tests/pruefe-commit.sh <commit> [weitere Optionen für regression.mjs]
set -e
C=${1:-HEAD}; shift || true
HIER=$(cd "$(dirname "$0")" && pwd)
SNAP=$(mktemp -d "${TMPDIR:-/tmp}/hs-snap-XXXX")
git -C "$HIER/.." archive "$C" | tar -x -C "$SNAP"
echo "Commit $(git -C "$HIER/.." rev-parse --short "$C") -> $SNAP"
cd "$HIER" && HS_WURZEL="$SNAP" node regression.mjs "$@"; R=$?
rm -rf "$SNAP"; exit $R
