# 0008 - Docker 部署：每应用独立镜像 + compose 编排

## Status

**Accepted**（2026-09-17）

## Context

仓库此前零容器化配置，部署止步于 tag 触发的 dist artifacts（`deploy-check.yml`）。wujie 架构下 portal 在浏览器跨域拉取子应用 HTML/JS/CSS，子应用响应必须带 CORS 头；且 portal 的子应用 entry 硬编码 `//localhost:8001/2`，编译进产物，无法在非本机环境部署。需要一套支持服务器/多环境的 Docker 方案。

## Decision

- **每应用独立镜像**：根目录一个多阶段 `Dockerfile`（`--target=portal|uc|flow`，共享一个全量构建阶段），`node:22-alpine` 构建 + `nginx:1.27-alpine` 运行，三应用共用 `docker/nginx.conf`（SPA fallback + CORS + gzip + immutable 缓存）
- **子应用地址 runtime 注入**：portal 镜像内置 `docker/config.js.template`（放 `/etc/nginx/templates`），容器启动时由 nginx 镜像内置 envsubst-on-templates 机制按 `SUBAPP_UC_URL` / `SUBAPP_FLOW_URL` 渲染 `config.js`；`subApps.ts` 读 `window.__APP_CONFIG__.subAppEntries` 并校验，非法/缺失直接报错（不兜底）。一次构建处处运行，dev 零成本（`public/config.js` 提供默认值，不进镜像）
- **compose 编排**：`compose.yaml` 起三服务映射 8000/8001/8002，地址协议相对（`//host:port`）保持 http/https 中立
- CI 暂不集成镜像构建推送，等 registry（GHCR 或内部 harbor）确定后再接

Why：

- 独立镜像延续 [0001](./0001-why-qiankun-for-micro-frontend.md)/[0005](./0005-migrate-qiankun-to-wujie.md)「子应用独立部署」的既定方向，发布粒度与架构一致
- 跨端口（跨源）部署对 vite `base`、子应用路由零改动；path-based 同源方案需改 `base` + `basename`，wujie iframe 路由有回归风险

Alternatives Considered：

- **单镜像多端口**（一个 nginx 三 server block）✅ 镜像少 / ❌ 三应用耦合，无法独立发布，违背独立部署目标
- **单镜像单端口 path-based**（`/`、`/uc/`、`/flow/`）✅ 运维最简、无 CORS / ❌ 需改 vite `base` 与子应用路由 `basename`，wujie iframe 内路由行为有回归风险
- **build 时注入 `VITE_*` 变量** ✅ 实现最少 / ❌ 一环境一镜像，违背静态镜像多环境最佳实践

## Consequences

Positive：三应用可独立构建发布；同一镜像跑任意环境；dev 行为不变。

Negative：子应用跨源部署需保留 CORS 头（nginx conf 已固化，属运维注意项）；compose 部署暴露三个端口，生产建议前置网关聚合。

## Implementation Notes

- 构建层缓存：先拷 manifests 再 `pnpm install --frozen-lockfile`，后拷源码；三 app 共享一个构建阶段 + `--mount=type=cache` 挂 turbo cache，compose 三镜像不重复冷构建
- nginx 头去重：`map $uri $cache_control` + server 级 `add_header`（空值 header 不输出），避免 `add_header` 在 `location` 内覆盖继承导致的逐块重复
- portal 启动时写 `/usr/share/nginx/html/config.js`：只读根文件系统（K8s `readOnlyRootFilesystem`）需为该路径挂可写 tmpfs，见 `docs/deployment.md`
- 操作文档见 `docs/deployment.md`

## Related Decisions

- [0005 - wujie 微前端运行时](./0005-migrate-qiankun-to-wujie.md)（跨源拉取与 CORS 约束来源）
- [0002 - pnpm + turborepo](./0002-why-pnpm-turborepo-for-monorepo.md)（构建入口 `turbo run build --filter=<app>...`）
