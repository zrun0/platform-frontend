# State Management (Zustand)

> Living doc：Zustand 的现行使用规范，随代码演进保持更新。
> 为什么选 Zustand（决策与备选对比）见 [ADR-0004](./adr/0004-why-zustand-for-state-management.md)。

## 定位与约束

- Store 是**子应用内部**状态：每个 app 独立创建、独立实例，互不可见
- 跨应用数据传递不走 store，只走 wujie `props`（约束见 `CONTEXT.md` "Cross-Application Communication"）
- 微前端隔离模型下（wujie iframe + shadowDOM）子应用各自实例天然无全局污染，无需额外的实例清理逻辑

## Store 结构规范

每个 store 一个文件：`src/stores/<name>Store.ts`，遵循以下模式（以 UC 实际代码为例）：

```typescript
// apps/uc/src/stores/userStore.ts
import { create } from 'zustand';
import type { User } from '@zrun/core';

interface UserState {
  user: User;
  setUser: (name: string, role: string) => void;
}

// 具名导出（不要 default export）
export const useUserStore = create<UserState>((set) => ({
  user: { name: 'UC User', role: 'Developer' },
  setUser: (name, role) => set({ user: { name, role } }),
}));
```

要点：

- **`interface XxxState`** 先声明 state 字段 + actions，传入 `create<XxxState>` 获得完整类型推导
- **具名导出** `useXxxStore`（与现行代码一致；不要 `export default`）
- **同步 action** 直接 `set({ ... })`；异步 action 在函数体内 `await` 后再 `set`
- **共享类型**（如 `User`）从 `@zrun/core` import，不在 store 里重复定义
- 组件内用 selector 订阅，避免整 store 重渲染：`useUserStore((s) => s.user)`

## 现行 Stores

| 应用 | 文件                                    | 职责                                |
| ---- | --------------------------------------- | ----------------------------------- |
| UC   | `apps/uc/src/stores/userStore.ts`       | 当前用户信息                        |
| Flow | `apps/flow/src/stores/workflowStore.ts` | 当前工作流（name / status / steps） |

新增 store 时同步更新此表。

## 预留规范（当前代码未使用，启用前先读）

### 持久化（persist）

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create<UserState>()(
  persist((set) => ({/* state + actions */}), {
    name: 'uc-user-storage', // localStorage key，带 app 前缀避免冲突
    partialize: (state) => ({ user: state.user }), // 只持久化部分字段
  })
);
```

注意：wujie 下子应用 JS 运行在 iframe 中，localStorage 按 iframe origin（子应用端口）隔离——主应用与子应用的持久化数据天然不互通，跨应用持久化需另行设计。

### DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useUserStore = create<UserState>()(
  devtools((set) => ({/* state + actions */}), { name: 'UserStore' })
);
```
