# Full Stack Base

A clean starter workspace with a React frontend, a NestJS API, and a Drizzle-backed MySQL database.

## Stack

- `web`: Vite, React, TypeScript, Tailwind CSS, TanStack Router, TanStack Query, `ky`
- `api`: NestJS, TypeScript, Drizzle ORM, MySQL
- Tooling: `pnpm` workspace, Docker Compose devcontainer, GitHub Codespaces support

## Workspace layout

```text
.
├── api
├── web
└── .devcontainer
```

## Quick start

### GitHub Codespaces

1. Open the repository in a Codespace.
2. Wait for the devcontainer to finish `postCreateCommand`.
3. Run:

   ```bash
   pnpm dev
   ```

4. Open the forwarded `5173` port to use the web app.

The Codespace container already includes:

- Node `24`
- `pnpm` through Corepack
- a MySQL client
- a MySQL `8.4` service running as `db`

The post-create setup installs dependencies and applies the current Drizzle migrations automatically.

### Local development

1. Use Node `24` and enable Corepack:

   ```bash
   corepack enable
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the MySQL service:

   ```bash
   docker compose -f .devcontainer/docker-compose.yml up -d db
   ```

   That service publishes MySQL on `127.0.0.1:3306` for host-based local development.

4. Create the API env file:

   ```bash
   cp api/.env.example api/.env
   ```

5. Apply migrations:

   ```bash
   pnpm db:migrate
   ```

6. Start both apps:

   ```bash
   pnpm dev
   ```

The database starts empty by design. Create records through the frontend to verify the task flow.

## Environment variables

Root-level `.env.example` documents every variable used across the workspace.

### API

See `api/.env.example`:

- `DATABASE_URL`
- `PORT`
- `CORS_ORIGIN`

### Web

See `web/.env.example`:

- `VITE_API_BASE_URL`

The frontend defaults to a relative `/api` base path and Vite proxies that path to the Nest API in development.
TanStack Router owns client-side navigation under `web/src/routes`, and TanStack Query owns server-state loading and mutations.

## Scripts

From the repository root:

- `pnpm dev`: run the frontend and API together
- `pnpm dev:web`: run only the Vite frontend
- `pnpm dev:api`: run only the Nest API
- `pnpm build`: build both projects
- `pnpm test`: run the workspace unit and integration tests
- `pnpm typecheck`: run TypeScript checks across the workspace
- `pnpm db:generate`: generate a new Drizzle migration
- `pnpm db:migrate`: apply existing Drizzle migrations
- `pnpm db:studio`: open Drizzle Studio

## API routes

- `GET /api/health`
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`

Validation errors use Nest's standard `400` response shape, including a `message`
array when multiple constraints fail.

## What the sample app demonstrates

- `/` redirects to `/items`
- `/items` preloads the collection through a route loader backed by TanStack Query
- `/items/:id` preloads the selected record through a typed detail route loader
- the create form sends `POST /api/items`
- selecting a task loads `GET /api/items/:id`
- single-field edits send `PATCH /api/items/:id`
- full-task saves send `PUT /api/items/:id`
- deleting a task sends `DELETE /api/items/:id` and returns to `/items`

## Database workflow

The Drizzle schema lives in `api/src/db/schema.ts`, and generated SQL migrations live in `api/drizzle/`.

When the schema changes:

```bash
pnpm db:generate
pnpm db:migrate
```
