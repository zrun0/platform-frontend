# 0002 - Why pnpm + Turborepo for Monorepo

## Status
**Accepted**

## Context
我们需要为 platform-frontend 选择一个 monorepo 工具链，以支持：
- 多包管理（apps/main-base, apps/uc, apps/flow, packages/shared-common）
- 高效的任务调度（dev、build、typecheck）
- 依赖管理（内部包引用、外部依赖去重）
- 快速的构建和缓存

## Decision
选择 **pnpm** 作为包管理器，**Turborepo** 作为任务调度工具。

### Why pnpm?
1. **节省磁盘空间**: 使用硬链接和符号链接，不复制 node_modules
2. **严格的依赖隔离**: 避免幽灵依赖（npm/yarn 的陷阱）
3. **速度快**: 比 npm/yarn 快 2-3 倍
4. **workspace 协议**: 原生支持 monorepo 内部包引用 (`workspace:*`)
5. **支持 Node.js 版本管理**: 可与 `.nvmrc` 或 `volta` 集成

### Why Turborepo?
1. **智能缓存**: 基于内容指纹的增量构建，只重构建变化的包
2. **并行执行**: 自动检测依赖关系，并行执行独立任务
3. **管道机制**: 一个任务的输出可作为另一个任务的输入
4. **远程缓存**: 可选的云端缓存，团队共享构建产物
5. **与 pnpm 深度集成**: 无需额外配置，自动识别 workspace 依赖

### Alternatives Considered

#### npm workspaces
- ✅ 优势：npm 原生支持，无需额外工具
- ❌ 劣势：幽灵依赖问题（提升依赖到根 node_modules）
- ❌ 劣势：磁盘空间浪费（复制依赖）
- ❌ 劣势：速度慢（无缓存、无并行优化）

#### Yarn workspaces
- ✅ 优势：成熟稳定，社区支持好
- ❌ 劣势：幽灵依赖问题（与 npm 相同）
- ❌ 劣势：磁盘空间浪费（PnP 模式有兼容性问题）
- ❌ 劣势：Yarn 2/3 配置复杂，破坏性变更多

#### Lerna
- ✅ 优势：老牌 monorepo 工具，功能完善
- ❌ 劣势：已不再积极维护（作者转向 Turborepo）
- ❌ 劣势：需配合 npm/yarn，增加复杂度
- ❌ 劣势：缓存和并行执行不如 Turborepo

#### Nx
- ✅ 优势：功能强大，支持多种框架（React、Angular、Vue）
- ✅ 优势：智能构建图，增量构建精确
- ❌ 劣势：学习曲线陡峭，配置复杂
- ❌ 劣势：过度工程化（对于我们的 3 app + 1 package 场景）
- ❌ 劣势：与 pnpm 集成不如 Turborepo 直接

## Consequences

### Positive
- ✅ 依赖管理高效（pnpm 硬链接，节省 50%+ 磁盘空间）
- ✅ 构建速度快（Turborepo 缓存 + 并行，增量构建 <10s）
- ✅ 开发体验好（pnpm workspace 协议简洁，类型共享自然）
- ✅ 团队协作友好（Turborepo 远程缓存可选）

### Negative
- ❌ 学习成本（团队需适应 pnpm + Turborepo 命令）
- ❌ 工具链复杂度（相比单一 npm，多一层抽象）
- ❌ 调试成本（缓存失效时需理解 Turborepo 指纹）

### Mitigation
- 🛠️ 统一的命令规范（文档明确 `pnpm` vs `turbo` 优先级）
- 🛠️ 详细的 turbo.json 配置注释（每个任务的作用）
- 🛠️ 清晰的缓存策略文档（inputs/outputs 配置说明）

## Implementation Notes

### turbo.json 配置策略
```json
{
  "pipeline": {
    "dev": {
      "cache": false,           // dev 不缓存（总是需要最新代码）
      "persistent": true        // dev 是持久任务（不会自动结束）
    },
    "build": {
      "cache": true,            // build 带缓存
      "dependsOn": ["^build"]   // 先构建依赖包
    },
    "typecheck": {
      "cache": true,            // 类型检查带缓存
      "outputs": ["dist/**"]    // shared-common 无 dist，会跳过
    }
  }
}
```

### 命令优先级
1. **全局操作**: `pnpm <command>` (经由 turbo)
   - `pnpm dev` → 全量 dev
   - `pnpm build` → 全量 build（带缓存）
2. **单包操作**: `pnpm --filter <package> <script>`
   - `pnpm --filter uc dev` → 只启动 uc
   - `pnpm --filter shared-common typecheck` → 只检查 shared 类型

### workspace 协议
```json
// apps/uc/package.json
{
  "dependencies": {
    "shared-common": "workspace:*"  // 引用 monorepo 内部包
  }
}
```

## Related Decisions
- [0001 - Why qiankun for Micro-Frontend Architecture](./0001-why-qiankun-for-micro-frontend.md)
- [0003 - Why shared-common Source Consumption](./0003-shared-common-source-consumption.md) (待创建)
