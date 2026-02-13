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
- **OpenAPI docs:** Generated via `swagger-jsdoc` from JSDoc annotations in `src/routes/rainloggerRouter.ts`. Run `pnpm generate:openapi` to regenerate `openapi.yaml`.
- **IDE compatibility:** `.npmrc` sets `shamefully-hoist=true` so that `typescript` and `@types/*` are visible to VS Code's language server. `.vscode/settings.json` pins the workspace TypeScript version (note: `.vscode/` is gitignored — each developer needs this locally).

## Scripts

| Script                       | What it does                                                    |
| ---------------------------- | --------------------------------------------------------------- |
| `pnpm build`                 | Compiles `src/` → `dist/` via `tsc`                             |
| `pnpm start`                 | Runs the compiled app (`node dist/server.js`)                   |
| `pnpm dev`                   | Starts the app with nodemon for hot-reload                      |
| `pnpm lint`                  | ESLint with auto-fix                                            |
| `pnpm prettify`              | Formats all files in `src/`                                     |
| `pnpm types`                 | Type-checks without emitting (`tsc --noEmit`)                   |
| `pnpm verify`                | Full pre-merge check: audit → lint → prettify → types → build   |
| `pnpm generate:openapi`      | Generates `openapi.yaml` at project root from JSDoc annotations |
| `pnpm generate:openapi:json` | Same as above but outputs `openapi.json` instead                |

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
    rainlog.validations.ts    # express-validator chains for rainlog POST/PUT body, GET query params, and DELETE path param
  utils/
    catchAsync.ts             # Wrapper for async route handlers — catches rejections, returns 500
    checkEnvVars.ts           # Validates all required env vars at startup — exits with code 1 if any are missing
    methodNotAllowed.ts       # Middleware factory — returns 405 for disallowed HTTP methods
    consts.ts                 # Shared types (HTTPMethod)
dist/                         # Compiled JS output (gitignored)
scripts/
  generateOpenapi.ts          # Generates OpenAPI spec from JSDoc annotations in routes
openapi.yaml                  # Generated OpenAPI 3.0 specification (run pnpm generate:openapi)
config.env.example            # Template listing all required env vars (no secrets)
eslint.config.mjs             # ESLint flat config
.prettierrc                   # Prettier options
.prettierignore               # Prettier ignore rules
.npmrc                        # pnpm config (shamefully-hoist=true)
tsconfig.json                 # TS config — strict, ES6 target, commonjs
package.json                  # Dependencies, scripts, engine constraints
```

## Architecture notes

- **Entry point:** `src/server.ts`. It loads `config.env` via `dotenv`, runs `checkEnvVars()` to verify all required env vars are present (exits with code 1 if not), connects Mongoose to MongoDB, then starts the Express server. The `start` script runs the compiled equivalent (`dist/server.js`).
- **App / routing:** `src/app.ts` creates the Express app. Security middleware is registered first: `cors` (origin whitelist driven by `CORS_WHITELIST`), `helmet` (security HTTP headers, CSP disabled), and `express-rate-limit` (applied to `/api` routes, configurable via `RATELIMIT_MAXCONNECTIONS` and `RATELIMIT_WINDOWMS`). Body-parsing (`express.json`, `express.urlencoded`), `express-mongo-sanitize` (NoSQL injection protection), and `compression` middleware follow. A `/healthcheck` GET endpoint is exposed, and `rainloggerRouter` is mounted at `/api/v1/rainlogger`. A catch-all 404 handler is registered last.
- **Router:** `src/routes/rainloggerRouter.ts` defines the `/rainlog`, `/rainlog/filters`, and `/rainlog/delete/:id` routes. `/rainlog` supports `POST` (create), `GET` (fetch by ID via `?id=`), and `PUT` (full update — body must include `_id` plus all fields; `timestamp` and `loggedBy` are re-stamped server-side). `POST` and `PUT` reject duplicate `date` + `location` combinations with a 409 Conflict. `/rainlog/filters` supports `GET` with query-param filters (`date`, `dateFrom`, `dateTo`, `realReading`, `location`, `loggedBy`). `/rainlog/delete/:id` supports `DELETE` (removes the rainlog with the given ID; returns 204 No Content). Non-allowed methods are rejected with a 405 via the `methodNotAllowed` utility.
- **OpenAPI documentation:** The router file contains `@openapi` JSDoc annotations that describe each endpoint, including request/response schemas, parameters, and examples. Run `pnpm generate:openapi` to regenerate `openapi.yaml` at the project root. The generation script (`scripts/generateOpenapi.ts`) uses `swagger-jsdoc` to parse annotations and outputs YAML by default (use `--json` flag for JSON).
- **Auth:** Routes that require authentication use the `protect` middleware (`src/controllers/authControllers.ts`). It extracts a Bearer token from the `Authorization` header and validates it against an external auth service at `AUTH_URL`. On success it attaches the user object to the request as `req.user`.
- **Validation:** Input validation is handled by `express-validator` chains defined in `src/validations/`. Chains are passed directly as middleware in the route definition. The controller calls `checkValidation()` to short-circuit with a 400 if any chain failed.
- **Controllers:** Route handlers live in `src/controllers/`. Async handlers are wrapped with `catchAsync` (`src/utils/catchAsync.ts`) to catch unhandled promise rejections and return a 500. Controllers construct the document explicitly (no raw `req.body` forwarding) before passing it to Mongoose.
- **Database:** Mongoose is used to talk to MongoDB. Connection string comes from the `DATABASE` env var. Models are defined in `src/models/` with corresponding TypeScript types. The `Rainlog` model has a compound unique index on `{ date, location }`.
- **Import ordering:** `eslint-plugin-simple-import-sort` enforces a grouped import order — third-party packages first, then internal paths, then relative paths. Keep this in mind when adding imports.

## Environment variables

Loaded from `config.env` (gitignored). A template is provided in `config.env.example`. All variables below are validated by `checkEnvVars()` at startup — the server exits with code 1 if any are missing.

| Variable                   | Description                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `NODE_ENV`                 | Environment name (e.g. `development`, `production`)                                            |
| `PORT`                     | HTTP port                                                                                      |
| `DATABASE`                 | MongoDB connection string                                                                      |
| `AUTH_URL`                 | Base URL of the external auth service (used by `protect` middleware to validate Bearer tokens) |
| `RATELIMIT_MAXCONNECTIONS` | Maximum number of requests allowed per window (applied to `/api` routes)                       |
| `RATELIMIT_WINDOWMS`       | Rate-limit window duration in milliseconds                                                     |
| `CORS_WHITELIST`           | Comma-separated list of allowed origins for CORS                                               |

## Still to do

-
