# Architecture Decision Records

记录本项目的重要架构决策：为什么选、备选是什么、后果如何。每篇 ADR 是**决策时点的快照**，不随代码演进更新（append-only）；被取代时只改 Status 标注，正文不动。

## 目录

- [0001 - qiankun 微前端](./0001-why-qiankun-for-micro-frontend.md)（已被 0005 取代）
- [0002 - pnpm + Turborepo](./0002-why-pnpm-turborepo-for-monorepo.md)
- [0003 - shared-common 源码直消费](./0003-why-shared-common-source-consumption.md)
- [0004 - Zustand 状态管理](./0004-why-zustand-for-state-management.md)
- [0005 - wujie 微前端运行时](./0005-migrate-qiankun-to-wujie.md)（现行）
- [0006 - 主基座更名 portal、核心包更名 @zrun/core](./0006-rename-portal-and-zrun-core.md)（现行）

## 写作规范

- **单篇 ~100 行以内**：决策 + 理由 + 后果。配置和代码的现行形态写在 living docs（`docs/*.md`）或代码注释里，ADR 只链接过去，不内嵌快照（快照会腐烂）
- **Status 必须带状态与取代关系**：`Accepted` / `Superseded by [NNNN](...)（日期）`；取代旧决策时同时在旧 ADR 的 Status 回链
- **备选方案要写清为什么不选**：Alternatives Considered 是 ADR 的核心价值，不是装饰
- **命名**：`NNNN-<slug>.md`，编号从 0001 连续递增，不复用已删除编号
- **Related Decisions 互链必须用实际文件名**（互链是 ADR 被发现的主要路径）

## 模板

```markdown
# NNNN - <决策标题>

## Status

**Accepted**（若取代旧决策：注明取代关系与日期）

## Context

面临什么问题/约束，为什么需要做这个决策。

## Decision

选了什么。Why：逐条理由。
Alternatives Considered：每个备选 ✅ 优势 / ❌ 劣势，说清为什么不选。

## Consequences

Positive / Negative / Mitigation。
Mitigation 指向 living docs（CONTEXT.md、docs/*.md），不复制内容。

## Implementation Notes

落地要点（可选；不放大段配置快照）。

## Related Decisions

- [NNNN - 标题](./NNNN-实际文件名.md)
```

范本：[0005](./0005-migrate-qiankun-to-wujie.md)（根因证据、模型差异表、Mitigation 指向 living docs 的写法）。
