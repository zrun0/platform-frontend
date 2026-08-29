import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerWujieApp } from '@zrun/core';
import App from './App';

let root: ReactDOM.Root | null = null;

function mount() {
  // Under wujie the document is patched to the shadowDOM container
  const container = document.querySelector('#root');
  if (!container) {
    throw new Error('[Flow] Root container not found');
  }

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

registerWujieApp({ mount, unmount });
