import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

// Lifecycle hook: render the app
export async function mount(props?: any) {
  console.log('[Flow] Mounting with props:', props);

  const container = props?.container
    ? props.container.querySelector('#root')
    : document.querySelector('#root');

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

// Lifecycle hook: unmount the app
export async function unmount(props?: any) {
  console.log('[Flow] Unmounting');

  if (root) {
    root.unmount();
    root = null;
  }
}

// Bootstrap for qiankun
export async function bootstrap(props?: any) {
  console.log('[Flow] Bootstrap with props:', props);
}

// Direct run (standalone mode)
if (!(window as any).__POWERED_BY_QIANKUN__) {
  mount();
}
