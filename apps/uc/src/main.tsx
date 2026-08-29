import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

// Wujie gives the sub-app an independent route space: the iframe pathname
// starts at the entry url path ("/"), so the router needs no basename
// whether embedded or standalone.
function render() {
  console.log('[UC] Mounting');
  if (window.__POWERED_BY_WUJIE__) {
    console.log('[UC] Props from main:', window.$wujie?.props);
  }

  // Under wujie the document is patched to the shadowDOM container
  const container = document.querySelector('#root');
  if (!container) {
    console.error('[UC] Root container not found');
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
  console.log('[UC] Unmounting');

  if (root) {
    root.unmount();
    root = null;
  }
}

if (window.__POWERED_BY_WUJIE__) {
  // Register lifecycles for the wujie host
  window.__WUJIE_MOUNT = render;
  window.__WUJIE_UNMOUNT = destroy;
  console.log('[UC] Running in wujie mode, waiting for lifecycle hooks');
} else {
  console.log('[UC] Running in standalone mode');
  render();
}
