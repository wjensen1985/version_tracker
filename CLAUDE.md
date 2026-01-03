# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- Delete unused or obsolete files when your changes make them irrelevant (refactors, feature removals, etc.), and revert files only when the change is yours or explicitly requested. If a git operation leaves you unsure about other agents’ in-flight work, stop and coordinate instead of deleting.
- **Before attempting to delete a file to resolve a local type/lint failure, stop and ask the user.** Other agents are often editing adjacent files; deleting their work to silence an error is never acceptable without explicit approval.
- NEVER edit `.env` or any environment variable files—only the user may change them.
- Coordinate with other agents before removing their in-progress edits—don’t revert or delete work you didn’t author unless everyone agrees.
- Moving/renaming and restoring files is allowed.
- ABSOLUTELY NEVER run destructive git operations (e.g., `git reset --hard`, `rm`, `git checkout`/`git restore` to an older commit) unless the user gives an explicit, written instruction in this conversation. Treat these commands as catastrophic; if you are even slightly unsure, stop and ask before touching them. *(When working within Cursor or Codex Web, these git limitations do not apply; use the tooling’s capabilities as needed.)*
- Never use `git restore` (or similar commands) to revert files you didn’t author—coordinate with other agents instead so their in-progress work stays intact.
- Always double-check git status before any commit
- Keep commits atomic: commit only the files you touched and list each path explicitly. For tracked files run `git commit -m “<scoped message>” -- path/to/file1 path/to/file2`. For brand-new files, use the one-liner `git restore --staged :/ && git add “path/to/file1” “path/to/file2” && git commit -m “<scoped message>” -- path/to/file1 path/to/file2`.
- Quote any git paths containing brackets or parentheses (e.g., `src/app/[candidate]/**`) when staging or committing so the shell does not treat them as globs or subshells.
- When running `git rebase`, avoid opening editors—export `GIT_EDITOR=:` and `GIT_SEQUENCE_EDITOR=:` (or pass `--no-edit`) so the default messages are used automatically.
- Never amend commits unless you have explicit written approval in the task thread

## Build and Development Commands

```bash
pnpm dev              # Start development server with Turbopack
pnpm dev:main         # Development with .env.main.local environment
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking (tsc --noEmit)
```

## Architecture Overview

This is a Next.js 16 App Router application for tracking version information of items within projects (e.g., device firmware versions).

### Data Model

- **Projects** - Top-level containers owned by users
- **Items** - Belong to projects, represent trackable entities (devices, components)
- **Item Versions** - Version history for each item, with `current_item_version_id` pointer

### Key Directories

- `app/lib/` - Core business logic
  - `data.ts` - All database queries (fetch, create, update, delete operations)
  - `actions.ts` - Server actions that wrap data functions with auth and form handling
  - `definitions.ts` - TypeScript type definitions for domain models
  - `db.ts` - Neon serverless database connection
  - `auth/` - Neon Auth client and server setup

- `app/components/` - Reusable UI components
- `app/dashboard/` - Protected dashboard routes with nested layouts
- `app/api/auth/[...path]/` - Auth API route handler

### Authentication

Uses Neon Auth (`@neondatabase/auth`) with social providers (Google, GitHub) and email OTP. Auth setup:
- Client: `app/lib/auth/client.ts` - `createAuthClient()`
- Server: `app/lib/auth/server.ts` - `createAuthServer()`
- API routes: `app/api/auth/[...path]/route.ts`

Note: `app/lib/auth.ts` contains a stub `getCurrentUserId()` that currently returns a hardcoded user ID.

### Database

Uses Neon serverless PostgreSQL via `@neondatabase/serverless`. The `sql` tagged template function is exported from `app/lib/db.ts`.

### Styling

Tailwind CSS with dark mode support via `next-themes`. Theme toggle component at `app/components/ThemeToggle.tsx`.

### Path Alias

`@/*` maps to project root (e.g., `@/app/components/...`).
