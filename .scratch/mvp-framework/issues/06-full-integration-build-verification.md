# 06: Full Integration and Build Verification

**What to build:** Complete micro-frontend application with full integration testing and production build validation, ensuring the entire system works end-to-end.

**Blocked by:** 04-uc-sub-app-integration, 05-flow-sub-app-integration

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Run `pnpm dev` and verify all three applications start successfully (Main Base 8000, UC 8001, Flow 8002)
- [ ] Access localhost:8000 and see complete navigation bar with both `/uc` and `/flow` links
- [ ] Click `/uc` link and verify UC sub-app loads displaying "用户中心"
- [ ] Click `/flow` link and verify Flow sub-app loads displaying "工作流管理"
- [ ] Switch back and forth between routes multiple times without errors
- [ ] Verify browser console shows no React, qiankun, or JavaScript errors
- [ ] Verify no white screen or loading failures
- [ ] Run `pnpm build` and verify all applications build successfully
- [ ] Check `dist/` directories exist in `apps/main-base/`, `apps/uc/`, `apps/flow/`
- [ ] Verify build artifacts include necessary JS and CSS files
- [ ] Verify Turborepo cache is working (second build should be faster)
- [ ] Test that Shared Common types and utilities work across all applications
- [ ] Verify CSS isolation is working (no style conflicts between apps)
- [ ] Check that qiankun lifecycle management works correctly (mount/unmount)
- [ ] Document any known issues or limitations in CONTEXT.md if needed

## Technical Notes

This is the final integration ticket that validates the complete micro-frontend architecture. It demonstrates that the entire system—from monorepo setup through shared packages to multiple sub-applications—works cohesively.

Key validation points:
- Full-stack integration: Main Base + UC + Flow + Shared Common all working together
- Development workflow: `pnpm dev` starts everything correctly
- Production build: `pnpm build` generates deployable artifacts
- Turborepo optimization: build caching works as expected
- Route switching: seamless navigation between sub-apps
- Error-free operation: clean console output
- Style isolation: CSS Modules prevent conflicts
- Lifecycle management: qiankun properly manages sub-app loading/unloading

Once complete, the MVP micro-frontend framework is fully functional and ready for team development. The foundation is solid for adding business features in future iterations.