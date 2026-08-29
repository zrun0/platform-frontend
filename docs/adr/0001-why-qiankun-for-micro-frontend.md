# 0001 - Why qiankun for Micro-Frontend Architecture

## Status

**Superseded by [0005 - Migrate from qiankun to wujie](./0005-migrate-qiankun-to-wujie.md)（2026-08-29）**

## Context

我们需要为 platform-frontend 选择一个微前端架构方案，以支持：

- 多团队独立开发和部署（UC 用户中心、Flow 工作流管理）
- 技术栈灵活性（子应用可选用不同框架）
- 应用间隔离（样式、JS、路由独立）
- 开发体验优化（独立 dev、热更新、类型共享）

## Decision

选择 **qiankun** 作为微前端框架，配合 **Vite** 作为子应用构建工具。

### Why qiankun?

1. **生态成熟**: 基于 single-spa，阿里生产验证，社区活跃
2. **开箱即用**: 提供 JS 沙箱、样式隔离、预加载等开箱功能
3. **技术栈无关**: 理论上支持任意框架（我们选 React + Vite）
4. **Vite 集成**: `vite-plugin-qiankun` 插件成熟，处理生命周期和资源打包
5. **学习成本低**: API 简单，文档完善，团队上手快

### Alternatives Considered

#### Module Federation (Webpack 5)

- ✅ 优势：运行时依赖共享，更细粒度的模块复用
- ❌ 劣势：强制 Webpack 5，与我们选择的 Vite 冲突
- ❌ 劣势：配置复杂，心智负担高
- ❌ 劣势：版本兼容性问题多

#### single-spa

- ✅ 优势：qiankun 的底层，更轻量
- ❌ 劣势：需手动处理样式隔离、JS 沙箱
- ❌ 劣势：缺少开箱功能，工程化成本高

#### iframe

- ✅ 优势：完全隔离，最简单
- ❌ 劣势：性能差，通信复杂，用户体验差
- ❌ 劣势：无法共享全局依赖（React、Router）

#### Monorepo (无微前端)

- ✅ 优势：简单，无额外复杂度
- ❌ 劣势：无法独立部署，强耦合
- ❌ 劣势：构建时间随项目增长

### Why Vite + vite-plugin-qiankun?

1. **开发体验**: HMR 极快，配置简单
2. **生态**: 插件生态完善（TypeScript、React、CSS）
3. **构建速度**: esbuild 预编译，比 Webpack 快 10-20 倍
4. **qiankun 集成**: `vite-plugin-qiankun` 处理所有集成细节

## Consequences

### Positive

- ✅ 团队可独立开发 UC/Flow，互不干扰
- ✅ 技术栈可演进（子应用可升级依赖，不影响其他应用）
- ✅ 开发体验好（独立 dev、热更新、类型共享）
- ✅ 生产可用（阿里等大厂生产验证）

### Negative

- ❌ 增加复杂度（需要维护主基座、子应用生命周期、通信机制）
- ❌ 调试成本（跨应用问题需排查多个应用）
- ❌ 构建配置复杂（CORS、publicPath、样式隔离）

### Mitigation

- 🛠️ 严格的工程规范（文档、命令、自检清单）
- 🛠️ 统一的依赖版本（React 18、react-router v6）
- 🛠️ 详细的经典坑文档（7 条坑位 + 解决方案）

## Implementation Notes

- 主基座：`apps/main-base` (8000)
- 子应用：`apps/uc` (8001), `apps/flow` (8002)
- 共享库：`packages/shared-common`（类型 + 工具函数）
- 通信方式：仅 qiankun `props` 单向传参
- 开发优先级：自底向上（shared-common → uc/flow → main-base）

## Related Decisions

- [0002 - Why pnpm + Turborepo for Monorepo](./0002-why-pnpm-turborepo-for-monorepo.md)
- [0003 - Why shared-common Source Consumption](./0003-why-shared-common-source-consumption.md)
