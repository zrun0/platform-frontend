# 03: Main Base Application

**What to build:** Main Base application (qiankun host) with navigation bar and qiankun integration configured, ready to load sub-applications.

**Blocked by:** 01-infrastructure-monorepo-setup

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Create `apps/main-base/src/App.tsx` with React Router v6 setup
- [ ] Create `apps/main-base/src/components/NavBar.tsx` with navigation links to `/uc` and `/flow`
- [ ] Configure qiankun in `apps/main-base/src/qiankun-config.ts` with registration setup
- [ ] Create `apps/main-base/src/main.tsx` with qiankun `start()` initialization
- [ ] Configure Vite with `vite.config.ts` for Main Base (port 8000, CORS enabled)
- [ ] Set up CSS Modules for component styling (`.module.css` files)
- [ ] Configure `apps/main-base/tsconfig.json` with React-specific settings
- [ ] Update `apps/main-base/package.json` with qiankun, React, and React Router dependencies
- [ ] Run `pnpm --filter main-base dev` and verify it starts on localhost:8000
- [ ] Access localhost:8000 in browser and see navigation bar
- [ ] Verify qiankun configuration is ready (sub-app registration prepared)
- [ ] Check browser console shows no React or qiankun errors

## Technical Notes

This ticket builds the qiankun host application. It doesn't yet load sub-applications (that happens in tickets 04 and 05), but it establishes the foundation.

Key implementation details:
- React Router handles `/uc` and `/flow` routes with placeholder containers
- qiankun `registerMicroApps` prepared but sub-app entries may be placeholder URLs
- Navigation bar allows manual navigation between routes
- CSS Modules for style isolation (`.module.css` convention)
- Vite dev server configured with CORS for future sub-app loading
- Port 8000 for Main Base

Once complete, the host application is ready and waiting for sub-applications to be registered and loaded.