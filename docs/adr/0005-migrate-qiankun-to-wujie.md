# 0005 - Migrate from qiankun to wujie

## Status

**Accepted**（取代 [0001 - Why qiankun for Micro-Frontend Architecture](./0001-why-qiankun-for-micro-frontend.md)）

## Context

qiankun + `vite-plugin-qiankun` 的集成在当前技术栈（React 19 + react-router v7 + Vite 8）下无法工作：嵌入模式下 UC 子应用一直无法加载（容器空白）。排查确认的根因：

1. **插件调用链断裂**: `vite-plugin-qiankun` 的真实签名是 `(name: string, { useDevMode? })`，子应用以对象签名调用导致 `useDevMode` 从未生效（dev 模式下子应用直接不可加载）；入口也未使用插件唯一支持的 `renderWithQiankun`/`qiankunWindow` 接线方式，裸导出的 ES 生命周期永远接不上
2. **生产构建损坏**: lib/IIFE 配置丢失入口导出，且跳过插件的 `transformIndexHtml`
3. **生态错位（根本原因）**: qiankun 的 proxy JS 沙箱官方验证止于 React ≤18，`vite-plugin-qiankun` 已长期不维护、跟不上 Vite 大版本。在 React 19 + Vite 8 组合上修 qiankun 是在给过时的集成层打补丁

## Decision

整体切换到 **wujie**（腾讯无界，`wujie-react@2.1.0`），UC 与 Flow 两个子应用一起迁移，完全移除 qiankun / vite-plugin-qiankun。

### Why wujie?

1. **iframe + shadowDOM 架构**: 子应用 JS 运行在 iframe 中（天然 JS 隔离，无 proxy 拦截），DOM 渲染进 shadowDOM（样式隔离）。对 React 19 等新版运行时零侵入，这正是 qiankun 沙箱的痛点
2. **Vite 原生支持**: wujie 通过 fetch 求值 ESM 模块，Vite dev server 无需任何子应用插件——整条 `vite-plugin-qiankun` 断裂链路被连根消除
3. **子应用接近零改造**: 标准 Vite 应用 + 入口生命周期注册即可，构建配置无特殊要求
4. **腾讯维护、生产验证**: 社区活跃，2.x 持续修复内存泄漏与竞态问题

### Alternatives Considered

#### 修复 qiankun 集成（不迁移）

- ✅ 优势：改动最小
- ❌ 劣势：需精确按插件文档重写入口（renderWithQiankun）+ 修正签名；仍停留在 React 18 验证范围内；`vite-plugin-qiankun` 不维护，每个 Vite/React 大版本都是风险

#### iframe 方案（裸 iframe）

- ✅ 优势：完全隔离
- ❌ 劣势：wujie 本质上就是 iframe 方案的工程化封装（shadowDOM 渲染 + iframe 跑 JS + 预加载/保活/通信），自建等于重造 wujie

#### Module Federation

- ❌ 劣势：同 0001 时期的评估，强绑定构建工具链，与我们多应用独立部署的目标不符

## 与 qiankun 的关键模型差异（重要）

| 维度       | qiankun                                | wujie                                                                                                                                                              |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| JS 隔离    | proxy 沙箱（劫持 window）              | 真实 iframe window                                                                                                                                                 |
| 子应用构建 | 需要 vite-plugin-qiankun（ESM 不兼容） | 标准 Vite 应用，零插件                                                                                                                                             |
| 路由       | 主子共享 pathname，子应用配 `basename` | 子应用**独立路径空间**（iframe pathname 从 entry 路径开始，无需 basename）；开启 `sync` 后子应用路由同步到主应用 URL query（`/uc?uc=/path`），刷新/前进/后退可恢复 |
| 生命周期   | 入口 export `bootstrap/mount/unmount`  | 入口注册 `window.__WUJIE_MOUNT` / `__WUJIE_UNMOUNT`，`__POWERED_BY_WUJIE__` 判别环境                                                                               |
| props      | `mount(props)` 参数注入                | `window.$wujie?.props`                                                                                                                                             |

## Consequences

### Positive

- ✅ UC/Flow 嵌入模式正常加载（qiankun 下的核心故障彻底解决）
- ✅ 子应用 Vite 配置回归标准形态（无插件、无 lib 模式、无 externals），构建即普通应用
- ✅ React 19 / Vite 8 / RR7 无兼容性隐患，未来升级无沙箱层风险

### Negative

- ❌ 引入新框架概念（iframe 路由模型、shadowDOM 渲染），团队需重新熟悉
- ❌ `wujie-react` 2.1.0 自带类型声明残缺（`index.d.ts` 缺 PureComponent 泛型），需要本地类型补丁
- ❌ 主应用不能使用 `<React.StrictMode>`：其 dev-only remount（mount → unmount → remount）与 wujie 异步 `startApp`/`destroy` 存在竞态，会撕裂子应用 sandbox（生产构建不受影响）

### Mitigation

- 🛠️ 本仓库通过 `apps/main-base/src/wujie/wujie-react.d.ts` + tsconfig `paths` 重定向提供精确类型（仅影响类型检查，运行时仍解析真实包）
- 🛠️ 主应用 `main.tsx` 以注释说明不使用 StrictMode 的原因；子应用（各自独立 iframe）保留 StrictMode
- 🛠️ 路由模型差异写入 `CONTEXT.md`（术语表 "路由模型" + Classic Gotchas），排查步骤见 `docs/development-workflow.md`，避免按 qiankun 心智使用

## Implementation Notes

- 主基座: `apps/main-base/src/wujie/subApps.ts`（子应用注册单一来源）+ `SubAppContainer.tsx`（WujieReact 封装，开启 `sync`）
- 子应用入口: `__POWERED_BY_WUJIE__` 判别 + `__WUJIE_MOUNT`/`__WUJIE_UNMOUNT` 注册 + standalone 兜底
- 子应用 vite: 仅保留端口 + CORS（wujie 从主应用 origin fetch 子应用资源，CORS 必须）
- 端口（8000/8001/8002）与路由前缀（`/uc`、`/flow`）保持不变
- 端到端验证（headless 浏览器 12 项）：欢迎页、/uc 与 /flow 渲染、双向切换、深链刷新、生命周期日志、props 传递、无 console 错误、standalone 模式

## Related Decisions

- [0001 - Why qiankun for Micro-Frontend Architecture](./0001-why-qiankun-for-micro-frontend.md)（被本决策取代）
- [0002 - Why pnpm + Turborepo for Monorepo](./0002-why-pnpm-turborepo-for-monorepo.md)（不受影响）
- [0003 - Why shared-common Source Consumption](./0003-why-shared-common-source-consumption.md)（不受影响）
- [0004 - Why Zustand for State Management](./0004-why-zustand-for-state-management.md)（不受影响）
