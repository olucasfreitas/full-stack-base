#!/usr/bin/env bash

set -euo pipefail

corepack enable
corepack prepare pnpm@11.0.9 --activate
pnpm install
