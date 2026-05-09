# Simple Task App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the heavier CRUD demo UI with a simple task app while keeping explicit `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` flows.

**Architecture:** Keep TanStack Router and Query, but collapse the `web` experience into a single main task screen. Use the list route for collection loading, keep selected-task loading on `'/items/$itemId'`, and render the selected task inline instead of as a separate dashboard panel. Simplify API validation so the frontend receives one friendly error message at a time.

**Tech Stack:** NestJS, class-validator, TanStack Router, TanStack Query, React, Vitest, Testing Library

---

### Task 1: Lock Friendly Validation with a Failing API Test

**Files:**
- Modify: `api/src/items/items.http.spec.ts`
- Modify: `api/src/items/dto/create-item.dto.ts`
- Modify: `api/src/items/dto/replace-item.dto.ts`
- Modify: `api/src/items/dto/patch-item.dto.ts`
- Modify: `api/src/configure-app.ts`

- [ ] **Step 1: Write a failing validation test**

```ts
await request(app.getHttpServer())
  .post('/api/items')
  .send({ title: '   ' })
  .expect(400)
  .expect(({ body }) => {
    expect(body.message).toBe('Title is required.');
  });
```

- [ ] **Step 2: Run the API test to verify it fails**

Run: `pnpm --filter api test src/items/items.http.spec.ts`
Expected: FAIL because the current API returns the default stacked validation messages

- [ ] **Step 3: Implement minimal validation cleanup**

```ts
@IsString({ message: 'Title must be text.' })
@IsNotEmpty({ message: 'Title is required.' })
title!: string;
```

```ts
exceptionFactory: (errors) => new BadRequestException(getValidationMessage(errors))
```

- [ ] **Step 4: Re-run the API test**

Run: `pnpm --filter api test src/items/items.http.spec.ts`
Expected: PASS

### Task 2: Lock the Simpler Screen and Method Semantics with Failing Web Tests

**Files:**
- Modify: `web/src/app/App.test.tsx`
- Modify: `web/src/app/App.tsx`
- Modify: `web/src/pages/items/items-layout-page.tsx`
- Modify: `web/src/pages/items/item-detail-page.tsx`
- Modify: `web/src/pages/items/items-list-page.tsx`
- Modify: `web/src/components/templates/items/items-page-template.tsx`
- Modify: `web/src/components/organisms/items/item-create-panel.tsx`
- Modify: `web/src/components/organisms/items/item-collection-panel.tsx`
- Modify: `web/src/components/organisms/items/item-detail-panel.tsx`
- Modify: `web/src/components/molecules/items/item-form.tsx`
- Modify: `web/src/components/molecules/items/item-list-card.tsx`
- Modify: `web/src/routes/items.tsx`
- Modify: `web/src/routes/items/$itemId.tsx`

- [ ] **Step 1: Write failing web assertions for the simpler UI**

```tsx
expect(await screen.findByRole('heading', { name: /tasks/i })).toBeInTheDocument()
expect(screen.queryByRole('heading', { name: /item dashboard/i })).not.toBeInTheDocument()
```

```tsx
await user.click(screen.getByRole('button', { name: /save title/i }))
expect(patchItem).toHaveBeenCalledWith(1, { title: 'Updated title' })
expect(replaceItem).not.toHaveBeenCalled()
```

```tsx
await user.click(screen.getByRole('button', { name: /save all changes/i }))
expect(replaceItem).toHaveBeenCalledWith(1, {
  title: 'Updated title',
  description: 'Updated description',
  completed: true,
})
```

- [ ] **Step 2: Run the web test to verify it fails**

Run: `pnpm --filter web test src/app/App.test.tsx`
Expected: FAIL because the current UI still renders the dashboard layout and current method actions

- [ ] **Step 3: Implement the minimal UI rewrite**

```tsx
<section className="mx-auto max-w-3xl space-y-6">
  <ItemCreatePanel ... />
  <ItemCollectionPanel ... />
</section>
```

```tsx
<button type="button" onClick={onSaveTitle}>Save title</button>
<button type="button" onClick={onSaveDescription}>Save description</button>
<button type="button" onClick={onSubmit}>Save all changes</button>
```

- [ ] **Step 4: Re-run the web test**

Run: `pnpm --filter web test src/app/App.test.tsx`
Expected: PASS

### Task 3: Verify the Whole Workspace

**Files:**
- Test: `api`
- Test: `web`

- [ ] **Step 1: Run focused API tests**

Run: `pnpm --filter api test`
Expected: PASS

- [ ] **Step 2: Run focused web tests**

Run: `pnpm --filter web test`
Expected: PASS

- [ ] **Step 3: Run full workspace verification**

Run: `pnpm test && pnpm lint && pnpm typecheck && pnpm build`
Expected: PASS with all workspaces green

- [ ] **Step 4: Commit**

```bash
git add api web docs/superpowers/specs/2026-05-09-simple-task-app-design.md docs/superpowers/plans/2026-05-09-simple-task-app.md
git commit -m "refactor: simplify the starter into a task app"
```
