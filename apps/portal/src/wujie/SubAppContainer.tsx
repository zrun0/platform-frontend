import WujieReact from 'wujie-react';
import type { SubAppConfig } from './subApps';

// Renders a wujie sub-app. The sub-app owns an independent route space
// (iframe pathname starts at the entry url path); with sync on, its route
// changes are persisted to the main app url query (?name=/path) so that
// refresh / back / forward restore the sub-app route.
export default function SubAppContainer({ app }: { app: SubAppConfig }) {
  return (
    <WujieReact
      width="100%"
      height="100%"
      name={app.name}
      url={app.entry}
      props={app.props}
      sync
    />
  );
}
