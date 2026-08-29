import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerWujieApp } from '@zrun/core';
import App from './App';

let root: ReactDOM.Root | null = null;

// Wujie gives the sub-app an independent route space: the iframe pathname
// starts at the entry url path ("/"), so the router needs no basename
// whether embedded or standalone.
function mount() {
  // Under wujie the document is patched to the shadowDOM container
  const container = document.querySelector('#root');
  if (!container) {
    throw new Error('[UC] Root container not found');
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
