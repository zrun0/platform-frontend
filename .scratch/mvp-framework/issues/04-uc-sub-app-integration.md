# 04: UC Sub-Application Integration

**What to build:** UC sub-application that can be loaded by Main Base, displays "User Center" homepage, and demonstrates working sub-app integration.

**Blocked by:** 02-shared-common-package, 03-main-base-application

**Status:** completed

## Acceptance Criteria

- [x] Create `apps/uc/src/App.tsx` with React Router v6 setup
- [x] Create `apps/uc/src/pages/HomePage.tsx` displaying "用户中心" (User Center) text
- [x] Implement qiankun lifecycle exports (bootstrap, mount, unmount) in `apps/uc/src/main.tsx`
- [x] Configure `vite-plugin-qiankun` in `apps/uc/vite.config.ts` for dual-mode support
- [x] Set up CSS Modules for component styling (`.module.css` files)
- [x] Import and use User type from Shared Common in UC components
- [x] Configure Vite dev server with CORS (port 8001)
- [x] Set up `basename` for React Router when running in qiankun mode
- [x] Register UC sub-app in Main Base's qiankun configuration (entry: localhost:8001, activeRule: /uc)
- [x] Run `pnpm --filter uc dev` and verify it starts independently on localhost:8001
- [x] Run `pnpm dev` (all apps) and navigate to `/uc` route
- [x] Verify UC sub-app loads and displays "用户中心" content
- [x] Click navigation bar and switch between `/uc` and `/flow` routes
- [x] Check browser console shows no qiankun or React errors
- [x] Verify Shared Common types work without TypeScript errors

## Technical Notes

This ticket implements the first complete sub-application, validating the entire micro-frontend integration path. It's a vertical slice covering Shared Common → Sub-app → Main Base integration.

Key implementation details:
- `vite-plugin-qiankun` enables dual-mode (standalone dev + qiankun integration)
- Lifecycle functions (bootstrap/mount/unmount) exported for qiankun
- React Router uses `basename: /uc` in qiankun mode, `/` in standalone mode
- CSS Modules prevent style pollution
- Port 8001 for UC dev server
- Imports from Shared Common validate monorepo package references

Once complete, the first end-to-end micro-frontend flow works: Main Base can load and display UC sub-application with shared types functioning correctly.