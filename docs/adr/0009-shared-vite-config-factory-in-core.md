# 0009 - core 承载构建期 Vite 配置 factory（`@lesoon/core/vite`）

## Status

**Accepted**（2026-09-18）取代 [0007](./0007-core-runtime-helpers-and-opt-in-deps.md) Decision #3（Node 侧配置文件不 import core 源码）

## Context

版本管理改造（镜像 tag + `__APP_VERSION__` 编译期注入，见 `docs/deployment.md`）要求三个 `apps/*/vite.config.ts` 各自读根 `package.json` 的 version 并 `define` 注入，加上既有的 react 插件、build 约定、子应用 CORS 块，三份配置重复面翻倍，且靠"保持字节一致"的注释纪律维持。

0007 Decision #3 禁止 vite.config.ts import core 源码，理由是"Node 直接执行 TS 依赖 type-stripping（要求 Node ≥ 23.6）"。但该前提对 vite.config.ts 不成立：**Vite 加载 config 时先用 esbuild 打包编译**（拷贝到 `node_modules/.vite-temp/` 再 import），workspace 依赖照常解析，不经过 Node type-stripping。实际构建通过（portal/uc/flow `vite build` 均正常）。

## Decision

core 新增构建期专用 export subpath `./vite`（`packages/core/src/vite.ts`），承载 `createAppViteConfig({ port, subApp })` factory：react 插件、`__APP_VERSION__` 注入（读根 `package.json`，lockstep 唯一版本源）、build 约定、子应用 CORS headers。各 app 的 `vite.config.ts` 收敛为两行。

约束：

1. **仅限构建期**：`./vite` subpath 只允许 `vite.config.ts` / Node 脚本 import；浏览器侧代码（`src/**`）禁止 import，`.` 主入口不 re-export
2. **vite 相关依赖只进 devDependencies**（`vite`、`@vitejs/plugin-react`、`@types/node`，走 catalog 与 apps 同版本），运行时零新增依赖
3. core 其余边界（类型 + 纯函数 + React-free 运行时助手）不变；`src/vite.ts` 内的 `node:fs` 读取延迟到 factory 调用时执行，import 无副作用

Why：

- 三份配置重复是真实的（version 块加入后），不是投机抽象
- esbuild 编译路径已实证可行，0007 #3 的技术前提对该场景失效
- factory 放 core 复用既有的源码直消费与 opt-in 依赖机制（apps 仅在用到时加 devDep）

Alternatives Considered：

- **维持 0007 #3，三份内联** ✅ 边界不动 / ❌ version 注入等横切配置逐处改，字节一致靠纪律
- **根目录共享文件相对路径 import**（`../../vite.config.shared.ts`）✅ 不动 core / ❌ 绕过 workspace 语义与 package exports，类型解析脆
- **新建 `@lesoon/vite-config` 包** ✅ core 边界零争议 / ❌ 单一 factory 独立成包是过早分层，需要时再拆

## Consequences

Positive：vite 配置单点维护，新子应用接入两行；新增注入项（如未来 GIT_SHA）改一处。

Negative：core 语义再放宽一块（构建期工具），"无副作用/零依赖"表述需限定为运行时；`__APP_VERSION__` 注入所有 app 但目前仅 portal 消费（未引用即不进 bundle，无成本）。

Mitigation：边界规则更新见 `packages/core/README.md` 与 `CONTEXT.md`（core 条目）；操作命令见 `docs/deployment.md`。

## Related Decisions

- [0007 - core 承载 React-free 运行时助手与按需引入依赖](./0007-core-runtime-helpers-and-opt-in-deps.md)（Decision #3 被本篇取代，其余不变）
- [0003 - shared-common 源码直消费](./0003-why-shared-common-source-consumption.md)（源码直消费机制复用）
- [0008 - Docker 部署](./0008-docker-multi-image-deployment.md)（版本注入的需求来源）
