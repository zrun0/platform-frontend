// Wujie host/sub-app lifecycle contract shared by all sub-apps.
// Zero-dependency and React-free: apps pass their own mount/unmount.

export interface WujieAppLifecycle {
  mount: () => void;
  unmount: () => void;
}

declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean;
    // Event bus is banned by project constraint; props is the only channel
    $wujie?: { props: Record<string, unknown> };
    __WUJIE_MOUNT?: () => void;
    __WUJIE_UNMOUNT?: () => void;
  }
}

export function registerWujieApp(lifecycle: WujieAppLifecycle): void {
  if (window.__POWERED_BY_WUJIE__) {
    // Register lifecycles for the wujie host to invoke
    window.__WUJIE_MOUNT = lifecycle.mount;
    window.__WUJIE_UNMOUNT = lifecycle.unmount;
  } else {
    lifecycle.mount();
  }
}
