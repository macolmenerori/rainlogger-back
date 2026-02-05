# rainlogger-back

Backend API for the [rainlogger](https://github.com/macolmenerori/rainlogger-back) platform. Stores and serves rainfall measurement logs backed by a MongoDB database. Built with Express 5, TypeScript, and Mongoose.

## Requirements

| Dependency | Version            |
| ---------- | ------------------ |
| Node.js    | >= 24.0.0          |
| pnpm       | 10.28.2            |
| MongoDB    | any recent version |

[Opensesame](https://github.com/macolmenerori/opensesame-back) authentication service must be running and reachable at the URL configured in `AUTH_URL`. All API endpoints require a valid Bearer token issued by that service.

## Setup and running

### With Docker

The Dockerfile uses a multi-stage build: dependencies and source are compiled in an intermediate stage, and only the production `node_modules` and compiled `dist/` output are copied into the final image.

Before building, make sure a `config.env` file exists at the project root (see [Configuration](#configuration) below). The image copies it in at build time.

```bash
# Build the image
docker build -t rainlogger-back .

# Run it (port 8082 is exposed by the container)
docker run -p 8082:8082 rainlogger-back
```

The container includes a healthcheck that pings `/healthcheck` every 120 seconds. You can verify it manually while the container is running:

```bash
curl http://localhost:8082/healthcheck
```

### Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Create and edit the env file (see Configuration below)
cp config.env.example config.env

# 3. Start the development server (uses nodemon for hot-reload)
pnpm dev
```

The server starts on the port defined in `config.env` (default `8082`). A healthcheck endpoint is available at `http://localhost:8082/healthcheck`.

## Configuration

All environment variables are loaded from a `config.env` file at the project root. A template with every required variable is provided in `config.env.example`:

```bash
cp config.env.example config.env
```

Open `config.env` and fill in the values:

| Variable                   | Default in example                                  | Description                                                           |
| -------------------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `NODE_ENV`                 | `development`                                       | Environment name (e.g. `development`, `production`)                   |
| `PORT`                     | `8082`                                              | HTTP port the server listens on                                       |
| `DATABASE`                 | _(empty — must be set)_                             | MongoDB connection string                                             |
| `AUTH_URL`                 | `http://127.0.0.1:8080/api/v1`                      | Base URL of the external auth service used to validate Bearer tokens  |
| `RATELIMIT_MAXCONNECTIONS` | `100`                                               | Max requests allowed per rate-limit window (applied to `/api` routes) |
| `RATELIMIT_WINDOWMS`       | `3600000` (1 hour)                                  | Rate-limit window duration in milliseconds                            |
| `CORS_WHITELIST`           | `http://localhost,http://host.docker.internal:8080` | Comma-separated list of origins allowed by CORS                       |

The server validates that all required variables are present at startup and exits with code 1 if any are missing.

## Available scripts

| Script                       | What it does                                                    |
| ---------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                   | Starts the app with nodemon (hot-reload)                        |
| `pnpm build`                 | Compiles `src/` → `dist/` via `tsc`                             |
| `pnpm start`                 | Runs the compiled app (`node dist/server.js`)                   |
| `pnpm lint`                  | Runs ESLint with auto-fix                                       |
| `pnpm prettify`              | Formats all files in `src/` with Prettier                       |
| `pnpm types`                 | Type-checks without emitting (`tsc --noEmit`)                   |
| `pnpm verify`                | Full pre-merge check: audit → lint → prettify → types → build   |
| `pnpm generate:openapi`      | Regenerates `openapi.yaml` from JSDoc annotations in the router |
| `pnpm generate:openapi:json` | Same as above, outputs `openapi.json` instead                   |

## API overview

All endpoints are mounted under `/api/v1/rainlogger` and require Bearer token authentication. The full specification is in [`openapi.yaml`](openapi.yaml).

| Method | Endpoint               | Description                                                                                             |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| POST   | `/rainlog`             | Create a new rainlog entry                                                                              |
| GET    | `/rainlog?id=<id>`     | Retrieve a single rainlog by MongoDB ObjectId                                                           |
| PUT    | `/rainlog`             | Update an existing rainlog (all fields required; `timestamp` and `loggedBy` are re-stamped server-side) |
| GET    | `/rainlog/filters`     | Query rainlogs by filters (`date`, `dateFrom`, `dateTo`, `realReading`, `location`, `loggedBy`)         |
| DELETE | `/rainlog/delete/<id>` | Delete a rainlog by MongoDB ObjectId (returns 204)                                                      |

A healthcheck endpoint is available at `GET /healthcheck` (no authentication required).

## CI

A GitHub Actions workflow (`.github/workflows/CI.yml`) runs on every push and pull request targeting `master`. It installs dependencies, builds the project, starts the server, and verifies the healthcheck endpoint responds correctly.

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.
