# Platform Frontend - Domain Context

## Glossary

### Core Concepts

**qiankun (qiankun)**
- 基于 single-spa 的微前端框架，用于主基座注册、加载、卸载子应用
- 关键特性：生命周期管理、样式隔离、JS 沙箱、预加载
- 文档：https://qiankun.umijs.org/

**Main Base (main-base)**
- qiankun 主基座应用，运行在 `localhost:8000`
- 职责：注册子应用、路由导航、跨应用通信协调
- 技术栈：React 18 + react-router v6 + qiankun

**Sub Application (子应用)**
- 独立运行的前端应用，可被 main-base 加载或独立开发
- 必须导出 `bootstrap / mount / unmount` 生命周期
- 当前子应用：
  - **UC (用户中心)**: `localhost:8001`, 路由前缀 `/uc`
  - **Flow (工作流管理)**: `localhost:8002`, 路由前缀 `/flow`

**Shared Common (shared-common)**
- 内部公共库，不独立构建，各 app 直接消费其 TS 源码
- 内容：MVP 阶段保持空壳，后续逐步添加类型定义和工具函数
- 依赖方向：`apps/*` → `packages/*`（禁止反向依赖）
- 约束：只放类型定义和纯函数，无业务逻辑、无副作用

### Technical Terms

**Turborepo**
- Monorepo 任务调度工具，缓存和并行执行构建任务
- 配置文件：`turbo.json`
- 命令优先级：优先 `turbo`，单包操作用 `pnpm --filter`

**vite-plugin-qiankun**
- Vite 官方 qiankun 插件，处理子应用生命周期和资源打包
- 自动导出 `bootstrap / mount / unmount`
- 处理 publicPath、CORS、样式隔离等集成细节

**workspace:***
- pnpm workspace 协议，用于 monorepo 内部包引用
- 示例：`"shared-common": "workspace:*"`

**activeRule**
- qiankun 子应用激活规则，决定何时加载子应用
- 与路由 `basename` 一一对应：
  - `/uc` → UC 子应用
  - `/flow` → Flow 子应用

**Lifecycle (生命周期)**
- 子应用必须导出的三个函数：
  - `bootstrap`: 初始化（只执行一次）
  - `mount`: 挂载应用（每次进入执行）
  - `unmount`: 卸载应用（每次离开执行）
- 双模式运行：基座环境由 qiankun 调用，独立 dev 自行调用

**qiankunWindow.__POWERED_BY_QIANKUN__**
- 全局变量，标识子应用是否运行在 qiankun 环境
- `true`: 基座环境，由 qiankun 管理生命周期
- `undefined/false`: 独立 dev，自行管理 React root

**CSS Modules**
- CSS 局部作用域方案，通过编译时生成唯一类名实现样式隔离
- qiankun 推荐方案，避免全局样式污染
- 约定：`.module.css` 后缀，通过 `import styles from './xxx.module.css'` 引入

**Zustand**
- 轻量级 React 状态管理库（~1KB）
- API 简洁：`create store → use hook`
- 无需 Provider 包裹，支持 TypeScript 推理
- 适用场景：子应用内部复杂状态，无需跨应用通信

**Hybrid Development Mode (混合开发模式)**
- 结合单应用开发和全量开发的工作流
- 单应用开发：`pnpm --filter uc dev`（大部分时间）
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

See `docs/adr/` for detailed Architecture Decision Records.

## Cross-Application Communication

**Constraint**: 仅使用 qiankun `props` 单向传参，禁止以下做法：
- ❌ 在 shared-common 预埋全局状态
- ❌ 使用事件总线跨应用通信
- ❌ 通过 `window` 全局变量共享数据
- ❌ 跨应用直接 import

**Correct Pattern**:
```typescript
// main-base 注册时传递 props
registerApps({
  name: 'uc',
  props: {
    userData: { userId: '123', userName: 'Alice' }
  }
})

// 子应用接收 props
export async function mount(props: any) {
  const { userData } = props
  // 使用 userData
}
```

## Development Workflow

### Commands Priority
1. **全局操作**: `pnpm <command>` (经由 turbo)
2. **单包操作**: `pnpm --filter <package> <script>`

### Common Commands
```bash
# 开发
pnpm dev                          # 全量 dev（不缓存）
pnpm --filter uc dev              # 单应用 dev

# 构建
pnpm build                        # 全量 build（带缓存）

# 类型检查
pnpm --filter shared-common typecheck  # shared 只配 typecheck
```

## Classic Gotchas (qiankun + Vite)

1. **开发环境跨域**: 子应用 vite dev server 必须开启 CORS
2. **publicPath**: 动态 import 的 chunk 可能 404，需用 qiankun public path 机制
3. **生命周期与 root 泄漏**: `mount` 创建、`unmount` 卸载必须一一对应
4. **样式隔离**: 使用 CSS Modules，禁止全局样式污染
5. **依赖一致性**: 基座与子应用统一 React 18，避免多实例
6. **全局状态**: 不依赖 `window` 全局变量，跨应用只走 `props`
7. **构建配置**: 按 `vite-plugin-qiankun` 要求配置，不随意更换打包格式

## MVP Framework Decisions (2026-08-28)

### MVP Scope
- **Goal**: 搭建完整的 qiankun 微前端框架，能本地运行 `pnpm dev` 看到主基座和子应用正常加载
- **Components**: Main Base + UC + Flow + Shared Common
- **Success Criteria**: 本地开发环境可运行，子应用能被主基座正确加载

### Architecture Decisions

#### Project Structure
- **Monorepo**: Turborepo + pnpm workspace
- **Standard Structure**:
  ```
  platform-frontend/
  ├── apps/
  │   ├── main-base/        # Port 8000
  │   ├── uc/               # Port 8001, route prefix /uc
  │   └── flow/             # Port 8002, route prefix /flow
  ├── packages/
  │   └── shared-common/    # Shared types and utilities
  ├── package.json
  ├── pnpm-workspace.yaml
  └── turbo.json
  ```

#### Application Responsibilities
- **Main Base**: 子应用注册、路由导航、qiankun 生命周期管理、简单导航栏
- **UC Sub-app**: 简单首页展示"用户中心"
- **Flow Sub-app**: 简单首页展示"工作流管理"
- **Shared Common**: 基础类型定义（User, Workflow 等）+ 简单工具函数

#### Routing Strategy
- **Main Base**: 只负责激活子应用（通过 qiankun activeRule）
- **Sub-apps**: 自行管理内部路由（使用 react-router v6）

#### Development Mode
- **Hybrid Development**:
  - `pnpm dev`: 启动所有应用
  - `pnpm --filter <app> dev`: 单独启动指定应用

### Technical Stack
- **Frontend**: React 18 + TypeScript (strict mode)
- **Micro-frontend**: qiankun + vite-plugin-qiankun
- **Build**: Vite + Turborepo
- **Package Manager**: pnpm
- **State Management**: Zustand (sub-app internal state)
- **Styling**: CSS Modules (per-app independent styles)
- **Code Quality**: Prettier only (ESLint, Husky 暂不配置)

### Build & Deployment
- **Build Output**: `dist/` directory per app
- **TypeScript**: Unified `tsconfig.base.json` + app-specific configs
- **Environment Variables**: 暂不需要

### Development Workflow
- **Commands Priority**:
  1. Global: `pnpm <command>` (via Turborepo)
  2. Single package: `pnpm --filter <package> <script>`
- **Common Commands**:
  - `pnpm dev`: 全量开发
  - `pnpm --filter <app> dev`: 单应用开发
  - `pnpm build`: 全量构建（带缓存）
