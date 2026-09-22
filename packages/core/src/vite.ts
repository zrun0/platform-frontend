// Build-time helper: shared Vite config factory for all workspace apps.
// Consumed only from vite.config.ts files, never from browser bundles.

import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

export function createAppViteConfig(opts: { port: number; subApp?: boolean }): UserConfig {
  // Single version source: root package.json (lockstep across all apps).
  // Read lazily so importing this module stays side-effect free.
  const { version } = JSON.parse(
    readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'),
  );

  return {
    plugins: [react()],
    define: { __APP_VERSION__: JSON.stringify(version) },
    server: {
      port: opts.port,
      cors: true,
      ...(opts.subApp
        ? {
            // wujie fetches sub-app resources from the host origin,
            // CORS is required for the portal to load them
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          }
        : {}),
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
    },
  };
}
