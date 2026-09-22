/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Injected at build time by vite.config.ts from root package.json
declare const __APP_VERSION__: string;
