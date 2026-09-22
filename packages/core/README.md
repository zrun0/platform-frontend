# core

Foundation layer of the platform frontend monorepo: shared type definitions,
pure utility functions, side-effect-free React-free runtime helpers
(e.g. `registerWujieApp`), and a build-time Vite config factory
(`@novon/core/vite`, e.g. `createAppViteConfig`). Everything else builds on
it; it builds on nothing.

## Rules

1. **Dependency direction is one-way**: `apps/*` and other `packages/*` may
   depend on `core`; `core` must not depend on any internal package.
2. **Runtime code — types, pure functions, and React-free runtime helpers
   only**: no business logic, no side effects, no React imports. Anything
   with side effects (HTTP requests, storage, events) belongs in its own
   package.
3. **Opt-in dependencies**: apps add `"@novon/core": "workspace:*"` only when
   they actually use it (see ADR-0007).
4. **The `./vite` subpath is build-time only**: `src/vite.ts` exists for
   `vite.config.ts` files (Vite loads configs via esbuild bundling, not Node
   type-stripping — see ADR-0009). Browser code (`src/**` of apps) must not
   import it; vite-related deps stay in devDependencies.

## Usage

Apps in the monorepo consume this package's TypeScript source directly:

```json
{
  "dependencies": {
    "@novon/core": "workspace:*"
  }
}
```

```typescript
import type { User } from '@novon/core';
import { registerWujieApp } from '@novon/core';
```

Vite configs import the dedicated subpath:

```typescript
import { createAppViteConfig } from '@novon/core/vite';
```

## Development

```bash
# Type check only (no build step)
pnpm --filter @novon/core typecheck
```

## Architecture Notes

- **No build output**: Apps consume TS source directly
- **Foundation layer**: the bottom of the package hierarchy; see Rules above
- Decision records: [ADR-0003](../../docs/adr/0003-why-shared-common-source-consumption.md)
  (source consumption), [ADR-0007](../../docs/adr/0007-core-runtime-helpers-and-opt-in-deps.md)
  (runtime helpers, opt-in deps),
  [ADR-0009](../../docs/adr/0009-shared-vite-config-factory-in-core.md)
  (build-time vite config factory)
