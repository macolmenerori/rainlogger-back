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
    rainloggerRouter.ts       # Router stub for /api/v1/rainlogger endpoints (routes to be added here)
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
- **App / routing:** `src/app.ts` creates the Express app. It exposes a `/healthcheck` GET endpoint and mounts `rainloggerRouter` at `api/v1/rainlogger`. A catch-all 404 handler is registered last.
- **Router:** `src/routes/rainloggerRouter.ts` is currently an empty Express router. Rainfall-log CRUD routes will be added here, paired with Mongoose models and controllers as the API grows.
- **Database:** Mongoose is used to talk to MongoDB. Connection string comes from the `DATABASE` env var.
- **Import ordering:** `eslint-plugin-simple-import-sort` enforces a grouped import order — third-party packages first, then internal paths, then relative paths. Keep this in mind when adding imports.

## Environment variables

Loaded from `config.env` (gitignored). Required variables:

| Variable | Description |
|---|---|
| `DATABASE` | MongoDB connection string (required — server exits if missing) |
| `PORT` | HTTP port (defaults to `8080` if unset) |

## Still to do

- Add Mongoose models for rainfall-log data.
- Implement CRUD routes in `rainloggerRouter.ts`.
- Add a test runner (Vitest or Jest) and wire it into `package.json`.
- Update `"main"` in `package.json` (currently `app.js`) to `dist/server.js` to match the actual entry point.
- Create a `config.env.example` listing required env vars without values.
