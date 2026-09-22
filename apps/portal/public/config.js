// Runtime config defaults for local dev; the portal image renders
// /usr/share/nginx/html/config.js from docker/config.js.template instead
// (envsubst over SUBAPP_UC_URL / SUBAPP_FLOW_URL)
window.__APP_CONFIG__ = {
  subAppEntries: {
    uc: '//localhost:8001',
    flow: '//localhost:8002',
  },
};
