# 0006 - 主基座更名 portal、核心包更名 @zrun/core

## Status

**Accepted**（2026-08-29）

## Context

初版命名遗留两个问题：

1. `apps/main-base`：`main` 与 `base` 语义叠加（均指「主」），是「主基座」的直译，不地道且与子应用的业务短名（`uc`、`flow`）风格不一致
2. `packages/shared-common`：`shared` 与 `common` 同义叠加；且规划中 `packages/*` 会持续增多，需要可扩展的命名体系——底座层包 + scope 前缀

## Decision

- 主基座目录与包名：`apps/main-base` → `apps/portal`
- 核心共享包：`packages/shared-common` → `packages/core`，包名加公司 scope：`@zrun/core`（目录名保持 `packages/core`）
- apps 不加 scope（永不发布，保持短名利于 `pnpm --filter`）；`packages/*` 统一 `@zrun/<name>`

Why：

- **portal**：表达「统一门户入口」的定位，消除语义冗余，与子应用短名风格一致
- **core + scope**：多包分层结构中 `core` 语义为「底座层（foundation layer）」（同 `@angular/core`、`@nestjs/core` 用法）：一切包依赖它、它零依赖；`@zrun/` scope 防同名冲突、为内部 registry 发布预留

Alternatives Considered：

- **主基座 `host`** ✅ 对齐 wujie 官方 host/sub-app 术语 / ❌ 不表达「门户入口」的产品定位
- **主基座 `shell`** ✅ single-spa/MF 生态常用 / ❌ 同上，且与 `uc`/`flow` 的业务命名气质不符
- **保留 `main-base`** ✅ 零改动成本 / ❌ 语义冗余问题永续存在，越晚改成本越高
- **核心包 `shared`** ✅ 消除冗余 / ❌ 多包世界里「shared with whom?」越来越答不上来，无分层信息
- **核心包裸名 `core`（无 scope）** ✅ 短 / ❌ npm 生态最高频包名，TS 解析/自动导入易歧义，内部发布时第一个返工

## Consequences

Positive：命名体系可扩展（`@zrun/ui`、`@zrun/request`…）；名实相符（`core` 的分层语义由 README 规则锚定）。

Negative：历史 ADR（0001/0003/0005）中的旧路径 `apps/main-base/`、`shared-common` 成为失效指针（append-only，正文不追改）。

Mitigation：本 ADR 记录完整更名映射，旧名可经此检索；现行结构以 `CONTEXT.md` 与根 `README.md` 为准。`core` 的两条护栏规则（依赖单向、只放类型与纯函数）见 `packages/core/README.md`。

## Implementation Notes

- `git mv` 保留文件历史；lockfile 经 `pnpm install` 刷新
- 传给子应用的 props 标记 `mainBase: true` → `fromPortal: true`（无消费方，安全）

## Related Decisions

- [0003 - shared-common 源码直消费](./0003-why-shared-common-source-consumption.md)（其决策仍现行，仅包名变更）
- [0005 - wujie 微前端运行时](./0005-migrate-qiankun-to-wujie.md)
