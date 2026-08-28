import React from 'react';
import { useWorkflowStore } from './stores/workflowStore';
import styles from './App.module.css';

// App component for Flow sub-app
export default function App() {
  const { workflow, updateWorkflow } = useWorkflowStore();

  const handleUpdateWorkflow = () => {
    const newNames = ['Workflow A', 'Workflow B', 'Workflow C'];
    const newStatuses = ['Active', 'Pending', 'Completed'];
    const newSteps = Math.floor(Math.random() * 10) + 1;
    const randomName = newNames[Math.floor(Math.random() * newNames.length)];
    const randomStatus = newStatuses[Math.floor(Math.random() * newStatuses.length)];
    updateWorkflow(randomName, randomStatus, newSteps);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello from Flow</h1>
      <p className={styles.subtitle}>Workflow Management Sub-Application</p>

      <div className={styles.info}>
        <p><strong>Workflow:</strong> {workflow.name}</p>
        <p><strong>Status:</strong> {workflow.status}</p>
        <p><strong>Steps:</strong> {workflow.steps}</p>
      </div>

      <button className={styles.button} onClick={handleUpdateWorkflow}>
        Update Workflow
      </button>
    </div>
  );
}
