FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

COPY package.json /tmp/full-stack-base-package.json

RUN apt-get update \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install -y --no-install-recommends default-mysql-client \
  && corepack enable \
  && corepack prepare "$(node -p "require('/tmp/full-stack-base-package.json').packageManager")" --activate \
  && rm -f /tmp/full-stack-base-package.json \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
