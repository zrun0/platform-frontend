/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Injected at build time by vite.config.ts from root package.json
declare const __APP_VERSION__: string;

// Wujie globals (__POWERED_BY_WUJIE__, $wujie, __WUJIE_MOUNT/__WUJIE_UNMOUNT)
// are declared by @novon/core (src/wujie.ts) and loaded via its import.
