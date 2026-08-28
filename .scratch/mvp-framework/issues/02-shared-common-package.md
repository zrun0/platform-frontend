# 02: Shared Common Package

**What to build:** Shared Common package that provides base TypeScript type definitions and utility functions, demonstrating cross-package references in the monorepo.

**Blocked by:** 01-infrastructure-monorepo-setup

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Create `packages/shared-common/src/types.ts` with business entity types (User, Workflow, etc.)
- [ ] Create `packages/shared-common/src/utils.ts` with simple utility functions (date formatting, string helpers)
- [ ] Configure `packages/shared-common/tsconfig.json` inheriting from base config
- [ ] Export types and utilities from `packages/shared-common/src/index.ts`
- [ ] Update `packages/shared-common/package.json` with proper exports and type definitions
- [ ] Verify UC can import User type from Shared Common without TypeScript errors
- [ ] Verify Flow can import utility functions from Shared Common without TypeScript errors
- [ ] Run `pnpm --filter shared-common typecheck` successfully
- [ ] Verify `workspace:*` protocol works correctly in package.json dependencies

## Technical Notes

This ticket validates the monorepo package reference mechanism. It's intentionally simple—just types and pure functions—following the constraint that Shared Common contains no business logic or side effects.

Key implementation details:
- Types should reflect the domain glossary in CONTEXT.md
- Utility functions should be simple and well-documented
- No React or framework-specific code
- Pure TypeScript with no external runtime dependencies

Once complete, sub-applications can reference shared types and utilities, proving the monorepo structure works end-to-end.