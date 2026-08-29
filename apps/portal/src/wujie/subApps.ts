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

export const subApps: SubAppConfig[] = [
  {
    name: 'uc',
    label: 'UC',
    entry: '//localhost:8001',
    routePrefix: '/uc',
    props: { ...sharedProps },
  },
  {
    name: 'flow',
    label: 'Flow',
    entry: '//localhost:8002',
    routePrefix: '/flow',
    props: { ...sharedProps },
  },
];
