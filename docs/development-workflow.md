# Platform Frontend - Development Workflow

## 推荐开发流程

### 1. 单应用开发
开发单个子应用时，使用专门的启动脚本：

```bash
# 开发 UC 子应用
pnpm dev:uc

# 开发 Flow 子应用  
pnpm dev:flow

# 开发 Main Base 主基座
pnpm dev:base
```

**优势**:
- 启动速度快
- 只关注当前应用
- 热更新更及时

### 2. 全量集成测试
开发完成后，使用全量启动验证集成：

```bash
# 启动所有应用（main-base + uc + flow）
pnpm dev
```

**验证步骤**:
1. 访问 http://localhost:8000 (Main Base)
2. 点击导航链接测试子应用加载
3. 检查浏览器控制台是否有错误
4. 验证路由切换和生命周期

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
pnpm dev:base

# 2. 修改代码

# 3. 启动子应用进行集成测试
# Terminal 1: pnpm dev:uc
# Terminal 2: pnpm dev:flow
# Terminal 3: pnpm dev:base
```

### 场景 3: 添加新依赖
```bash
# 在对应应用目录下安装
pnpm --filter <app-name> add <package>

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

| 应用 | 端口 | URL |
|------|------|-----|
| Main Base | 8000 | http://localhost:8000 |
| UC | 8001 | http://localhost:8001 |
| Flow | 8002 | http://localhost:8002 |

---

## 故障排查

### 子应用无法加载
**可能原因**:
1. 子应用未启动
2. CORS 配置问题
3. 端口冲突

**解决方案**:
```bash
# 1. 确认子应用已启动
pnpm dev:uc

# 2. 检查端口是否占用
lsof -i :8001

# 3. 检查浏览器控制台错误
```

### 样式污染问题
**可能原因**:
- 未使用 CSS Modules
- 全局样式冲突

**解决方案**:
- 所有样式文件使用 `.module.css` 后缀
- 避免使用全局样式

### 生命周期错误
**可能原因**:
- React root 未正确卸载
- Zustand store 未清理

**解决方案**:
- 检查 `unmount` 函数实现
- 确认 store 清理逻辑

---

## 快捷命令参考

```bash
# 开发相关
pnpm dev              # 全量启动
pnpm dev:uc           # UC 子应用
pnpm dev:flow         # Flow 子应用
pnpm dev:base         # Main Base 主基座

# 构建相关
pnpm build            # 构建所有应用
pnpm --filter uc build  # 构建单个应用

# 类型检查
pnpm typecheck        # 检查所有应用
pnpm --filter uc typecheck  # 检查单个应用

# 依赖管理
pnpm install          # 安装所有依赖
pnpm --filter uc add <package>  # 为单个应用添加依赖
```
