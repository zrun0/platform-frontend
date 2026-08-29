# Platform Frontend - Domain Context

## Glossary

### Core Concepts

**wujie (无界)**

- 腾讯开源的微前端框架：子应用 JS 运行在 iframe 中（天然 JS 隔离），DOM 渲染进主应用 shadowDOM（样式隔离）
- 关键特性：生命周期管理、预加载、保活（alive）、降级（degrade）、路由同步（sync）
- 文档：https://wujie-micro.github.io/doc/

**Portal (portal)**

- wujie 主基座应用，运行在 `localhost:8000`
- 职责：注册子应用、路由导航、跨应用通信协调
- 技术栈：React 19 + react-router v7 + wujie-react
- 注意：主基座不使用 `<React.StrictMode>`（其 dev remount 与 wujie 异步 startApp/destroy 竞态，见 ADR-0005）

**Sub Application (子应用)**

- 独立运行的前端应用，可被 portal 加载或独立开发
- 入口注册 `window.__WUJIE_MOUNT / __WUJIE_UNMOUNT` 生命周期（wujie 模式），standalone 模式直接渲染
- 当前子应用：
  - **UC (用户中心)**: `localhost:8001`, 路由前缀 `/uc`
  - **Flow (工作流管理)**: `localhost:8002`, 路由前缀 `/flow`

**Core (@zrun/core)**

- 核心共享包（packages 底座层），不独立构建，各 app 直接消费其 TS 源码
- 内容：类型定义（`User`）、纯函数、无副作用的 React-free 运行时助手（`registerWujieApp`，见 ADR-0007）
- 依赖方向：`apps/*` 及其他 `packages/*` → `core`（`core` 不依赖任何内部包，禁止反向依赖）；apps **按需引入**，用到才加 `workspace:*` 依赖
- 约束：只放类型定义、纯函数与 React-free 运行时助手，无业务逻辑、无副作用；带副作用的（请求、存储、事件）放独立包；Node 侧配置文件（如 vite.config.ts）不 import core 源码（Node type-stripping 限制，见 ADR-0007）

### Technical Terms

**Turborepo**

- Monorepo 任务调度工具，缓存和并行执行构建任务
- 配置文件：`turbo.json`
- 命令优先级：优先 `turbo`，单包操作用 `pnpm --filter`

**wujie-react**

- wujie 的 React 封装包，提供 `<WujieReact />` 组件（挂载子应用）与 `preloadApp`/`destroyApp` 等静态方法
- 2.1.0 自带类型声明残缺，本仓库用 `apps/portal/src/wujie/wujie-react.d.ts` + tsconfig `paths` 做类型重定向（仅影响类型检查）

**workspace:***

- pnpm workspace 协议，用于 monorepo 内部包引用
- 示例：`"@zrun/core": "workspace:*"`

**routePrefix（路由前缀）**

- 主应用侧的子应用路由前缀（`/uc`、`/flow`），决定 `<Routes>` 中哪条路由渲染 WujieReact 容器
- 子应用内部路由是独立路径空间，不共享此前缀（见 "路由模型"）

**Lifecycle (生命周期)**

- 子应用在入口 `main.tsx` 中通过 `registerWujieApp`（来自 `@zrun/core`）注册两个钩子：
  - `window.__WUJIE_MOUNT`: 挂载应用（创建 React root）
  - `window.__WUJIE_UNMOUNT`: 卸载应用（销毁 React root）
- 双模式运行：wujie 环境（`__POWERED_BY_WUJIE__` 为 true）注册钩子等待宿主调用；独立 dev 直接渲染
- 相关全局类型（`__POWERED_BY_WUJIE__`、`$wujie` 等）由 `@zrun/core` 的 `src/wujie.ts` 声明

**`__POWERED_BY_WUJIE__` / `$wujie`**

- `window.__POWERED_BY_WUJIE__`: 标识子应用是否运行在 wujie 环境
- `window.$wujie`: wujie 注入的实例对象
  - `$wujie.props`: 宿主传递的数据（单向传参）
  - `$wujie.bus`: 事件总线（按约束禁用，见跨应用通信）

**路由模型（wujie，与 qiankun 的关键差异）**

- 子应用路由是**独立路径空间**：iframe 的 pathname 从 entry url 路径开始（如 `//localhost:8001/` → `/`），BrowserRouter 无需 basename
- 开启 `sync` 后，子应用路由变化同步到主应用 URL query（如 `/uc?uc=/users`），主应用 pathname 保持 `/uc` 不变；刷新/前进/后退可恢复子应用路由
- 不要按 qiankun 心智给子应用配 `basename="/uc"` —— iframe pathname 不含该前缀，Router 会因不匹配而渲染空

**CSS Modules**

- CSS 局部作用域方案，通过编译时生成唯一类名实现样式隔离
- 微前端推荐方案（wujie 下子应用样式本身已在 shadowDOM 内隔离），避免全局样式污染
- 约定：`.module.css` 后缀，通过 `import styles from './xxx.module.css'` 引入

**Zustand**

- 轻量级 React 状态管理库（~1KB）
- API 简洁：`create store → use hook`
- 无需 Provider 包裹，支持 TypeScript 推理
- 适用场景：子应用内部复杂状态，无需跨应用通信

**Hybrid Development Mode (混合开发模式)**

- 结合单应用开发和全量开发的工作流
- 单应用开发：`pnpm dev:uc`（大部分时间）
- 全量开发：`pnpm dev`（集成测试时）
- 推荐流程：单应用开发功能 → 全量 dev 集成测试 → 部署前全量 build

### Business Domains

**UC (用户中心)**

- 用户信息管理、权限管理、个人设置
- 路由前缀：`/uc`
- 端口：8001

**Flow (工作流管理)**

- 业务流程设计、审批流、流程监控
- 路由前缀：`/flow`
- 端口：8002

## Architecture Decisions

现行微前端方案：[ADR-0005](docs/adr/0005-migrate-qiankun-to-wujie.md)（wujie）。全量索引与写作规范见 [docs/adr/README.md](docs/adr/README.md)（索引单一来源）。

## Cross-Application Communication

**Constraint**: 仅使用 wujie `props` 单向传参，禁止以下做法：

- ❌ 在 core 预埋全局状态
- ❌ 使用事件总线（`$wujie.bus`）跨应用通信
- ❌ 通过 `window` 全局变量共享数据
- ❌ 跨应用直接 import

**Correct Pattern**:

```typescript
// portal 在 src/wujie/subApps.ts 中配置 props
{
  name: 'uc',
  entry: '//localhost:8001',
  routePrefix: '/uc',
  props: {
    userData: { userId: '123', userName: 'Alice' }
  }
}

// 子应用读取 props
const userData = window.$wujie?.props?.userData
```

## Classic Gotchas (wujie + Vite)

1. **开发环境跨域**: 子应用 vite dev server 必须开启 CORS（`cors: true` + `Access-Control-Allow-Origin` headers）——wujie 从主应用 origin fetch 子应用 HTML/JS/CSS
2. **路由模型**: 子应用路由是独立路径空间，不要配 `basename`；开启 `sync` 后子应用路由存于主应用 URL query（详见术语表"路由模型"）
3. **生命周期与 root 泄漏**: `__WUJIE_MOUNT` 创建 root、`__WUJIE_UNMOUNT` 卸载必须一一对应
4. **主基座禁用 StrictMode**: dev remount 与 wujie 异步 startApp/destroy 竞态会撕裂子应用 sandbox（见 ADR-0005）
5. **样式**: 子应用样式渲染在 shadowDOM 内天然隔离，继续用 CSS Modules 防御全局污染
6. **全局状态**: 不依赖 `window` 全局变量，跨应用只走 `props`（`window.$wujie.props`）
7. **构建配置**: 子应用就是标准 Vite 应用，不要引入 lib 模式 / IIFE / externals 等特殊构建

## Development Workflow

命令与启动流程见 `docs/development-workflow.md`（单一来源）。
