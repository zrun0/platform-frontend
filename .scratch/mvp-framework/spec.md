# MVP Framework Specification

## Problem Statement

当前项目是一个空的代码库，只有设计文档（CONTEXT.md）描述了基于 qiankun 的微前端架构愿景。需要从零搭建一个完整的、可运行的微前端框架，使开发团队能够：
- 本地开发环境启动主基座和所有子应用
- 验证微前端架构的可行性
- 为后续功能开发提供坚实的技术基础

## Solution

搭建一个完整的 qiankun 微前端 MVP 框架，包含以下组件：
- **Main Base**: qiankun 主基座应用，负责子应用注册和路由导航
- **UC Sub-app**: 用户中心子应用，展示简单首页
- **Flow Sub-app**: 工作流管理子应用，展示简单首页
- **Shared Common**: 共享类型定义和工具函数包

技术栈采用 React 18 + TypeScript + Vite + qiankun + Turborepo + pnpm，确保现代化的开发体验和构建性能。

## User Stories

### 开发环境搭建

1. 作为一个开发者，我希望能够运行 `pnpm install` 安装所有依赖，以便快速搭建开发环境
2. 作为一个开发者，我希望能够运行 `pnpm dev` 启动所有应用，以便在本地进行集成开发
3. 作为一个开发者，我希望能够运行 `pnpm --filter <app> dev` 单独启动某个应用，以便进行独立的子应用开发
4. 作为一个开发者，我希望能够运行 `pnpm build` 构建所有应用，以便进行生产部署
5. 作为一个开发者，我希望有统一的 TypeScript 配置，以便保持代码类型安全
6. 作为一个开发者，我希望有 Prettier 代码格式化，以便保持代码风格一致

### 主基座功能

7. 作为一个开发者，我希望 Main Base 能够注册 UC 和 Flow 子应用，以便通过 qiankun 加载它们
8. 作为一个用户，我希望看到 Main Base 的导航栏，以便在 UC 和 Flow 之间切换
9. 作为一个开发者，我希望 Main Base 能够根据路由规则（`/uc`、`/flow`）激活对应的子应用，以便实现正确的微前端路由
10. 作为一个开发者，我希望 Main Base 能够处理 qiankun 生命周期（bootstrap、mount、unmount），以便正确管理子应用
11. 作为一个开发者，我希望 Main Base 使用 React 18 和 react-router v6，以便保持技术栈现代化

### 子应用功能

12. 作为一个开发者，我希望 UC 子应用能够导出 qiankun 生命周期函数，以便被主基座正确加载
13. 作为一个用户，我希望访问 `/uc` 路由时看到 UC 子应用的首页，显示"用户中心"文字
14. 作为一个开发者，我希望 UC 子应用能够独立运行在 `localhost:8001`，以便进行独立开发
15. 作为一个开发者，我希望 UC 子应用使用 CSS Modules 管理样式，以便避免样式污染
16. 作为一个开发者，我希望 Flow 子应用能够导出 qiankun 生命周期函数，以便被主基座正确加载
17. 作为一个用户，我希望访问 `/flow` 路由时看到 Flow 子应用的首页，显示"工作流管理"文字
18. 作为一个开发者，我希望 Flow 子应用能够独立运行在 `localhost:8002`，以便进行独立开发
19. 作为一个开发者，我希望 Flow 子应用使用 CSS Modules 管理样式，以便避免样式污染

### 共享包功能

20. 作为一个开发者，我希望 Shared Common 包提供基础的 TypeScript 类型定义（如 User、Workflow），以便在多个应用间共享数据结构
21. 作为一个开发者，我希望 Shared Common 包提供简单的工具函数，以便验证跨包引用机制
22. 作为一个开发者，我希望 UC 和 Flow 子应用能够通过 `workspace:*` 协议引用 Shared Common，以便使用共享的类型和工具

### 构建与部署

23. 作为一个开发者，我希望每个应用的构建产物输出到 `dist/` 目录，以便符合 Vite 的标准约定
24. 作为一个开发者，我希望 Turborepo 能够缓存构建任务，以便提高后续构建速度
25. 作为一个开发者，我希望构建产物能够正确处理 qiankun 的资源加载需求，以便子应用在生产环境中正常工作

### 代码质量与规范

26. 作为一个开发者，我希望所有应用使用严格的 TypeScript 配置，以便在开发阶段捕获类型错误
27. 作为一个开发者，我希望有统一的 `tsconfig.base.json` 配置，以便保持 monorepo 内的 TypeScript 一致性
28. 作为一个开发者，我希望 Prettier 配置能够自动格式化代码，以便减少代码风格争议
29. 作为一个开发者，我希望 `.gitignore` 能够忽略构建产物和依赖，以便保持仓库整洁

### 开发体验

30. 作为一个开发者，我希望子应用支持 CORS 配置，以便在 qiankun 环境中正常加载
31. 作为一个开发者，我希望 vite-plugin-qiankun 能够自动处理子应用的生命周期导出，以便减少手动配置
32. 作为一个开发者，我希望能够在浏览器中访问 `localhost:8000` 看到完整的微前端应用，以便验证整个架构
33. 作为一个开发者，我希望子应用的双模式运行（独立开发 + qiankun 集成）能够无缝切换，以便提高开发效率
34. 作为一个开发者，我希望路由导航能够平滑切换，不会出现白屏或闪烁，以便提供良好的用户体验
35. 作为一个开发者，我希望有清晰的项目文档（CONTEXT.md），以便新成员快速理解项目架构

## Implementation Decisions

### 项目结构

采用标准 Turborepo monorepo 结构：

```
platform-frontend/
├── apps/
│   ├── main-base/        # 主基座 (port 8000)
│   ├── uc/               # UC 子应用 (port 8001, route prefix /uc)
│   └── flow/             # Flow 子应用 (port 8002, route prefix /flow)
├── packages/
│   └── shared-common/    # 共享类型和工具
├── package.json          # 根 package.json
├── pnpm-workspace.yaml   # pnpm workspace 配置
├── turbo.json            # Turborepo 配置
├── tsconfig.base.json    # 基础 TypeScript 配置
├── .prettierrc           # Prettier 配置
└── .gitignore            # Git 忽略规则
```

### 技术栈配置

**Frontend**: React 18.3.x, TypeScript 5.x
**Micro-frontend**: qiankun 2.x 或 3.x, vite-plugin-qiankun
**Build**: Vite 5.x, Turborepo 2.x
**Package Manager**: pnpm 9.x
**State Management**: Zustand 4.x（子应用内部状态）
**Routing**: react-router-dom v6
**Styling**: CSS Modules（约定 `.module.css` 后缀）

### 应用职责划分

**Main Base 职责**：
- 使用 qiankun 的 `registerMicroApps` 注册 UC 和 Flow 子应用
- 提供 react-router 基础路由（`/uc` 和 `/flow`）
- 渲染简单导航栏，允许用户在子应用间切换
- 设置 qiankun 的 `start()` 方法启动微前端框架
- 处理子应用加载错误边界

**UC Sub-app 职责**：
- 导出 qiankun 生命周期（bootstrap、mount、unmount）
- 使用 react-router 管理内部路由（MVP 阶段只有首页）
- 渲染显示"用户中心"的简单首页
- 配置 vite-plugin-qiankun 支持双模式运行
- 使用 CSS Modules 管理组件样式

**Flow Sub-app 职责**：
- 导出 qiankun 生命周期（bootstrap、mount、unmount）
- 使用 react-router 管理内部路由（MVP 阶段只有首页）
- 渲染显示"工作流管理"的简单首页
- 配置 vite-plugin-qiankun 支持双模式运行
- 使用 CSS Modules 管理组件样式

**Shared Common 职责**：
- 定义基础 TypeScript 类型（User、Workflow 等业务实体）
- 提供简单工具函数（如日期格式化、字符串处理等）
- 导出类型和函数供子应用引用
- 不包含任何业务逻辑或副作用

### 路由策略

**Main Base 路由**：
- 使用 react-router v6 的 `Routes` 和 `Route` 组件
- 路由配置：
  - `/uc` → 激活 UC 子应用
  - `/flow` → 激活 Flow 子应用
  - `/` → 重定向到 `/uc`
- 不直接管理子应用内部路由

**子应用路由**：
- 每个子应用有独立的 react-router 实例
- 在 qiankun 环境中，使用 `basename` 配置路由前缀
- 在独立开发环境中，直接使用根路径路由
- MVP 阶段每个子应用只有根路径（`/`）的首页

### qiankun 集成配置

**Main Base 配置**：
- 使用 `registerMicroApps` 注册子应用，配置包括：
  - `name`: 应用名称
  - `entry`: 子应用入口 URL（开发环境使用 localhost 端口）
  - `container`: 容器选择器
  - `activeRule`: 激活路由规则
- 配置 qiankun 全局错误处理
- 设置子应用加载前的预检查

**子应用配置**：
- 使用 `vite-plugin-qiankun` 插件
- 配置 `useDevMode` 开发模式支持
- 设置 CORS 头以允许跨域加载
- 配置 `qiankun` 的 `__POWERED_BY_QIANKUN__` 全局变量检测
- 实现双模式生命周期管理

### 开发工作流配置

**Turborepo 配置**：
- 配置 `pipeline` 定义任务依赖关系
- 设置 `cache` 启用构建缓存
- 配置 `outputLog` 显示构建日志

**pnpm workspace 配置**：
- 定义 `workspace:*` 协议用于内部包引用
- 配置 `packages` 指向 `apps/*` 和 `packages/*`
- 设置严格的 peer dependency 检查

### TypeScript 配置

**基础配置（tsconfig.base.json）**：
- `strict: true` 启用严格模式
- `esModuleInterop: true` 支持模块互操作
- `skipLibCheck: true` 跳过库文件类型检查
- `composite: true` 支持 monorepo 项目引用
- `declaration: true` 生成类型声明文件

**应用级配置**：
- 每个 app 的 `tsconfig.json` 继承 `tsconfig.base.json`
- 配置 `compilerOptions.paths` 支持 workspace 包引用
- 子应用配置 `jsx: react-jsx` 支持 React 18

### 代码质量配置

**Prettier 配置**：
- 使用单引号
- 2 空格缩进
- 80 字符行宽限制
- 尾随逗号
- semicolon: true

**暂不配置**：
- ESLint（留给后续配置）
- Husky/lint-staged（留给后续配置）

### 构建配置

**Vite 配置**：
- Main Base 配置 `base: ./` 用于正确加载资源
- 子应用配置 `vite-plugin-qiankun` 插件
- 设置 `server.cors` 允许跨域
- 配置 `build.outDir: dist`

**Turborepo pipeline**：
- `dev`: 并行启动所有应用
- `build`: 按依赖顺序构建，启用缓存
- `lint`: 并行运行 Prettier 检查

### 跨应用通信约束

根据 CONTEXT.md 的架构决策：
- **仅使用 qiankun props 单向传参**
- **禁止**：
  - 在 shared-common 预埋全局状态
  - 使用事件总线跨应用通信
  - 通过 window 全局变量共享数据
  - 跨应用直接 import

MVP 阶段暂不需要实际传递 props，只需验证机制可用。

### 样式隔离

- 所有组件使用 CSS Modules
- 约定 `.module.css` 文件后缀
- 通过 `import styles from './xxx.module.css'` 引入
- 避免 CSS 全局选择器污染
- MVP 阶段不使用 CSS-in-JS 或预处理器

### 端口与路由配置

**端口分配**：
- Main Base: `localhost:8000`
- UC 子应用: `localhost:8001`
- Flow 子应用: `localhost:8002`

**路由前缀**：
- UC: `/uc`
- Flow: `/flow`

**activeRule 配置**：
- UC 子应用：`/uc`
- Flow 子应用：`/flow`

### 双模式运行实现

**独立开发模式**：
- 子应用检测 `__POWERED_BY_QIANKUN__` 未定义
- 自行创建 React root 并渲染
- 使用独立的 router history

**qiankun 集成模式**：
- 子应用检测 `__POWERED_BY_QIANKUN__`` 为 true
- 等待 qiankun 调用 mount 函数
- 从 props 获取容器信息
- 使用 qiankun 提供的 router

## Testing Decisions

### 测试哲学

**外部行为 vs 实现细节**：
- **测试外部行为**：验证应用能够启动、子应用能够加载、路由能够切换
- **避免测试实现细节**：不测试具体的组件实现、内部状态、DOM 结构细节

### 主要测试边界

**边界 1 - 应用启动测试**：
- 验证 `pnpm --filter main-base dev` 能够启动主基座
- 验证 `pnpm --filter uc dev` 能够启动 UC 子应用
- 验证 `pnpm --filter flow dev` 能够启动 Flow 子应用
- 验证 `pnpm dev` 能够同时启动所有应用

**边界 2 - 微前端集成测试**：
- 验证访问 `localhost:8000` 能够看到主基座导航栏
- 验证点击导航能够切换到 UC 子应用（`/uc`）
- 验证 UC 子应用显示"用户中心"内容
- 验证点击导航能够切换到 Flow 子应用（`/flow`）
- 验证 Flow 子应用显示"工作流管理"内容

**边界 3 - 跨包引用测试**：
- 验证 UC 子应用能够 import Shared Common 的类型
- 验证 Flow 子应用能够 import Shared Common 的工具函数
- 验证 TypeScript 编译不会报错

**边界 4 - 构建测试**：
- 验证 `pnpm build` 能够成功构建所有应用
- 验证构建产物存在于各应用的 `dist/` 目录
- 验证构建产物包含必要的 JS 和 CSS 文件

### 测试工具与策略

**手动测试优先**：
- MVP 阶段以手动验证为主
- 开发者手动启动应用并验证功能
- 在浏览器中检查控制台无错误

**自动化测试（可选）**：
- 暂不配置单元测试框架
- 暂不配置 E2E 测试（如 Playwright/Cypress）
- 这些可以留给后续迭代

### 测试验收标准

**成功标准**：
1. 运行 `pnpm dev` 无错误
2. 浏览器访问 `localhost:8000` 显示导航栏
3. 点击导航能在 `/uc` 和 `/flow` 之间切换
4. 每个子应用显示对应的首页内容
5. 浏览器控制台无 qiankun 或 React 错误
6. 运行 `pnpm build` 成功构建所有应用

**失败标准**：
1. 任何应用启动失败
2. 子应用加载失败（白屏或 404）
3. 控制台出现 React 错误或 qiankun 错误
4. 路由切换异常（404 或导航失效）
5. TypeScript 编译错误
6. 构建失败或产物不完整

## Out of Scope

为了保持 MVP 范围可控，以下功能明确不在本次实现范围内：

### 功能范围
- ❌ 用户认证和授权功能
- ❌ 实际的业务逻辑（用户管理、工作流设计等）
- ❌ 后端 API 集成
- ❌ 复杂的状态管理（跨应用状态、全局状态）
- ❌ UI 组件库集成
- ❌ 表单验证和数据提交
- ❌ 文件上传/下载功能
- ❌ 实时通信（WebSocket、SSE）
- ❌ 国际化（i18n）
- ❌ 主题切换（亮色/暗色模式）
- ❌ 响应式设计优化

### 技术范围
- ❌ ESLint 配置和规则
- ❌ Git hooks（Husky、lint-staged）
- ❌ 单元测试框架和测试
- ❌ E2E 测试（Playwright、Cypress）
- ❌ 性能监控和错误追踪
- ❌ CI/CD 流水线配置
- ❌ Docker 容器化
- ❌ 生产环境部署配置
- ❌ 环境变量管理系统
- ❌ 高级构建优化（代码分割、懒加载）

### 架构范围
- ❌ 跨应用通信的实际数据传递（props 传递机制验证即可）
- ❌ 全局状态管理方案
- ❌ 共享组件库
- ❌ 微前端性能优化
- ❌ 子应用预加载策略
- ❌ 样式隔离的高级方案（Shadow DOM）
- ❌ 子应用版本管理和动态更新

## Further Notes

### 开发优先级

实现顺序建议：
1. **基础设施**：创建目录结构、配置 pnpm workspace、安装依赖
2. **Shared Common**：建立共享包，验证 monorepo 机制
3. **Main Base**：搭建主基座，验证 qiankun 集成
4. **UC 子应用**：实现第一个子应用，验证端到端流程
5. **Flow 子应用**：实现第二个子应用，验证多子应用场景
6. **优化调整**：样式、构建配置、开发体验优化

### 关键风险点

**qiankun 集成复杂度**：
- 生命周期管理可能出现内存泄漏
- 需要确保 mount/unmount 一一对应
- 需要处理子应用加载失败的错误边界

**开发环境配置**：
- CORS 配置可能需要调试
- 端口冲突需要处理
- 热更新（HMR）在微前端环境下可能不稳定

**TypeScript monorepo**：
- 类型引用可能需要仔细配置
- 项目引用（project references）需要验证
- 构建顺序可能影响类型检查

### 参考资源

- qiankun 官方文档：https://qiankun.umijs.org/
- vite-plugin-qiankun：https://github.com/janryWang/vite-plugin-qiankun
- Turborepo 文档：https://turbo.build/repo/docs
- pnpm workspace：https://pnpm.io/workspaces

### 后续扩展方向

MVP 完成后，可以考虑的扩展：
- 添加 ESLint 和更严格的代码质量检查
- 引入 UI 组件库（Ant Design、Material-UI 等）
- 实现实际的业务功能（用户管理、工作流设计等）
- 添加自动化测试
- 配置 CI/CD 流水线
- 优化生产构建和部署流程

---

**Status:** `ready-for-agent`
**Created:** 2026-08-28
**Context:** Platform Frontend MVP Framework Implementation
