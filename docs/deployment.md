# Docker 部署

每应用独立镜像（portal / uc / flow），nginx 静态托管，`compose.yaml` 编排。决策背景见 [ADR 0008](./adr/0008-docker-multi-image-deployment.md)。

## 快速开始（本机）

```bash
docker compose up --build
```

- portal: http://localhost:8000
- uc: http://localhost:8001
- flow: http://localhost:8002

本机场景浏览器与容器同机，子应用默认地址 `//localhost:8001`、`//localhost:8002` 直接可用，无需任何配置。

## 服务器 / 多环境部署

portal 的子应用 entry 在容器启动时由环境变量生成（nginx 镜像内置 envsubst-on-templates 机制，模板在 `/etc/nginx/templates`），无需按环境重新构建镜像：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `SUBAPP_UC_URL` | `//localhost:8001` | uc 子应用 entry，协议相对地址 |
| `SUBAPP_FLOW_URL` | `//localhost:8002` | flow 子应用 entry，协议相对地址 |

```bash
SUBAPP_UC_URL=//demo.example.com:8001 \
SUBAPP_FLOW_URL=//demo.example.com:8002 \
docker compose up -d
```

地址必须是浏览器可达地址（wujie 在浏览器侧拉取子应用），不是容器网络地址。协议相对写法（`//host:port`）随页面 http/https 自适应。

## 单独构建某个应用镜像

```bash
docker build --target=portal -t platform-portal .
docker build --target=uc -t platform-uc .
docker build --target=flow -t platform-flow .
```

三个 target 共享同一个构建阶段（一次 turbo 全量构建），单应用重建不再触发完整冷构建。

运行非 compose 托管的 portal 镜像时，必须通过 `-e SUBAPP_UC_URL=... -e SUBAPP_FLOW_URL=...` 注入；未注入时 `config.js` 会包含字面 `${SUBAPP_*_URL}`，页面 console 报错（fail loud，by design）。

## 版本管理

唯一版本源：**根 `package.json` 的 `version` 字段**（lockstep —— 三镜像同版本号同时发版；子包 `package.json` 无 version 字段，避免第二版本源）。

发版 bump（自动改 version + 打 git tag `vX.Y.Z`）：

```bash
npm version patch|minor|major
```

带版本 tag 构建镜像（sha 写入 OCI label），命令收编在 `justfile`：

```bash
just build           # = TAG=$(jq -r .version package.json) docker compose build --build-arg GIT_SHA=$(git rev-parse --short HEAD)
just deploy X.Y.Z    # = TAG=X.Y.Z docker compose up -d --no-build（X.Y.Z = 根 package.json 的 version）
just inspect X.Y.Z   # 查 OCI label（默认 portal，可加 app 参数）
```

版本呈现三层：

| 层 | 内容 | 查看方式 |
| --- | --- | --- |
| 镜像 tag | `platform-portal:X.Y.Z` | `docker images` |
| OCI label | `org.opencontainers.image.revision=<sha>` | `just inspect <tag>` |
| 运行时 | portal console `[portal] version X.Y.Z`（vite 编译期从根 package.json 注入 `__APP_VERSION__`） | 浏览器 DevTools Console |

回滚：`just deploy <旧版本>`。**前提：旧版本镜像已在本地**（`--no-build`，镜像缺失直接报错而不是重新构建 —— 同 tag 重建会得到不同 sha，回滚语义失效）。跨机回滚需 registry，暂未接入（见 ADR 0008）。

## 运行时配置机制

- `apps/portal/public/config.js`：dev 默认值（`pnpm dev` 直接可用），不进入 portal 镜像
- `docker/config.js.template`：portal 镜像内 `/etc/nginx/templates` 模板，启动时由 nginx 内置 envsubst 渲染到 `/usr/share/nginx/html/config.js`
- `apps/portal/src/wujie/subApps.ts`：读 `window.__APP_CONFIG__.subAppEntries` 并校验（非法/缺失 entry 直接抛错，不再静默兜底 localhost）

## 注意事项

- **CORS**：wujie 主应用跨源拉取子应用资源，nginx 配置（`docker/nginx.conf`）已统一输出 `Access-Control-Allow-Origin: *`。若前置网关/CDN 改写响应头，需保留该头
- **缓存**：`/assets/*`（带 hash）immutable 一年；`index.html` 与 `config.js` no-cache，发版即时生效
- **只读根文件系统**：portal 启动时要写 `/usr/share/nginx/html/config.js`（envsubst 渲染）。K8s `readOnlyRootFilesystem: true` 或 nginxunprivileged 镜像需给该路径挂可写 tmpfs（如 emptyDir），否则 portal 容器 crash-loop；uc/flow 无此需求
- **绕过 entrypoint**：portal 镜像刻意不内置 dev `config.js`，绕过 nginx entrypoint（如 `--entrypoint nginx`）时 `/config.js` 404、console 报错，而不是静默指向 localhost
- **HTTPS**：镜像内不做 TLS 终结，交给前置网关；`SUBAPP_*_URL` 用协议相对地址即可
- CI 镜像构建推送（GHCR / 内部 registry）暂未接入，见 ADR 0008
