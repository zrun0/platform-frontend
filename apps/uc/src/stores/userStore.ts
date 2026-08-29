import { create } from 'zustand';
import type { User } from '@zrun/core';

// User store for UC sub-app
interface UserState {
  user: User;
  setUser: (name: string, role: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    name: 'UC User',
    role: 'Developer',
  },
  setUser: (name, role) => set({ user: { name, role } }),
}));
