# 0004 - Why Zustand for State Management

## Status
**Accepted**

## Context
子应用（UC、Flow）需要管理内部状态，如用户信息、表单数据、UI 状态等。需要选择一个状态管理方案，平衡：
- 开发体验（API 简洁、TypeScript 支持）
- 包大小（微前端环境，bundle size 敏感）
- 学习成本（团队快速上手）
- 与 qiankun 的兼容性

## Decision
选择 **Zustand** 作为子应用状态管理方案。

### Why Zustand?
1. **极简 API**：`create` + `use`，无需 Provider、Actions、Dispatchers
2. **轻量级**：~1KB gzipped，对 bundle 影响极小
3. **TypeScript 友好**：自动类型推导，无需手动定义类型
4. **无 Boilerplate**：相比 Redux Toolkit，减少 70% 样板代码
5. **DevTools 支持**：可选集成 Redux DevTools
6. **qiankun 兼容**：无全局依赖，子应用独立实例

### 基本用法
```typescript
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))

// 组件中使用
function UserProfile() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  return <div>{user?.name}</div>
}
```

### Alternatives Considered

#### React Context
- ✅ 优势：React 原生，无额外依赖
- ✅ 优势：简单场景足够
- ❌ 劣势：性能问题（Context 更新会导致所有消费者重渲染）
- ❌ 劣势：无 DevTools，调试困难
- ❌ 劣势：复杂状态需要多层嵌套

#### Redux Toolkit
- ✅ 优势：生态成熟，中间件丰富
- ✅ 优势：时间旅行调试，适合复杂业务逻辑
- ❌ 劣势：包体积大（~10KB+），对微前端不友好
- ❌ 劣势：Boilerplate 多（actions、reducers、selectors）
- ❌ 劣势：学习曲线陡峭

#### Jotai / Recoil
- ✅ 优势：原子化状态，细粒度更新
- ✅ 优势：React 18 Concurrent Mode 友好
- ❌ 劣势：心智模型新（原子化 vs 全局 store）
- ❌ 劣势：生态不如 Zustand 成熟
- ❌ 劣势：对微前端场景，全局 store 更直观

#### 无状态管理（只用 React state）
- ✅ 优势：最简单，无依赖
- ✅ 优势：适合 MVP
- ❌ 劣势：跨组件通信困难（prop drilling）
- ❌ 劣势：无持久化、无中间件
- ❌ 劣势：不适合复杂业务逻辑

## Consequences

### Positive
- ✅ API 简洁（5 行代码创建 store）
- ✅ TypeScript 自动推导（无手动定义类型）
- ✅ 包体积小（~1KB，对子应用加载无影响）
- ✅ 学习成本低（相比 Redux 减少 80% 概念）
- ✅ DevTools 支持（可选）
- ✅ qiankun 兼容（子应用独立实例，无全局污染）

### Negative
- ❌ 生态不如 Redux（中间件少，但够用）
- ❌ 复杂异步逻辑需手动处理（可用 middleware 或自定义逻辑）
- ❌ 团队需学习新 API（但成本极低）

### Mitigation
- 🛠️ 统一的 store 结构规范（文档 + 示例）
- 🛠️ 封装常用模式（如异步 action、持久化）
- 🛠️ DevTools 集成指南（推荐开发时启用）

## Implementation Notes

### Store 结构规范
```typescript
// stores/userStore.ts
interface UserStore {
  // State
  user: User | null
  isAuthenticated: boolean

  // Actions
  setUser: (user: User) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,

  // Synchronous actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Asynchronous actions
  fetchUser: async () => {
    const user = await api.getUser()
    set({ user, isAuthenticated: true })
  },
}))

export default useUserStore
```

### 持久化（可选）
```typescript
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',  // localStorage key
      // 只持久化部分字段
      partialize: (state) => ({ user: state.user }),
    }
  )
)
```

### DevTools 集成
```typescript
import { devtools } from 'zustand/middleware'

const useUserStore = create(
  devtools<UserStore>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'UserStore' }  // DevTools 中显示的名称
  )
)
```

### qiankun 兼容性
```typescript
// 子应用 mount 时创建独立 store 实例
let userStore: UserStore | null = null

export async function mount(props: any) {
  // 每次子应用挂载创建新 store，避免状态污染
  userStore = createUserStore()
  // ...
}

export async function unmount() {
  // 卸载时清理 store
  userStore = null
}
```

## Usage in Sub-Applications

### UC 子应用
```typescript
// apps/uc/src/stores/userStore.ts
import { create } from 'zustand'

interface UserStore {
  currentUser: User | null
  permissions: string[]
  setUser: (user: User) => void
  setPermissions: (perms: string[]) => void
}

const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  permissions: [],
  setUser: (user) => set({ currentUser: user }),
  setPermissions: (perms) => set({ permissions: perms }),
}))

export default useUserStore
```

### Flow 子应用
```typescript
// apps/flow/src/stores/workflowStore.ts
import { create } from 'zustand'

interface WorkflowStore {
  currentWorkflow: Workflow | null
  workflows: Workflow[]
  setCurrentWorkflow: (wf: Workflow) => void
  addWorkflow: (wf: Workflow) => void
}

const useWorkflowStore = create<WorkflowStore>((set) => ({
  currentWorkflow: null,
  workflows: [],
  setCurrentWorkflow: (wf) => set({ currentWorkflow: wf }),
  addWorkflow: (wf) => set((state) => ({
    workflows: [...state.workflows, wf]
  })),
}))

export default useWorkflowStore
```

## Related Decisions
- [0001 - Why qiankun for Micro-Frontend Architecture](./0001-why-qiankun-for-micro-frontend.md)
- [0003 - Why shared-common Source Consumption](./0003-shared-common-source-consumption.md)
