# 01: Infrastructure and Monorepo Setup

**What to build:** Complete Turborepo + pnpm monorepo structure with all dependencies installed and base configuration files ready for development.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Create standard monorepo directory structure (`apps/`, `packages/`, root config files)
- [ ] Configure `pnpm-workspace.yaml` with `apps/*` and `packages/*` workspace protocol
- [ ] Configure `turbo.json` with pipeline for `dev`, `build`, `lint` tasks
- [ ] Create `tsconfig.base.json` with strict mode and monorepo-friendly settings
- [ ] Create `.prettierrc` with team-agreed formatting rules
- [ ] Initialize root `package.json` with all necessary scripts and dependencies
- [ ] Set up placeholder `apps/main-base/package.json`, `apps/uc/package.json`, `apps/flow/package.json`, `packages/shared-common/package.json`
- [ ] Install all dependencies successfully with `pnpm install`
- [ ] Verify `pnpm --filter shared-common typecheck` can check types (even if no types exist yet)
- [ ] Verify `.gitignore` ignores build artifacts and dependencies

## Technical Notes

This ticket establishes the foundation for all subsequent work. It creates the skeleton that other tickets will flesh out.

Key configuration decisions:
- Use `workspace:*` protocol for internal package references
- Turborepo pipeline supports parallel dev and cached builds
- TypeScript strict mode enabled globally
- Prettier for code formatting (ESLint deferred to later iteration)

Once complete, developers can run `pnpm install` to set up their environment and the monorepo structure is ready for package implementation.