# TeddyMart (Myeki) Monorepo

Combined codebase for the TeddyMart / Myeki marketplace, formerly split across
two repositories:

- [`apps/frontend`](apps/frontend) — Next.js 15 / React / TypeScript storefront (formerly `teddymartNaija`)
- [`apps/backend`](apps/backend) — Laravel 11 / PHP 8.2 API (formerly `teddymart-backend`)

Each app keeps its own `README.md`, `.env.example`, `.docker/` deploy tooling
and dependency lockfile — see [`apps/frontend/README.md`](apps/frontend/README.md)
and [`apps/backend/README.md`](apps/backend/README.md) for app-specific setup.

## Why one repo

Both apps ship together (the frontend talks directly to this backend's API,
Reverb websockets, and Sanctum auth) and were already versioned in lockstep
across matching `develop` / `staging` / `production` branches. Keeping them
in one repo makes cross-cutting changes (e.g. an API contract change plus its
frontend consumer) a single PR instead of two coordinated ones.

## CI/CD

Deploys stay independent per app. Each workflow in
[`.github/workflows/`](.github/workflows) is scoped with a `paths:` filter so
a change under `apps/backend/**` only redeploys the backend container, and a
change under `apps/frontend/**` only redeploys the frontend container:

| Workflow | Branch | Deploys |
| --- | --- | --- |
| `frontend-production.yml` | `production` | `apps/frontend` → `martfront-prod` |
| `backend-production.yml` | `production` | `apps/backend` → `teddymart-prod` |
| `backend-staging.yml` | `staging` | `apps/backend` → `teddymart-staging` |
| `backend-develop.yml` | `develop` | `apps/backend` → `teddymart-dev` |

> **Server-side note:** each deploy script `cd`s into its app directory
> (`apps/frontend` or `apps/backend`) before running `.docker/deploy.sh`, so
> the existing `docker-compose.yml` files work unchanged as long as the
> running containers' bind mounts point at the app subdirectory
> (e.g. `.../production/apps/backend:/var/www`), not the repo root. Confirm
> this when first deploying from the merged repo — the container volume
> mounts need to be recreated once, since `.:/var/www` in `apps/backend`'s
> compose file resolves relative to that file's own directory.

## History

Both apps' full git history was preserved: `apps/backend` was merged in via
`git subtree`, so `git log -- apps/backend` still shows every original
backend commit and author.
