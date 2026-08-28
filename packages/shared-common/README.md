# shared-common

Internal shared library for the platform frontend monorepo.

## MVP Status

**Current Phase**: Empty shell (placeholder)

This package is intentionally kept minimal during MVP phase. It will be populated with:
- Type definitions (User, Workflow, etc.)
- Utility functions
- Shared constants

## Usage

Apps in the monorepo consume this package's TypeScript source directly:

```json
{
  "dependencies": {
    "shared-common": "workspace:*"
  }
}
```

```typescript
import type { User } from 'shared-common'
import { someUtility } from 'shared-common'
```

## Development

```bash
# Type check only (no build step in MVP)
pnpm --filter shared-common typecheck
```

## Architecture Notes

- **No build output**: Apps consume TS source directly
- **No side effects**: Only types and pure functions
- **Dependency direction**: `apps/*` → `packages/*` (one-way)
