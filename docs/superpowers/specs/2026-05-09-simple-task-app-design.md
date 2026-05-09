# Simple Task App Design

**Goal:** Turn the sample CRUD UI into a clean single-screen task app while still exercising `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

## Product Shape

- Keep the data model simple:
  - `title: string`
  - `completed: boolean`
  - `description?: string`
- Keep one primary screen at `'/items'`.
- Keep `'/items/:itemId'` as an inline-selected task state, not as a separate dashboard panel.

## Route and API Semantics

- `GET /api/items` loads the task list.
- `GET /api/items/:id` loads one selected task when its inline editor is opened.
- `POST /api/items` creates a task.
- `PATCH /api/items/:id` is only for single-field edits:
  - toggle `completed`
  - edit `title` only
  - edit `description` only
- `PUT /api/items/:id` is only for saving the full task object when all task fields are submitted together.
- `DELETE /api/items/:id` removes the task.

## UI Direction

- Replace the current dashboard layout with a simpler vertical flow:
  1. compact page header
  2. quick-add form
  3. task list
  4. inline selected-task editor under the list when a task is opened
- Remove API-demo copy and reduce visual weight.
- Use human-facing labels like `Tasks`, `Add task`, `Save title`, `Save details`, and `Delete task`.

## Editing Model

- The quick-add form submits `POST` with `title`, optional `description`, and `completed: false`.
- Each task row supports a fast complete/incomplete toggle using `PATCH`.
- Opening a task loads it with `GET /api/items/:id`.
- The inline editor exposes:
  - a title-only `PATCH`
  - a description-only `PATCH`
  - a full-task `PUT`
  - a `DELETE`

## Validation and Error Messaging

- Remove unnecessary max-length rules for this starter app.
- Keep only useful type and required-field validation.
- Return friendly single-message validation errors such as `Title is required.` instead of stacked framework messages.
- Frontend error rendering should show a single concise message.

## Constraints

- Keep TanStack Router and TanStack Query in place.
- Keep the atomic-design folder structure.
- Preserve the starter’s CRUD coverage across the five HTTP methods.

## Verification

- API integration test covers friendly validation and CRUD semantics.
- Frontend app test covers the simpler task screen and the `PATCH` vs `PUT` interaction split.
- Full workspace verification:
  - `pnpm test`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
