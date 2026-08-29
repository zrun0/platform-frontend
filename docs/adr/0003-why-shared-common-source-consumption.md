# 0003 - Why shared-common Source Consumption (No Build Step)

## Status

**Accepted**（「内容限制：只放类型定义 + 纯工具函数」约束已由 [0007](./0007-core-runtime-helpers-and-opt-in-deps.md) 放宽，2026-08-29；源码直消费分发策略仍现行）

## Context

我们需要为 `packages/shared-common` 选择一种分发策略：

- **选项 A**: 独立构建输出 dist，各 app 引用 dist
- **选项 B**: 不独立构建，各 app 直接消费 TS 源码

## Decision

选择 **选项 B**：各 app 直接消费 `shared-common` 的 TS 源码，`shared-common` 只配置 `typecheck`，不配置 `build`。

### Why Source Consumption?

1. **类型安全**: 直接消费 TS 源码，编译时类型检查，无类型丢失
2. **开发体验**: 修改 shared-common 后，各 app 立即生效（无需重新构建 shared）
3. **简化工程**: 少一层构建产物管理，无需关注 dist 清理、版本号
4. **适用场景**: shared-common 只包含类型和工具函数，不包含复杂构建逻辑

### Constraints & Safeguards

1. **内容限制**: 只放类型定义 + 纯工具函数（无业务逻辑、无副作用）
2. **无独立构建**: 只配置 `typecheck` 任务，不配置 `build`
3. **依赖单向**: `apps/*` → `packages/*`，禁止反向依赖
4. **TS 配置**: 各 app 的 `tsconfig.json` 需正确配置 `composite: true` 和 `references`

### Alternatives Considered

#### 独立构建 + dist 引用

- ✅ 优势：运行时快（无需实时编译 shared）
- ✅ 优势：边界清晰（dist 是稳定的发布物）
- ❌ 劣势：开发体验差（改 shared 需重新构建）
- ❌ 劣势：类型可能丢失（如果有构建步骤问题）
- ❌ 劣势：增加复杂度（需管理 dist 版本、清理策略）

#### Transpile (Babel 转换)

- ✅ 优势：性能好（预先编译）
- ❌ 劣势：失去类型信息（Babel 只做语法转换）
- ❌ 劣势：增加工具链复杂度

#### 无 shared-common（复制代码）

- ✅ 优势：最简单，无依赖
- ❌ 劣势：代码重复（违反 DRY）
- ❌ 劣势：维护成本高（改一处需改多处）
- ❌ 劣势：类型不一致风险

## Consequences

### Positive

- ✅ 类型安全（编译时检查，无类型丢失）
- ✅ 开发体验好（修改 shared 后各 app 立即生效）
- ✅ 工程简单（少一层构建产物管理）
- ✅ 依赖清晰（workspace:* 协议，版本自动同步）

### Negative

- ❌ 编译时开销（各 app 需实时编译 shared 源码）
- ❌ 约束依赖强（shared 不能有复杂构建逻辑）
- ❌ 调试复杂度（跨包问题需理解 TS project references）

### Mitigation

- 🛠️ 严格的内容边界（只放类型 + 工具函数）
- 🛠️ Turborepo 缓存（typecheck 有缓存，重复检查快）
- 🛠️ 清晰的文档说明（CONTEXT.md 明确 shared 的定位）

## Implementation Notes

> 注：本节配置为决策时点（2026-08）快照，仅作背景参考；现行配置以仓库实际文件（`packages/shared-common/package.json`、各 app `tsconfig.json`）为准。

### shared-common/package.json

```json
{
  "name": "shared-common",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit" // 只做类型检查，不输出
  },
  "dependencies": {}
}
```

### app 的 tsconfig.json

```json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true
  },
  "references": [{ "path": "../../packages/shared-common" }]
}
```

### 引用方式

```typescript
// apps/uc/src/utils/useAuth.ts
import { User } from 'shared-common/types'; // 直接消费 TS 源码
import { formatDate } from 'shared-common/utils';
```

### 内容边界（strict）

```typescript
// ✅ 允许：类型定义
export type User = { id: string; name: string };

// ✅ 允许：纯工具函数
export function formatDate(date: Date): string {
  /* ... */
}

// ❌ 禁止：业务逻辑
export const currentUser = getUser(); // 业务状态

// ❌ 禁止：副作用
export function setupAnalytics() {
  /* 全局副作用 */
}
```

## Related Decisions

- [0001 - Why qiankun for Micro-Frontend Architecture](./0001-why-qiankun-for-micro-frontend.md)
- [0002 - Why pnpm + Turborepo for Monorepo](./0002-why-pnpm-turborepo-for-monorepo.md)
