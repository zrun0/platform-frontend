/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Wujie globals (__POWERED_BY_WUJIE__, $wujie, __WUJIE_MOUNT/__WUJIE_UNMOUNT)
// are declared by @zrun/core (src/wujie.ts) and loaded via its import.
