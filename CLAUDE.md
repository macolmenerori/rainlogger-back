# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`rainlogger-back` is the backend API for the rainlogger platform. It stores and serves logs of rainfall recorded on a given day, backed by a MongoDB database. It is a TypeScript project targeting Node.js >= 24.0.0, managed with pnpm (10.28.2).

## Tooling & Setup

- **Package manager:** pnpm. Always use `pnpm` for install/add/remove.
- **TypeScript:** Strict mode, CommonJS modules, compiles `src/` → `dist/`. Build with `pnpm build`.
- **Linter:** ESLint (flat config in `eslint.config.mjs`) with `typescript-eslint`, `eslint-plugin-prettier`, and `eslint-plugin-simple-import-sort`. Run with `pnpm lint`.
- **Formatter:** Prettier (`.prettierrc`). Run with `pnpm prettify`. Format-on-save is enabled via `.vscode/settings.json`.
- **Test runner:** Not yet configured. Prefer Vitest or Jest when adding one; wire it into `package.json` scripts.
- **IDE compatibility:** `.npmrc` sets `shamefully-hoist=true` so that `typescript` and `@types/*` are visible to VS Code's language server. `.vscode/settings.json` pins the workspace TypeScript version (note: `.vscode/` is gitignored — each developer needs this locally).

## Scripts

| Script | What it does |
|---|---|
| `pnpm build` | Compiles `src/` → `dist/` via `tsc` |
| `pnpm start` | Runs the compiled app (`node dist/server.js`) |
| `pnpm dev` | Starts the app with nodemon for hot-reload |
| `pnpm lint` | ESLint with auto-fix |
| `pnpm prettify` | Formats all files in `src/` |
| `pnpm types` | Type-checks without emitting (`tsc --noEmit`) |
| `pnpm verify` | Full pre-merge check: audit → lint → prettify → types → build |

## Project Structure

```
src/
  server.ts                   # Entry point — loads env, connects to MongoDB, starts the HTTP server
  app.ts                      # Express app factory — registers middleware, healthcheck, and routers
  routes/
    rainloggerRouter.ts       # Router for /api/v1/rainlogger endpoints
  controllers/
    authControllers.ts        # Auth middleware (protect) — validates Bearer tokens via external auth service
    rainlogControllers.ts     # Route handlers for rainlog CRUD operations
  models/
    rainlogModel.ts           # Mongoose schema and model for Rainlog
    rainlogTypes.ts           # TypeScript types for Rainlog (Rainlog, RainlogType)
    userTypes.ts              # TypeScript type for User (from external auth service)
  validations/
    rainlog.validations.ts    # express-validator chains for rainlog POST body and GET query params
  utils/
    catchAsync.ts             # Wrapper for async route handlers — catches rejections, returns 500
    methodNotAllowed.ts       # Middleware factory — returns 405 for disallowed HTTP methods
    consts.ts                 # Shared types (HTTPMethod)
dist/                         # Compiled JS output (gitignored)
eslint.config.mjs             # ESLint flat config
.prettierrc                   # Prettier options
.prettierignore               # Prettier ignore rules
.npmrc                        # pnpm config (shamefully-hoist=true)
tsconfig.json                 # TS config — strict, ES6 target, commonjs
package.json                  # Dependencies, scripts, engine constraints
```

## Architecture notes

- **Entry point:** `src/server.ts`. It loads `config.env` via `dotenv`, connects Mongoose to MongoDB, then starts the Express server. The `start` script runs the compiled equivalent (`dist/server.js`).
- **App / routing:** `src/app.ts` creates the Express app. It registers body-parsing (`express.json`, `express.urlencoded`) and `compression` middleware, exposes a `/healthcheck` GET endpoint, and mounts `rainloggerRouter` at `/api/v1/rainlogger`. A catch-all 404 handler is registered last.
- **Router:** `src/routes/rainloggerRouter.ts` defines the `/rainlog` and `/rainlog/filters` routes. `/rainlog` supports `POST` (create) and `GET` (fetch by ID via `?id=`). `/rainlog/filters` supports `GET` with query-param filters (`date`, `dateFrom`, `dateTo`, `realReading`, `location`, `loggedBy`). Non-allowed methods are rejected with a 405 via the `methodNotAllowed` utility.
- **Auth:** Routes that require authentication use the `protect` middleware (`src/controllers/authControllers.ts`). It extracts a Bearer token from the `Authorization` header and validates it against an external auth service at `AUTH_URL`. On success it attaches the user object to the request as `req.user`.
- **Validation:** Input validation is handled by `express-validator` chains defined in `src/validations/`. Chains are passed directly as middleware in the route definition. The controller calls `checkValidation()` to short-circuit with a 400 if any chain failed.
- **Controllers:** Route handlers live in `src/controllers/`. Async handlers are wrapped with `catchAsync` (`src/utils/catchAsync.ts`) to catch unhandled promise rejections and return a 500. Controllers construct the document explicitly (no raw `req.body` forwarding) before passing it to Mongoose.
- **Database:** Mongoose is used to talk to MongoDB. Connection string comes from the `DATABASE` env var. Models are defined in `src/models/` with corresponding TypeScript types.
- **Import ordering:** `eslint-plugin-simple-import-sort` enforces a grouped import order — third-party packages first, then internal paths, then relative paths. Keep this in mind when adding imports.

## Environment variables

Loaded from `config.env` (gitignored). Required variables:

| Variable | Description |
|---|---|
| `DATABASE` | MongoDB connection string (required — server exits if missing) |
| `AUTH_URL` | Base URL of the external auth service (required — used by `protect` middleware to validate Bearer tokens) |
| `PORT` | HTTP port (defaults to `8080` if unset) |

## Still to do

- Add a test runner (Vitest or Jest) and wire it into `package.json`.
- Update `"main"` in `package.json` (currently `app.ts`) to `dist/server.js` to match the actual entry point.
- Create a `config.env.example` listing required env vars without values.
- Add startup validation for `AUTH_URL` in `server.ts` (same pattern as `DATABASE`).
- Implement remaining CRUD routes (PUT, DELETE) in `rainloggerRouter.ts`. GET by ID and GET with filters are done.
- Fix `mongoose.model<RainlogType>` in `rainlogModel.ts` — the generic should be `Rainlog` (the plain type), not `RainlogType` (`HydratedDocument<Rainlog>`); Mongoose adds the hydration wrapper itself.
