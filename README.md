# Platform Frontend

基于 [wujie（无界）](https://wujie-micro.github.io/doc/) 的微前端平台 monorepo：一个主基座 + 多个子应用独立开发、独立运行、集成加载。

## 应用结构

| 应用                     | 说明                                            | 端口 | 路由前缀 |
| ------------------------ | ----------------------------------------------- | ---- | -------- |
| `apps/main-base`         | wujie 主基座：子应用注册、路由导航              | 8000 | —        |
| `apps/uc`                | UC 用户中心子应用                               | 8001 | `/uc`    |
| `apps/flow`              | Flow 工作流管理子应用                           | 8002 | `/flow`  |
| `packages/shared-common` | 共享类型定义 + 纯工具函数（源码直消费，无构建） | —    | —        |

## 技术栈

- React 19 + TypeScript (strict mode)
- 微前端：wujie + wujie-react（由 qiankun 迁移而来，见 [ADR-0005](docs/adr/0005-migrate-qiankun-to-wujie.md)）
- 构建：Vite + Turborepo，包管理：pnpm workspace
- 状态：Zustand（子应用内部）；样式：CSS Modules
- 代码质量：Prettier only（ESLint、Husky 暂未配置）

## 快速开始

```bash
pnpm install

# 全量启动（main-base + uc + flow）
pnpm dev

# 单应用启动
pnpm dev:base    # 或 pnpm --filter main-base dev
pnpm dev:uc      # 或 pnpm --filter uc dev
pnpm dev:flow    # 或 pnpm --filter flow dev
```

启动后访问 http://localhost:8000，通过导航在 `/uc`、`/flow` 之间切换。验证步骤与常见问题见 [docs/development-workflow.md](docs/development-workflow.md)。

## 常用命令

```bash
pnpm build              # 全量构建（带 turbo 缓存）
pnpm typecheck          # 全量类型检查
pnpm --filter uc build  # 单应用构建 / typecheck 同理
pnpm format             # Prettier 格式化
```

命令优先级：全局操作用 `pnpm <command>`（经由 turbo），单包操作用 `pnpm --filter <package> <script>`。

## 文档导航

- [CONTEXT.md](CONTEXT.md) — 领域术语表、架构约束、Classic Gotchas
- [docs/adr/](docs/adr/) — Architecture Decision Records（append-only）
- [docs/development-workflow.md](docs/development-workflow.md) — 开发流程、集成验证、故障排查
- [docs/state-management.md](docs/state-management.md) — Zustand 现行使用规范（Why 见 ADR-0004）
- [AGENTS.md](AGENTS.md) — agent 协作约定与文档路由规则
