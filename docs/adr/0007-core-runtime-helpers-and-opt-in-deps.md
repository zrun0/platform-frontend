# 0007 - core 承载 React-free 运行时助手与按需引入依赖

## Status

**Accepted**（2026-08-29）部分调整 [0003](./0003-why-shared-common-source-consumption.md) 的内容边界约束与 [0006](./0006-rename-portal-and-zrun-core.md) 的「一切包依赖它」理由

## Context

两个问题同时暴露：

1. `apps/uc` 与 `apps/flow` 的入口 `main.tsx` 有 ~45 行逐字重复（wujie 生命周期注册 + standalone fallback + root 管理）。子应用数量会增长，重复随之线性增长，生命周期类 bug 需逐处修。但 0003 把 core 内容边界限定为「类型 + 纯函数」，运行时助手（操作 `window` 注册生命周期）被排除在外，无处可放
2. 0006 对 core 分层语义的表述是「一切包依赖它、它零依赖」。portal/flow 当前并无共享需求；为满足字面语义预挂 `workspace:*` 依赖是死依赖

## Decision

1. **内容边界放宽**：core 可承载类型定义、纯函数，以及**无副作用的 React-free 运行时助手**（首个实例：`registerWujieApp`，统一子应用生命周期注册）。仍然约束：零依赖、无业务逻辑；带副作用的（请求、存储、事件）依旧放独立包
2. **apps 对 core 按需引入**：实际用到才加 `workspace:*` 依赖，不为分层语义预挂
3. **Node 侧配置文件不 import core 源码**：`vite.config.ts` 里内联 dev server 配置。Node 直接执行 TS 依赖 type-stripping（要求 Node ≥ 23.6 且显式扩展名），与仓库 engines（Node ≥ 18）冲突；浏览器侧代码经 Vite 编译不受影响

Why：

- 生命周期注册是横切所有子应用的机械逻辑，单一实现收益直接、无投机抽象
- React-free + 零依赖的边界使 core 不会因运行时代码滑向「什么都能放」
- 依赖如实反映使用，避免「依赖了但没用」造成的虚假分层

Alternatives Considered：

- **保持 types-only + 接受 main.tsx 重复** ✅ 不动任何 ADR / ❌ 重复随子应用数线性增长，root 泄漏类 bug（见 CONTEXT.md Gotchas #3）要逐处防
- **新建 `@zrun/wujie` 运行时包** ✅ core 边界不动 / ❌ 当前仅一处共享，第二底座包是过早分层；需要时再拆不迟
- **tsconfig path-alias 直接引 core 源文件** ✅ 零依赖声明 / ❌ 绕过 workspace 语义，重构与类型解析都变脆

## Consequences

Positive：生命周期注册单一实现（`registerWujieApp`），新子应用入口 ~20 行；依赖图真实反映使用。

Negative：core 语义变宽，「React-free、零依赖、无副作用」边界需要持续守护；子应用 vite CORS 配置仍是两份内联（Node 侧限制）。

Mitigation：边界规则见 `packages/core/README.md` 与 `CONTEXT.md`（core 条目）；uc/flow 的 vite CORS 块以注释互相锚定保持字节一致。

## Related Decisions

- [0003 - shared-common 源码直消费](./0003-why-shared-common-source-consumption.md)（分发策略不变，内容边界由本篇放宽）
- [0006 - 主基座更名 portal、核心包更名 @zrun/core](./0006-rename-portal-and-zrun-core.md)（命名与分层不变，依赖策略改为按需）
- [0005 - wujie 微前端运行时](./0005-migrate-qiankun-to-wujie.md)
