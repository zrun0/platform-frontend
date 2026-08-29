# core

Foundation layer of the platform frontend monorepo: shared type definitions,
pure utility functions, and shared constants. Everything else builds on it;
it builds on nothing.

## MVP Status

**Current Phase**: Empty shell (placeholder)

This package is intentionally kept minimal during MVP phase. It will be
populated with:

- Type definitions (User, Workflow, etc.)
- Utility functions
- Shared constants

## Rules

1. **Dependency direction is one-way**: `apps/*` and other `packages/*` may
   depend on `core`; `core` must not depend on any internal package.
2. **Types and pure functions only**: no business logic, no side effects.
   Anything with side effects (HTTP requests, storage, events) belongs in its
   own package, not here.

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
import { someUtility } from '@zrun/core';
```

## Development

```bash
# Type check only (no build step in MVP)
pnpm --filter @zrun/core typecheck
```

## Architecture Notes

- **No build output**: Apps consume TS source directly
- **Foundation layer**: the bottom of the package hierarchy; see Rules above
