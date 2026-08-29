/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Globals injected by the wujie host into the sub-app iframe
interface Window {
  __POWERED_BY_WUJIE__?: boolean;
  $wujie?: {
    props: Record<string, unknown>;
    bus: {
      $emit: (event: string, ...args: unknown[]) => void;
      $on: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  };
  __WUJIE_MOUNT?: () => void;
  __WUJIE_UNMOUNT?: () => void;
}
