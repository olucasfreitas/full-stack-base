# Web Import Aliases Design

**Goal:** Replace deep relative imports in the `web` app with explicit domain aliases that match the existing frontend structure.

## Scope

- Apply aliases in `web` only.
- Leave `api` unchanged for now.
- Leave generated files such as `web/src/routeTree.gen.ts` unchanged.
- Keep package imports unchanged.
- Keep same-folder `./...` imports relative.

## Alias Map

- `@app/*` -> `src/app/*`
- `@components/*` -> `src/components/*`
- `@entities/*` -> `src/entities/*`
- `@pages/*` -> `src/pages/*`
- `@routes/*` -> `src/routes/*`
- `@shared/*` -> `src/shared/*`
- `@test/*` -> `src/test/*`
- `@router` -> `src/router.tsx`

## Design

The alias source of truth will live in TypeScript and Vite:

1. Add `paths` entries to `web/tsconfig.app.json` using explicit `./src/...` targets that are compatible with TypeScript 6.
2. Add matching aliases to `web/vite.config.ts` so Vite dev, Vite build, and Vitest all resolve imports the same way.
3. Rewrite handwritten internal imports in `web/src` to use the domain aliases.

## Constraints

- Do not restructure the frontend folders.
- Do not change behavior.
- Do not touch generated route files manually.
- Prefer explicit domain aliases over a single catch-all `@/` alias.

## Verification

Because this is primarily a config/import refactor, verification is based on resolution and build health rather than new behavior tests:

- `pnpm --filter web test`
- `pnpm --filter web lint`
- `pnpm --filter web typecheck`
- `pnpm --filter web build`
