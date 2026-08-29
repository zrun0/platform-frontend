# Platform Frontend - Development Workflow

## 推荐开发流程

### 1. 单应用开发

开发单个子应用时，使用专门的启动脚本：

```bash
# 开发 UC 子应用
pnpm dev:uc

# 开发 Flow 子应用
pnpm dev:flow

# 开发 Portal 主基座
pnpm dev:portal
```

**优势**:

- 启动速度快
- 只关注当前应用
- 热更新更及时

### 2. 全量集成测试与演示

开发完成后，使用全量启动验证集成：

```bash
# 启动所有应用（portal + uc + flow）
pnpm dev
```

启动成功后，三个 Vite dev server 正常运行：

```
• Running dev in 4 packages
portal:dev:      ➜  Local:   http://localhost:8000/
uc:dev:          ➜  Local:   http://localhost:8001/
flow:dev:        ➜  Local:   http://localhost:8002/
```

**验证步骤**:

1. **主基座**: 访问 http://localhost:8000，显示 "Platform Frontend" 导航和欢迎页
2. **UC 子应用**: 点击导航 "UC"
   - URL 变为 `/uc`（开启 `sync` 后子应用路由同步到 query，如 `/uc?uc=%2F`）
   - 显示 "用户中心 / User Center Sub-Application"，用户信息（Zustand 随机数据）可交互（"Update User" 按钮）
3. **Flow 子应用**: 点击导航 "Flow"
   - URL 变为 `/flow`，显示 "Hello from Flow"，"Update Workflow" 按钮可交互
4. **生命周期**: 在 UC / Flow 之间多次切换，页面正常挂载/卸载，控制台无报错、无重复挂载警告
5. **样式隔离**: DevTools 检查元素 —— UC 蓝色主题 (#1890ff) 与 Flow 绿色主题 (#52c41a) 互不影响，CSS Modules 类名形如 `App_title__xyz`

---

## 常见开发场景

### 场景 1: 修改子应用 UI

```bash
# 1. 启动对应子应用
pnpm dev:uc

# 2. 修改代码，自动热更新

# 3. 完成后进行集成测试
pnpm dev
```

### 场景 2: 修改主基座

```bash
# 1. 启动主基座
pnpm dev:portal

# 2. 修改代码

# 3. 启动子应用进行集成测试
# Terminal 1: pnpm dev:uc
# Terminal 2: pnpm dev:flow
# Terminal 3: pnpm dev:portal
```

### 场景 3: 添加新依赖

```bash
# 在对应应用目录下安装
cd apps/uc && pnpm add <package>

# 或在根目录安装到指定应用
pnpm --filter <app-name> add <package>
```

### 场景 4: TypeScript 类型检查

```bash
# 检查所有应用
pnpm typecheck

# 检查单个应用
pnpm --filter <app-name> typecheck
```

---

## 应用端口映射

| 应用   | 端口 | URL                   |
| ------ | ---- | --------------------- |
| Portal | 8000 | http://localhost:8000 |
| UC     | 8001 | http://localhost:8001 |
| Flow   | 8002 | http://localhost:8002 |

---

## 故障排查

### 问题 1: 子应用无法加载

**症状**: 访问 `/uc` 或 `/flow` 时显示空白或错误

**可能原因**:

1. 子应用未启动
2. 端口冲突
3. CORS 配置问题

**解决方案**:

```bash
# 1. 确认子应用已启动（在另一个终端运行）
pnpm dev:uc    # UC
pnpm dev:flow  # Flow

# 2. 检查端口占用
lsof -i :8001  # UC 端口
lsof -i :8002  # Flow 端口
```

3. 打开 DevTools Console，查找 CORS 相关错误或网络请求失败
4. 检查 `apps/uc/vite.config.ts` 与 `apps/flow/vite.config.ts` 的 CORS 配置（wujie 从主应用 origin fetch 子应用资源，CORS 必须）

### 问题 2: 样式不生效或样式污染

**症状**: 子应用样式显示不正确或互相影响

**可能原因**:

1. 未使用 CSS Modules
2. 全局样式冲突
3. 样式文件路径错误

**解决方案**:

1. 样式文件使用 `.module.css` 后缀（`App.module.css` 而不是 `App.css`）
2. 确认导入语法正确:

```tsx
import styles from './App.module.css';
```

3. 类名通过 `styles.className` 使用，而不是字符串:

```tsx
<div className={styles.container}>
```

4. DevTools 检查元素，确认 CSS Modules 生成的类名包含哈希值

### 问题 3: 生命周期错误

**症状**: 控制台显示 React root 泄漏或重复挂载警告

**可能原因**:

1. 未正确清理 React root
2. 生命周期函数实现错误

**解决方案**:

1. 检查子应用 `src/main.tsx` 的卸载逻辑正确销毁 React root:

```tsx
function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}
```

2. 确认生命周期注册走 `registerWujieApp`（来自 `@zrun/core`，wujie 模式注册钩子等待宿主调用，独立模式直接渲染）:

```tsx
import { registerWujieApp } from '@zrun/core';

registerWujieApp({ mount, unmount });
```

3. 检查控制台无 "React root" 相关警告

### 问题 4: TypeScript 编译错误

**症状**: `pnpm typecheck` 失败

**可能原因**:

1. 依赖未安装
2. 类型定义缺失
3. TypeScript 配置错误

**解决方案**:

```bash
# 1. 安装缺失的依赖
pnpm install

# 2. 检查单个应用定位问题
pnpm --filter <app-name> typecheck
```

3. 检查 `tsconfig.json` 的 `moduleResolution` 和 `target` 设置
4. 确认 `src/vite-env.d.ts` 存在且包含 CSS Modules 声明:

```ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

### 问题 5: wujie props 传递失败

**症状**: 子应用未收到来自主基座的 props

**可能原因**:

1. props 配置错误
2. 子应用未正确读取 props

**解决方案**:

1. 检查主基座 `apps/portal/src/wujie/subApps.ts`，确认子应用配置包含 props 字段:

```ts
{
  name: 'uc',
  entry: '//localhost:8001',
  routePrefix: '/uc',
  props: {
    fromPortal: true,
  },
}
```

2. 子应用通过 `window.$wujie` 读取（wujie 环境注入）:

```ts
const fromPortal = window.$wujie?.props?.fromPortal;
```

### 问题 6: 路由不工作

**症状**: 点击导航链接后 URL 不变化或页面不更新

**可能原因**:

1. React Router 配置错误
2. 路由前缀不匹配
3. 子应用误配了 `basename`（wujie 下子应用路由是独立路径空间，无需 basename）

**解决方案**:

1. 确认主基座使用 BrowserRouter 和正确的路由结构:

```tsx
<Routes>
  <Route path="/" element={<Welcome />} />
  <Route path="/uc/*" element={<SubAppContainer ... />} />
  <Route path="/flow/*" element={<SubAppContainer ... />} />
</Routes>
```

2. 确认 `subApps.ts` 的 `routePrefix` 与路由、导航链接一致（`/uc`、`/flow`）
3. 手动访问 http://localhost:8000/uc 确认子应用能加载
4. ⚠️ wujie 下子应用 BrowserRouter **不要配 basename** —— iframe pathname 从 entry 路径开始（不含 `/uc` 前缀），配了 basename 会渲染空白（详见 `CONTEXT.md` 术语表 "路由模型"）

---

## turbo.json 任务说明

> ADR-0002 Mitigation 的兑现方式：turbo.json 是纯 JSON（仓库锁定的 turbo ^1.11 不支持注释），
> 各任务的作用与缓存策略以本节 living doc 为准（正文快照另见 ADR-0002 Implementation Notes）。

| 任务 | 作用 | 缓存 | outputs | dependsOn |
| ---- | ---- | ---- | ------- | --------- |
| `dev` | 启动 Vite dev server（portal/uc/flow） | ❌ 不缓存（需要最新代码） | — | —；`persistent: true`（长驻任务，turbo 不等待其退出） |
| `build` | 生产构建（`tsc` 类型检查 + `vite build`） | ✅ 按内容指纹增量缓存 | `dist/**` | `^build`（先构建依赖包；`@zrun/core` 无 build，自动跳过） |
| `typecheck` | `tsc --noEmit` 纯类型检查 | ✅ | 无产物 | 无（core 为源码直消费，typecheck 不依赖任何 build） |
| `lint` | `prettier --check --ignore-path ../../.prettierignore .` | ✅ | 无产物 | 无 |

缓存说明：

- turbo 以任务定义 + 输入文件内容生成指纹，命中则跳过执行直接回放；改代码后自动失效
- `cache: false` 仅 `dev`；全量重跑用 `pnpm <task> --force`
- 缓存写入 `.turbo/`（已 gitignore），如遇诡异缓存态删除该目录即可

---

## 快捷命令参考

```bash
# 开发相关
pnpm dev              # 全量启动
pnpm dev:uc           # UC 子应用
pnpm dev:flow         # Flow 子应用
pnpm dev:portal       # Portal 主基座

# 构建相关
pnpm build            # 构建所有应用
pnpm --filter uc build  # 构建单个应用

# 类型检查
pnpm typecheck        # 检查所有应用
pnpm --filter uc typecheck  # 检查单个应用

# 代码检查
pnpm lint             # Prettier 格式检查（所有包）
pnpm --filter uc lint   # 单个包

# 依赖管理
pnpm install          # 安装所有依赖
pnpm --filter uc add <package>  # 为单个应用添加依赖
```
