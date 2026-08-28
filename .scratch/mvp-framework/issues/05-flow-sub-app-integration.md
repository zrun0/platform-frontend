# 05: Flow Sub-Application Integration

**What to build:** Flow sub-application that can be loaded by Main Base, displays "Workflow Management" homepage, and validates multi-sub-app scenario.

**Blocked by:** 02-shared-common-package, 03-main-base-application

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Create `apps/flow/src/App.tsx` with React Router v6 setup
- [ ] Create `apps/flow/src/pages/HomePage.tsx` displaying "工作流管理" (Workflow Management) text
- [ ] Implement qiankun lifecycle exports (bootstrap, mount, unmount) in `apps/flow/src/main.tsx`
- [ ] Configure `vite-plugin-qiankun` in `apps/flow/vite.config.ts` for dual-mode support
- [ ] Set up CSS Modules for component styling (`.module.css` files)
- [ ] Import and use Workflow type from Shared Common in Flow components
- [ ] Import and use utility functions from Shared Common in Flow components
- [ ] Configure Vite dev server with CORS (port 8002)
- [ ] Set up `basename` for React Router when running in qiankun mode
- [ ] Register Flow sub-app in Main Base's qiankun configuration (entry: localhost:8002, activeRule: /flow)
- [ ] Run `pnpm --filter flow dev` and verify it starts independently on localhost:8002
- [ ] Run `pnpm dev` (all apps) and navigate to `/flow` route
- [ ] Verify Flow sub-app loads and displays "工作流管理" content
- [ ] Click navigation bar and switch between `/uc` and `/flow` routes smoothly
- [ ] Check browser console shows no qiankun or React errors
- [ ] Verify Shared Common types and utilities work without TypeScript errors

## Technical Notes

This ticket implements the second sub-application, validating that multiple sub-apps can coexist and be managed by the single Main Base. It runs in parallel with ticket 04.

Key implementation details:
- Same pattern as UC sub-app (vite-plugin-qiankun, lifecycles, CSS Modules)
- React Router uses `basename: /flow` in qiankun mode, `/` in standalone mode
- Demonstrates that Shared Common can serve multiple consuming applications
- Port 8002 for Flow dev server
- Imports different types/utilities from Shared Common than UC

Once complete, Main Base can successfully manage two sub-applications, proving the micro-frontend architecture supports multiple independent applications.