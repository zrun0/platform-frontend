# core

Foundation layer of the platform frontend monorepo: shared type definitions,
pure utility functions, and side-effect-free React-free runtime helpers
(e.g. `registerWujieApp`). Everything else builds on it; it builds on
nothing.

## Rules

1. **Dependency direction is one-way**: `apps/*` and other `packages/*` may
   depend on `core`; `core` must not depend on any internal package.
2. **Types, pure functions, and React-free runtime helpers only**: no
   business logic, no side effects, no React imports. Anything with side
   effects (HTTP requests, storage, events) belongs in its own package.
3. **Opt-in dependencies**: apps add `"@zrun/core": "workspace:*"` only when
   they actually use it (see ADR-0007).
4. **Node-side config files must not import core source**: tools executed
   directly by Node (e.g. `vite.config.ts`) cannot rely on Node
   type-stripping; keep such config inline in each app (see ADR-0007).

## Usage

Apps in the monorepo consume this package's TypeScript source directly:

```json
{
  "dependencies": {
    "@zrun/core": "workspace:*"
  }
}
```

```typescript
import type { User } from '@zrun/core';
import { registerWujieApp } from '@zrun/core';
```

## Development

```bash
# Type check only (no build step)
pnpm --filter @zrun/core typecheck
```

## Architecture Notes

- **No build output**: Apps consume TS source directly
- **Foundation layer**: the bottom of the package hierarchy; see Rules above
- Decision records: [ADR-0003](../../docs/adr/0003-why-shared-common-source-consumption.md)
  (source consumption), [ADR-0007](../../docs/adr/0007-core-runtime-helpers-and-opt-in-deps.md)
  (runtime helpers, opt-in deps)
