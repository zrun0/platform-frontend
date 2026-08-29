import { create } from 'zustand';

// Workflow store for Flow sub-app
interface WorkflowState {
  workflow: {
    name: string;
    status: string;
    steps: number;
  };
  updateWorkflow: (name: string, status: string, steps: number) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflow: {
    name: 'Sample Workflow',
    status: 'Active',
    steps: 3,
  },
  updateWorkflow: (name, status, steps) =>
    set({ workflow: { name, status, steps } }),
}));
