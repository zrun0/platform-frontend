import { registerMicroApps, start } from 'qiankun';

// Sub-app configurations
const microApps = [
  {
    name: 'uc',
    entry: '//localhost:8001',
    container: '#subapp-container',
    activeRule: '/uc',
    props: {
      testProp: 'hello from main',
      mainBase: true,
    },
  },
  {
    name: 'flow',
    entry: '//localhost:8002',
    container: '#subapp-container',
    activeRule: '/flow',
    props: {
      testProp: 'hello from main',
      mainBase: true,
    },
  },
];

// Register sub-apps
export function registerSubApps() {
  registerMicroApps(microApps, {
    beforeLoad: async (app) => {
      console.log('[Main Base] Loading app:', app.name);
    },
    beforeMount: async (app) => {
      console.log('[Main Base] Mounting app:', app.name);
    },
    afterMount: async (app) => {
      console.log('[Main Base] Mounted app:', app.name);
    },
    beforeUnmount: async (app) => {
      console.log('[Main Base] Unmounting app:', app.name);
    },
    afterUnmount: async (app) => {
      console.log('[Main Base] Unmounted app:', app.name);
    },
  });

  // Start qiankun
  start({
    sandbox: {
      strictStyleIsolation: false,
      experimentalStyleIsolation: false,
    },
  });
}
