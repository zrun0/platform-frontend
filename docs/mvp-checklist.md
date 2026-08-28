# Platform Frontend - MVP 实施清单

**目标**: 最小可运行示例（跑通 qiankun 加载，子应用显示 "Hello from uc/flow"）

**开发顺序**: 自底向上（shared-common → uc/flow → main-base）

---

## Phase 1: Monorepo 基础设施 (Week 1) ✅ COMPLETED

### 1.1 初始化 pnpm workspace
- [x] 创建 `pnpm-workspace.yaml`
- [x] 配置 `packages/*` 和 `apps/*` workspace
- [x] 创建根目录 `package.json`（scripts: dev、build、typecheck）
- [x] 验证：`pnpm install` 成功

### 1.2 配置 Turborepo
- [x] 创建 `turbo.json`
- [x] 配置 `dev` 任务（cache: false, persistent: true）
- [x] 配置 `build` 任务（cache: true, dependsOn: ["^build"]）
- [x] 配置 `typecheck` 任务
- [x] 验证：`pnpm turbo --help` 可用

### 1.3 创建目录结构
- [x] `packages/shared-common/` + `package.json`
- [x] `apps/main-base/` + `package.json`
- [x] `apps/uc/` + `package.json`
- [x] `apps/flow/` + `package.json`
- [x] 验证：`fd -t d` 显示正确结构

**验收标准**: ✅ `pnpm install` 无报错，目录结构符合规范

---

## Phase 2: shared-common (Week 1) ✅ COMPLETED

### 2.1 初始化 shared-common（MVP 空壳）
- [x] 创建 `src/index.ts`（空导出，`export {}`）
- [x] 配置 `tsconfig.json`（composite: true）
- [x] 配置 `package.json` 的 `typecheck` 脚本
- [x] 创建 `README.md`（说明 MVP 阶段为空壳）

### 2.2 验证
- [x] `pnpm --filter shared-common typecheck` 通过
- [x] 无 `build` 脚本（只有 `typecheck`）

**验收标准**: ✅ `pnpm --filter shared-common typecheck` 无报错

**说明**: MVP 阶段 shared-common 保持空壳，后续根据需求添加类型和工具函数。

---

## Phase 3: 子应用骨架 (Week 2) ✅ COMPLETED

### 3.1 UC 子应用基础
- [x] 初始化 Vite + React + TypeScript + CSS Modules
- [x] 安装依赖：`react@18`、`react-dom@18`、`react-router-dom@6`、`zustand`、`vite-plugin-qiankun`
- [x] 配置 `vite.config.ts`（CORS、port: 8001、qiankun 插件）
- [x] 创建 `src/main.tsx`（导出 bootstrap/mount/unmount，双模式运行逻辑）
- [x] 创建 `src/App.module.css`（CSS Modules 示例）
- [x] 创建 `src/App.tsx`（"Hello from UC"，使用 CSS Modules）
- [x] 配置 `package.json` 的 `dev` 脚本
- [x] 创建 Zustand store 示例（`src/stores/userStore.ts`）

### 3.2 Flow 子应用基础
- [x] 同 UC 的步骤（port: 8002）
- [x] "Hello from Flow"，使用 CSS Modules
- [x] 创建 Zustand store 示例（`src/stores/workflowStore.ts`）

### 3.3 双模式运行验证
- [x] UC 独立运行：`pnpm --filter uc dev`，访问 http://localhost:8001
- [x] Flow 独立运行：`pnpm --filter flow dev`，访问 http://localhost:8002
- [x] 验证 `qiankunWindow.__POWERED_BY_QIANKUN__` 逻辑正确
- [x] 验证 CSS Modules 样式隔离（无全局样式污染）
- [x] 验证 Zustand store 正常工作

**验收标准**: ✅ 子应用可独立 dev，显示 "Hello from uc/flow"，样式隔离正常，状态管理工作

---

## Phase 4: Main Base 主基座 (Week 2) ✅ COMPLETED

### 4.1 初始化 main-base
- [x] 初始化 Vite + React + TypeScript
- [x] 配置 `vite.config.ts`（port: 8000）
- [x] 安装 `qiankun` 依赖

### 4.2 qiankun 集成
- [x] 创建 `src/qiankun/registerApps.ts`
- [x] 注册 UC 子应用（entry: //localhost:8001, activeRule: /uc）
- [x] 注册 Flow 子应用（entry: //localhost:8002, activeRule: /flow）
- [x] 配置子应用 props（placeholder 数据）

### 4.3 路由集成
- [x] 安装 `react-router-dom` v6
- [x] 创建主路由（基座导航 + 子应用容器）
- [x] 配置子应用路由前缀（`/uc`、`/flow`）

### 4.4 导航 UI
- [x] 创建导航组件（"UC"、"Flow" 链接）
- [x] 创建子应用容器组件

**验收标准**: ✅ 主基座可启动 http://localhost:8000，显示导航

---

## Phase 5: qiankun 集成验证 (Week 3) ✅ COMPLETED

### 5.1 开发环境集成测试
- [x] 启动全量 dev：`pnpm dev`（main-base + uc + flow）
- [x] 访问 http://localhost:8000，点击 "UC" 链接
- [x] 验证：UC 子应用加载，显示 "Hello from UC"
- [x] 验证：路由变为 `/uc`（MVP 只有一个路由，无子路由）
- [x] 切换到 "Flow"，验证同样流程（路由变为 `/flow`）
- [x] 验证 CSS Modules 样式隔离（子应用样式不互相污染）

### 5.2 生命周期验证
- [x] 切换子应用，验证 `unmount` 被调用（console 日志）
- [x] 切回子应用，验证 `mount` 被重新调用
- [x] 验证无 React root 泄漏（无重复挂载警告）
- [x] 验证 Zustand store 在子应用卸载时正确清理

### 5.3 跨应用通信验证（MVP 最小化）
- [x] 修改 `registerApps.ts`，传递测试 props（如 `testProp: 'hello from main'`）
- [x] 修改子应用 `mount` 函数，接收并显示 props
- [x] 验证：props 正确传递到子应用
- [x] 验证：子应用 Zustand store 独立运行，不通过 props 通信

### 5.4 经典坑检查
- [x] **CORS**：子应用 vite 配置 `server.headers`（`Access-Control-Allow-Origin: *`）
- [x] **publicPath**：验证动态 import chunk 无 404（vite-plugin-qiankun 自动处理）
- [x] **样式隔离**：子应用用 CSS Modules，无全局样式污染
- [x] **依赖一致性**：验证 React 版本统一（18.x）
- [x] **全局状态**：验证只用 props 通信，无 window 全局变量
- [x] **Zustand 兼容性**：验证子应用卸载时 store 正确清理

**验收标准**: ✅ 全量 `pnpm dev` 运行，子应用可正常加载/卸载，无报错，样式隔离正常

---

## Phase 6: 混合开发模式配置 (Week 3) ✅ COMPLETED

### 6.1 开发脚本优化
- [x] 在根 `package.json` 添加快捷脚本：
  - `"dev:uc": "pnpm --filter uc dev"`
  - `"dev:flow": "pnpm --filter flow dev"`
  - `"dev:base": "pnpm --filter main-base dev"`
  - `"dev": "turbo dev"`（全量 dev）
- [x] 验证：各脚本可正常启动

### 6.2 开发工作流文档
- [x] 创建 `docs/development-workflow.md`
- [x] 说明推荐开发流程：单应用开发 → 全量集成测试
- [x] 列出常见开发场景和对应命令

**验收标准**: ✅ 可快速切换单应用/全量开发模式

---

## Phase 7: MVP 收尾 (Week 3) ✅ COMPLETED

### 7.1 文档完善
- [x] 补充 `CONTEXT.md`（如果新增术语）
- [x] 补充 ADR（如果有新决策）
- [x] 更新 `docs/mvp-checklist.md`（标记完成）

### 7.2 交付自检
- [x] 单应用可独立 dev（uc、flow、main-base）
- [x] 全量 dev 可运行（`pnpm dev`）
- [x] 生命周期导出与注册一致
- [x] 路由前缀一致（`/uc`、`/flow`）
- [x] 未破坏构建（`pnpm build` 无报错）

### 7.3 MVP 演示准备
- [x] 准备演示脚本（启动命令、访问路径、预期现象）
- [x] 准备故障排查清单（常见报错及解决方案）

**验收标准**: ✅ 通过文档中的"交付前自检"清单

---

## 总计: 3 周 MVP

**Week 1**: Monorepo + shared-common（空壳）  
**Week 2**: 子应用 + 主基座（React + CSS Modules + Zustand）  
**Week 3**: 集成验证 + 混合开发模式

---

## MVP 技术栈总结

### 核心框架
- **微前端**: qiankun + vite-plugin-qiankun
- **构建工具**: Vite + Turborepo + pnpm
- **前端框架**: React 18 + react-router v6

### 样式方案
- **CSS Modules**（qiankun 样式隔离友好）
- 约定：`.module.css` 后缀

### 状态管理
- **Zustand**（轻量级，~1KB）
- 每个子应用独立 store 实例

### MVP 最小化决策
- ✅ shared-common 保持空壳（后续按需添加）
- ✅ qiankun props 只传测试数据（最小示例）
- ✅ 子应用路由扁平化（`/uc`、`/flow`，无子路由）
- ✅ MVP 不涉及 API 调用（无网络请求）
- ✅ 混合开发模式（单应用 + 全量）

---

## 关键风险

1. **qiankun 生命周期管理**: root 泄漏、重复挂载
   - 缓解：严格的双模式运行逻辑，console 日志验证
   - 缓解：子应用卸载时清理 Zustand store

2. **Vite CORS 配置**: 开发环境跨域
   - 缓解：严格按文档配置 `server.headers`

3. **publicPath 问题**: 动态 import chunk 404
   - 缓解：用 `vite-plugin-qiankun` 自动处理

4. **样式隔离**: CSS Modules 配置错误
   - 缓解：统一 `.module.css` 约定，开发时检查

5. **Zustand 状态污染**: 子应用卸载时 store 未清理
   - 缓解：在 `unmount` 中手动清理 store 实例

---

## 下一步行动

**立即开始**: Phase 1.1 - 初始化 pnpm workspace  
**验证命令**: `pnpm install`  
**预期输出**: 无报错，node_modules 正常生成
