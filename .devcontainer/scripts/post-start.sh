#!/usr/bin/env bash

set -euo pipefail

until mysqladmin ping -h db -u app -papp --silent; do
  echo "Waiting for MySQL..."
  sleep 2
done

pnpm db:migrate
