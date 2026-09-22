# 0010 - 移除 GitHub Actions workflows

## Status

**Accepted**（2026-09-18）

## Context

仓库原有四个 GitHub Actions workflow：`ci.yml`（push/PR 全量 build+test）、`pr-check.yml`（PR affected-only 快检）、`status.yml`（每周 cron"健康检查"，内容为 echo 验证文件存在）、`deploy-check.yml`（`v*` tag 触发的部署前校验 + dist artifacts）。

Docker 部署（[0008](./0008-docker-multi-image-deployment.md)）落地后情况变化：

1. `deploy-check.yml` 的 dist artifacts 部署路径已被镜像部署整体取代
2. `ci.yml` / `pr-check.yml` 只是本地 `pnpm lint/typecheck/build` 的远端复读，无独立价值；当前阶段（无外部贡献者、无强制 branch protection 依赖）不构成门禁
3. `status.yml` 的结构 echo 检查无实际产出
4. 0008 已决定 CI 镜像构建推送等 registry 确定后再接 —— 届时流水线围绕"tag → build → push 双 tag"重建，现有 workflow 与目标形态无复用关系

## Decision

移除全部四个 `.github/workflows/*.yml`。质量检查回归本地命令（`pnpm lint` / `lint:all` / `typecheck` / `build`，见 `docs/development-workflow.md`）；CI 等 registry 落地后随镜像流水线一并重建，不在旧 workflow 上修补。

Why：

- 保留半死的 workflow（触发着但门禁无人依赖）比删除更糟：绿勾给虚假信心
- 重建成本低于改造：旧 workflow 与目标流水线（镜像构建推送）无共享步骤

Alternatives Considered：

- **只删 `deploy-check.yml`，留 lint/test CI** ✅ 保留远端门禁 / ❌ 与"等 registry 后重建完整流水线"的节奏割裂，中间态维护无收益
- **全部保留并修复** ✅ 零删除 / ❌ `deploy-check` 已无意义，`status` 纯噪音

## Consequences

Positive：仓库无半死自动化；CI 债务显式化（记录于本篇）而非伪装在线。

Negative：push/PR 无自动质量门禁，本地检查成为唯一防线；依赖个人纪律。

Mitigation：本地命令文档化于 `docs/development-workflow.md`；registry 确定后按 0008 重建流水线时恢复门禁（lint/typecheck/build + 镜像构建推送）。

## Related Decisions

- [0008 - Docker 部署](./0008-docker-multi-image-deployment.md)（部署路径变更来源；CI 重建的触发条件）
- [0002 - pnpm + Turborepo](./0002-why-pnpm-turborepo-for-monorepo.md)（本地检查任务定义）
