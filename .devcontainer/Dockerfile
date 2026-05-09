FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

RUN apt-get update \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install -y --no-install-recommends default-mysql-client \
  && corepack enable \
  && corepack prepare pnpm@11.0.9 --activate \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
