// Single source of truth for wujie sub-app registrations
export interface SubAppConfig {
  name: string;
  label: string;
  entry: string;
  routePrefix: string;
  props: Record<string, unknown>;
}

// Props every sub-app receives from the portal host
const sharedProps = { fromPortal: true };

// Runtime-injected entries (apps/portal/public/config.js in dev,
// envsubst-rendered /usr/share/nginx/html/config.js in prod)
const runtimeEntries =
  (window as { __APP_CONFIG__?: { subAppEntries?: Record<string, string> } })
    .__APP_CONFIG__?.subAppEntries ?? {};

// Trust boundary for runtime config: a malformed SUBAPP_*_URL must fail loud.
// wujie resolves anything else against the portal origin and mounts our own
// index.html as the sub-app - a silent blank pane.
function resolveEntry(name: string): string {
  const url = runtimeEntries[name];
  if (!url || !/^(https?:)?\/\//.test(url)) {
    throw new Error(
      `[subApps] invalid entry for "${name}": ${JSON.stringify(url)}` +
        ' (expected //host:port or http(s)://host:port; check config.js / SUBAPP_*_URL)'
    );
  }
  return url;
}

export const subApps: SubAppConfig[] = [
  {
    name: 'uc',
    label: 'UC',
    entry: resolveEntry('uc'),
    routePrefix: '/uc',
    props: { ...sharedProps },
  },
  {
    name: 'flow',
    label: 'Flow',
    entry: resolveEntry('flow'),
    routePrefix: '/flow',
    props: { ...sharedProps },
  },
];
