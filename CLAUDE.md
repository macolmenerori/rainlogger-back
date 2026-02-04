# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`rainlogger-back` is the backend service for the rainlogger platform. It is a TypeScript project targeting Node.js >= 24.0.0, managed with pnpm (10.28.2).

## Tooling & Setup

- **Package manager:** pnpm. Always use `pnpm` for install/add/remove.
- **TypeScript:** Strict mode enabled, CommonJS modules, compiles `src/` → `dist/`. Compile with `npx tsc`.
- **No build script is defined yet** — add one to `package.json` scripts as the project grows (e.g., `"build": "tsc"`).
- **No linter or test runner is configured yet.** When adding one, prefer ESLint for linting and Vitest or Jest for testing, and wire them into `package.json` scripts.

## Project Structure

```
src/          # All TypeScript source (rootDir)
dist/         # Compiled output (gitignored)
tsconfig.json # TS config — strict, ES6 target, commonjs
package.json  # main is set to app.js; update as entry point is established
```

`src/` is currently empty — source files go here. The `main` field in `package.json` points to `app.js`; update it to match the actual compiled entry point once one is created (e.g., `dist/index.js`).

## Key Decisions to Make Early

- **Web framework:** Nothing is installed yet. Choose and install a framework (e.g., Express, Fastify, Hapi) before writing route code.
- **Database / ORM:** Not yet selected. Pick an ORM or query builder (e.g., Prisma, Drizzle) alongside a database driver when persistence is needed.
- **Entry point:** Establish `src/index.ts` (or equivalent) as the app entry and wire it through `package.json` scripts.

## Environment

- Secrets and `.env` files are gitignored (`*.env`, `*.secrets`). Use `.env.example` to document required variables (without values) when env vars are introduced.
