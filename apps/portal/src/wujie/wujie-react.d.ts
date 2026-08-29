// Precise type declarations for wujie-react.
// The shipped index.d.ts lacks the PureComponent generic (props typed as {}),
// so this module is used instead via tsconfig "paths". Runtime still resolves
// to the real package; only type checking is redirected here.
import type { Component, CSSProperties } from 'react';
import type { bus, preloadApp, destroyApp, setupApp, refreshApp } from 'wujie';

type LifecycleHook = (appWindow: Window) => unknown;

export interface WujieReactProps {
  /** Container width, applied to the wrapper div */
  width?: string;
  /** Container height, applied to the wrapper div */
  height?: string;
  /** Extra styles applied to the wrapper div */
  style?: CSSProperties;
  /** Unique sub-app name (required) */
  name: string;
  /** Sub-app entry url (required) */
  url: string;
  /** Loading element shown while the sub-app loads */
  loading?: HTMLElement;
  /** Keep-alive mode: sub-app state survives unmount */
  alive?: boolean;
  /** Custom fetch for loading sub-app resources */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** Props injected into the sub-app (window.$wujie.props) */
  props?: Record<string, unknown>;
  /** Custom iframe attributes */
  attrs?: Record<string, unknown>;
  /** Degrade-mode iframe attributes */
  degradeAttrs?: Record<string, unknown>;
  /** Code replace hook */
  replace?: (code: string) => string;
  /** Sync sub-app route changes to the main app url */
  sync?: boolean;
  /** Short-path replacements used when sync is on */
  prefix?: Record<string, string>;
  /** Fiber mode for sub-app execution */
  fiber?: boolean;
  /** Degrade to plain iframe rendering */
  degrade?: boolean;
  /** Sub-app plugins */
  plugins?: unknown[];
  /** Window events forwarded to the sub-app iframe */
  iframeAddEventListeners?: string[];
  /** iframe 'on' events forwarded to the sub-app */
  iframeOnEvents?: string[];
  beforeLoad?: LifecycleHook;
  beforeMount?: LifecycleHook;
  afterMount?: LifecycleHook;
  beforeUnmount?: LifecycleHook;
  afterUnmount?: LifecycleHook;
  loadError?: (url: string, e: Error) => unknown;
}

declare class WujieReact extends Component<WujieReactProps> {
  static bus: typeof bus;
  static preloadApp: typeof preloadApp;
  static destroyApp: typeof destroyApp;
  static setupApp: typeof setupApp;
  static refreshApp: typeof refreshApp;
}

export default WujieReact;
