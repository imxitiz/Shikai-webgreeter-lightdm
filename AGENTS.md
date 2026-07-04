# AGENTS.md — Shikai (agent-readable)

## 1. Title & 1-liner tagline

Shikai — Modern LightDM WebKit2 greeter theme (agent-readable, machine-first guidance)

---

## 2. TL;DR (3 lines)

- Purpose: A static, Vite-driven React greeter/theme for LightDM with install/release scripts for packaging and system install.
- Top-3 commands: `bun install` → `bun run server` (dev) → `bun run build` (production). ✅
- Owners/contacts: author `imxitiz` (GitHub: `imxitiz`).

---

## 3. Quick Start — exact runnable commands

(Repo uses Bun when present.)

Install (dependencies)

- bun install

Development (local server with HMR)

- bun run server
- alternative: bun run dev

Build (production static assets)

- bun run build

Watch (incremental build)

- bun run watch

Preview production build

- bun run preview

Install theme to system (packaging script)

- bash ./scripts/install.sh
- dev install: bash ./scripts/install-dev.sh

Release

- ./scripts/make-release.sh

Type-check

- npx tsc --noEmit

Notes

- No `test`, `lint`, or `format` scripts are defined in `package.json`. Add `test` (vitest/jest), `lint` (eslint), and `format` (prettier) scripts when adding CI checks.

---

## 4. Architecture (ASCII, 3–8 lines)

Frontend (Vite + React + Tailwind) -> UI Components (src/js/*) -> State & Services (src/js/State, src/js/Greeter) -> System integration via scripts/ (install/release)

Dev flow:
Developer → `bun run server` (Vite dev) → browser HMR → local editing
Production flow:
Source → `bun run build` → static assets → package /install script → LightDM theme directory

---

## 5. Key Paths (short table)

- `src/` → app source (TSX/TS + CSS)
- `src/js/Components/` → UI components and atoms
- `src/js/Greeter/` → greeter-specific logic (commands, notifications, storage)
- `src/css/` → styles, Tailwind and SCSS
- `src/js/State/` → app store and types
- `scripts/` → install, release, and helper shell scripts
- `package.json` → scripts & dependencies
- `bunfig.toml` → Bun config (present — prefer Bun)
- `docs/` → contributor and migration docs
- `public/` → static assets served by Vite

---

## 6. Core Modules & Responsibilities (1-liner + type signature/example)

- UI Components (`src/js/Components/*`): reusable components (e.g., `Avatar(props: AvatarProps): JSX.Element`).
- Greeter Logic (`src/js/Greeter/*`): business flows and operations (e.g., `login(user: Credentials): Promise<AuthResult>`).
- State (`src/js/State`): central store (Zustand) (e.g., `getState<T>(): T`).
- Tools (`src/js/Tools/*`): utilities (formatters, copy, dictionary). Pure functions preferred (`formatDate(d: Date): string`).
- Scripts (`scripts/*`): system-level install/release steps invoked by maintainers (shell scripts - executable CLI).

---

## 7. Message / API Protocols (examples)

- Dev HTTP: Vite dev server serves the app over HTTP (local preview only).
- System integration: `scripts/install.sh` is the install API (CLI contract): `./scripts/install.sh [--prefix DIR]` (validate in script).
- No public HTTP API server is provided — the app is a static greeter packaged for LightDM. If adding an API, document route shapes and version them.

---

## 8. Code Style & Conventions

- TypeScript `strict` where possible.
- Max ~50 lines per function/module — split to keep atomic.
- Naming: `camelCase` for vars, `PascalCase` for React components.
- Imports: prefer explicit named imports and barrels (`index.ts`) per feature folder.
- Centralize constants & config in `/config` (no hardcoding of strings, URLs, timeouts).
- Feature flags: `FEATURE_*` env or centralized flags file; guard features behind flags.

---

## 9. Configuration & Feature Flags

- Environment variables used: `NODE_ENV` (used in store). Example: `{ name: 'shikai-store', enabled: process.env.NODE_ENV !== 'production' }`.
- **Bun registry configuration (NEW — security fix 2026-07-04):**
  - `BUN_REGISTRY` — npm registry URL (default: `https://registry.npmjs.org`)
  - `BUN_TOKEN` — authentication token for private registry
  - Configured in `bunfig.toml` via `${BUN_REGISTRY:-https://registry.npmjs.org}` and `${BUN_TOKEN}` — **NO HARDCODED SECRETS**
- No centralized feature flag system currently — add `config/featureFlags.ts` or env-driven toggles for new features.
- **Zero Hardcoding SWE Principle enforced:** All configuration via environment variables; `bunfig.toml` uses env substitution with safe defaults.

---

## 10. Testing Strategy

- Focus tests on the Service Layer (`src/js/Greeter/*`, `src/js/Tools/*`) using unit tests + a small integration suite.
- Key commands (recommended additions):
  - `bun run test` (vitest/jest)
  - `bun run lint` (eslint)
  - `bun run format` (prettier)

- 5 critical test scenarios to add:
  1. Build produces expected static assets (sanity smoke test for `bun run build`).
  2. Login form renders and handles validation errors.
  3. Authentication flow returns success and sets proper store state.
  4. Session selection persists and is restored across reloads.
  5. `scripts/install.sh` exits 0 and places files into expected target directories (mock or run in sandbox).

---

## 11. Troubleshooting — Top 8 problems & fixes

1. Dev server not starting → `bun run server`, check `bun --version`, `node --version`; clear caches, restart dev server. ⚠️
2. Build fails → run `npx tsc --noEmit` to surface type errors; run `bun run build` with `--debug` if needed.
3. Missing assets in production → run `bun run build` and `bun run preview` locally to validate.
4. CSS/Tailwind problems → re-run `npx tailwindcss -i src/css/tailwind.css -o dist/tailwind.css` or check `tailwind.config.cjs`.
5. Install script permission errors → ensure `chmod +x scripts/install.sh` and run with `sudo` where required.
6. Release script fails → inspect `./scripts/make-release.sh` logs and version tags; test locally before CI.
7. Type errors not caught → add `test:ts` script `npx tsc --noEmit` to CI.
8. Unexpected runtime error in production → collect browser console logs, reproduce with `bun run preview`.

---

## 12. Adding New Features — step-by-step recipe

1. Create a feature branch: `feature/<short-description>`
2. Add feature flag (env or `config/featureFlags.ts`) and default OFF.
3. Implement Service-layer logic and keep UI thin.
4. Add unit tests for Service and one integration/UI test.
5. Add or update docs in `docs/` and a short note in `README.md` if user-facing.
6. Run `bun run build`, `npx tsc --noEmit`, `bun run test` locally.
7. Open PR with description, short justification, and the quality checklist results.
8. Ensure changes touch ≤3 files for simple features; refactor if spread is larger.

---

## 13. Maintenance Guidelines

- Update `AGENTS.md` when you change: build/CI commands, package manager (Bun → pnpm), public APIs, or config/feature flag schema.
- When changing packaging or install scripts, update `scripts/` docs and `AGENTS.md` Quick Start commands.
- If adding tests/linting, add corresponding CI steps and update Quick Start.

---

## 14. SELF-UPDATE POLICY (COPY EXACTLY)

- Update `AGENTS.md` only for **significant** changes: architecture/service-boundary changes; package manager or CI/build command changes; config or feature flag schema changes; public API or persistence schema changes.
- Do **not** update for small bug fixes, cosmetic refactors, or private non-behavior edits unless they change a verbatim instruction/command in this file.
- When updating, **improve and merge** into existing content — do not replace human-written guidance without documented justification in the PR.
- Do not include changelog entries or who/when metadata inside AGENTS.md.

---

## 15. SWE Best Practices (COPY VERBATIM)

> BEST SWE PRACTICES FOR AI TO FOLLOW WHEN WORKING ON ANY PROJECT

## Model Context Protocol (MCP)

As an AI coding agent, you may have access to external tools via the Model Context Protocol (MCP). Use external tools only when they directly improve accuracy, verification, or understanding of a task—prioritizing efficiency, safety, and relevance. User instructions take precedence.

## Code Style

- Favor strict, type-safe code when the language supports it (TS `strict` mode, typed Python, Rust, etc.).
- Use functional patterns (pure functions, immutability) where appropriate.
- Atomic modules: limit functions/modules to ~50 lines. Refactor when longer.

## Identity & Mantra

You are an industrial-grade Software Architect & Systems Engineer. Code must be production-quality, maintainable, and scalable.
**Mantra**: “Change ONCE — reflect EVERYWHERE.”

## Architectural Standards (Layered Law)

Enforce a layered architecture with at least two abstraction layers between major components:

1. Presentation / Trigger (UI, CLI, Cron) — dumb wrappers.
2. Controller / Orchestrator — validate & route.
3. Service Layer (business logic) — single source of truth for rules/transactions.
4. Repository / Adapter — I/O, DB, API calls.
5. Infrastructure / Config — env and connection settings.

### Dependency Rule

- Inner layers must not depend on outer layers. Use dependency injection; do not instantiate externals inside services.

## Core Development Rules

- Centralize constants/config in `/config`.
- No hardcoded values (strings, URLs, timeouts).
- Wrap common patterns (retry, logging, try/catch) in utilities.

## Performance & Resilience

- Async-first I/O.
- Timeouts (default ≤ 5s), retries with exponential backoff, circuit-breakers for critical external calls.
- Null-safety: guard inputs aggressively.

## Customizability & Feature Flags

- Assume tomorrow everything changes. Put changes behind feature flags.
- Use adapter pattern for external systems.

## Folder Structure (Feature-based)

- Organize by feature. Each feature folder must export via an `index` barrel file.

## Tooling Standards

- Prefer Bun when present; then pnpm; then npm. Use language-native tooling (cargo, go, pipenv) per project.
- TypeScript strict mode recommended for JS projects.

## Testing

- Focus tests on Service Layer. Use TDD for critical logic.
- Tests must be fast and deterministic (mock external IO).

## Mandatory Checklist (developer & agent)

Before any commit:

- Everything configurable? (no hardcoding)
- ≥2 abstraction layers between producer and consumer
- Dependencies injected
- External calls have timeouts & retries
- Business logic isolated in Service layer
- Changing a feature should touch ≤3 files (architecture permitting)

## Ultimate Rule

If a change requires many manual edits, refactor until change is localized.

---

## 16. Editor & IDE Rules (EXACT WORDING)

- Do not modify `.editorconfig`, `.vscode/*`, `idea/*`, or other IDE workspace settings except when absolutely necessary. Editor files are personal and noisy — changes must be proposed in PR with justification and marked OPTIONAL.
- If format/lint rules must change, prefer adding or updating a centralized formatter config (`.prettierrc`, `eslint`, `tsconfig`) and a `pre-commit` hook rather than changing individual devs’ IDE settings.
- Agents should respect repo formatter settings. If running formatters, do so via CLI commands (e.g., `bun run format`, `pnpm run format`), not by pushing IDE-specific settings.
- If you must change editor settings, add a clear PR section titled “Editor settings change — rationale & rollback” and make the change opt-in.

---

## 17. Commit & PR Rules (EXACT WORDING)

- Commit message for AGENTS.md edits: `AGENTS.md: <short summary>`
- PR title: `docs(agents): update AGENTS.md — <short summary>`
- PR body must include:
  - brief justification of AGENTS.md edits (1–3 lines)
  - the quality checklist results (see below)
  - any commands run & key test outputs or exact commands to reproduce (no file scan list)
- The PR should be small, focused, and reversible.

### QUALITY CHECKLIST (include in PR body; pass/fail)

- All required sections present — pass/fail
- ≥3 runnable command examples (Bun or repo manager) — pass/fail
- Self-Update Policy present — pass/fail
- SWE Best Practices copied — pass/fail
- Editor rules present — pass/fail

---

## 18. Short “how to continue” — top 8 next steps for agents

1. Add `test` script
2. Add `lint` script
3. Add `format` script
4. Add vitest unit tests
5. Add CI checks (build/test/lint)
6. Add centralized `config/featureFlags.ts`
7. Expand `scripts/install.sh` docs
8. Add `AGENTS.md` per-service (if monorepo)

---

## 19. This is a living document

This file is living, not a changelog. Update per the Self-Update Policy only (no author/date inside the file).

---

**Notes:**

- I preserved the original SWE Best Practices and layered-architecture advice and merged them into a single machine-first `AGENTS.md` with runnable commands and actionable maintenance steps.
- Recommended next step: add `test`, `lint`, and `format` scripts and push a small PR that wires up a CI job that runs `bun run build`, `npx tsc --noEmit`, and `bun run test`.
