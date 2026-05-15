#!/usr/bin/env bash

set -euo pipefail

if [ -n "${CODESPACE_NAME:-}" ]; then
  gh codespace ports visibility 3000:public 5173:public -c "$CODESPACE_NAME" || true
fi
