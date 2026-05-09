# Web Import Aliases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace handwritten deep relative imports in the `web` app with domain aliases that match the current frontend architecture.

**Architecture:** Keep the existing `app`, `components`, `entities`, `pages`, `routes`, `shared`, and `test` folder boundaries. Make TypeScript and Vite share the same alias map so dev, build, and test resolution stay aligned. Leave generated files and package imports unchanged.

**Tech Stack:** Vite, React, TypeScript, Vitest, TanStack Router, TanStack Query

---

### Task 1: Configure Alias Resolution

**Files:**
- Modify: `web/tsconfig.app.json`
- Modify: `web/vite.config.ts`

- [ ] **Step 1: Add TypeScript path aliases**

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/app/*"],
      "@components/*": ["./src/components/*"],
      "@entities/*": ["./src/entities/*"],
      "@pages/*": ["./src/pages/*"],
      "@routes/*": ["./src/routes/*"],
      "@shared/*": ["./src/shared/*"],
      "@test/*": ["./src/test/*"],
      "@router": ["./src/router.tsx"]
    }
  }
}
```

- [ ] **Step 2: Add matching Vite aliases**

```ts
import { fileURLToPath, URL } from 'node:url'

resolve: {
  alias: {
    '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
    '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
    '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
    '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    '@test': fileURLToPath(new URL('./src/test', import.meta.url)),
    '@router': fileURLToPath(new URL('./src/router.tsx', import.meta.url)),
  },
}
```

- [ ] **Step 3: Verify TypeScript and Vite resolve the aliases**

Run: `pnpm --filter web typecheck`
Expected: PASS with exit code `0`

### Task 2: Rewrite Handwritten Frontend Imports

**Files:**
- Modify: `web/src/main.tsx`
- Modify: `web/src/router.tsx`
- Modify: `web/src/routes/__root.tsx`
- Modify: `web/src/routes/items.tsx`
- Modify: `web/src/routes/items/index.tsx`
- Modify: `web/src/routes/items/$itemId.tsx`
- Modify: `web/src/app/App.test.tsx`
- Modify: `web/src/pages/items/items-layout-page.tsx`
- Modify: `web/src/pages/items/item-detail-page.tsx`
- Modify: `web/src/pages/items/items-list-page.tsx`
- Modify: `web/src/components/templates/items/items-page-template.tsx`
- Modify: `web/src/components/organisms/items/item-create-panel.tsx`
- Modify: `web/src/components/organisms/items/item-collection-panel.tsx`
- Modify: `web/src/components/organisms/items/item-detail-panel.tsx`
- Modify: `web/src/components/molecules/items/item-form.tsx`
- Modify: `web/src/components/molecules/items/item-list-card.tsx`
- Modify: `web/src/components/molecules/items/item-meta-summary.tsx`
- Modify: `web/src/entities/item/api.ts`
- Modify: `web/src/entities/item/queries.ts`

- [ ] **Step 1: Replace deep relative imports with domain aliases**

```ts
import { useToast } from '@app/use-toast'
import { ItemDetailPanel } from '@components/organisms/items/item-detail-panel'
import { patchItem, removeItem, replaceItem } from '@entities/item/api'
import { getErrorMessage } from '@shared/api/get-error-message'
import { createAppRouter } from '@router'
```

- [ ] **Step 2: Keep same-folder relative imports unchanged**

```ts
import { getItem, listItems } from './api'
```

- [ ] **Step 3: Leave generated files alone**

```ts
// Do not manually edit web/src/routeTree.gen.ts
```

- [ ] **Step 4: Verify linting catches no stale or unresolved imports**

Run: `pnpm --filter web lint`
Expected: PASS with exit code `0`

### Task 3: Verify the Refactor End to End

**Files:**
- Test: `web`

- [ ] **Step 1: Run frontend tests**

Run: `pnpm --filter web test`
Expected: PASS with all web tests green

- [ ] **Step 2: Run typecheck again after import rewrites**

Run: `pnpm --filter web typecheck`
Expected: PASS with exit code `0`

- [ ] **Step 3: Run production build**

Run: `pnpm --filter web build`
Expected: PASS with Vite build output and exit code `0`

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-05-09-web-import-aliases-design.md \
  docs/superpowers/plans/2026-05-09-web-import-aliases.md \
  web/tsconfig.app.json \
  web/vite.config.ts \
  web/src
git commit -m "refactor: add frontend import aliases"
```
