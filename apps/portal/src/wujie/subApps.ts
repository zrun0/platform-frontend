// Single source of truth for wujie sub-app registrations
export interface SubAppConfig {
  name: string;
  label: string;
  entry: string;
  routePrefix: string;
  props: Record<string, unknown>;
}

export const subApps: SubAppConfig[] = [
  {
    name: 'uc',
    label: 'UC',
    entry: '//localhost:8001',
    routePrefix: '/uc',
    props: {
      testProp: 'hello from main',
      fromPortal: true,
    },
  },
  {
    name: 'flow',
    label: 'Flow',
    entry: '//localhost:8002',
    routePrefix: '/flow',
    props: {
      testProp: 'hello from main',
      fromPortal: true,
    },
  },
];
