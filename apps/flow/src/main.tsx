import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

function render() {
  console.log('[Flow] Mounting');
  if (window.__POWERED_BY_WUJIE__) {
    console.log('[Flow] Props from main:', window.$wujie?.props);
  }

  // Under wujie the document is patched to the shadowDOM container
  const container = document.querySelector('#root');
  if (!container) {
    console.error('[Flow] Root container not found');
    return;
  }

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function destroy() {
  console.log('[Flow] Unmounting');

  if (root) {
    root.unmount();
    root = null;
  }
}

if (window.__POWERED_BY_WUJIE__) {
  // Register lifecycles for the wujie host
  window.__WUJIE_MOUNT = render;
  window.__WUJIE_UNMOUNT = destroy;
  console.log('[Flow] Running in wujie mode, waiting for lifecycle hooks');
} else {
  console.log('[Flow] Running in standalone mode');
  render();
}
