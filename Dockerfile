# syntax=docker/dockerfile:1
# Build any workspace app: docker build --target=portal|uc|flow .
FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable

# Manifests first so `pnpm install` layer caches independently of source changes
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/portal/package.json apps/portal/
COPY apps/uc/package.json apps/uc/
COPY apps/flow/package.json apps/flow/
COPY packages/core/package.json packages/core/
RUN pnpm install --frozen-lockfile

COPY . .
ENV TURBO_TELEMETRY_DISABLED=1
# All three apps build once in this shared stage; the per-app targets below
# only copy dist, so `docker compose up --build` never pays three cold builds
RUN --mount=type=cache,target=/repo/node_modules/.cache/turbo \
  pnpm turbo run build --filter=portal... --filter=uc... --filter=flow... --no-daemon

FROM nginx:1.27-alpine AS web
# Exact source commit; pass --build-arg GIT_SHA=$(git rev-parse --short HEAD)
ARG GIT_SHA=unknown
LABEL org.opencontainers.image.revision=${GIT_SHA}
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

FROM web AS portal
COPY --from=build /repo/apps/portal/dist /usr/share/nginx/html
# Sub-app entry config is rendered at startup by the nginx base image's
# envsubst-on-templates mechanism (only defined env vars are substituted)
COPY docker/config.js.template /etc/nginx/templates/config.js.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html
# Drop the dev config.js vite copied in: if the entrypoint is ever bypassed,
# serve no config rather than silent //localhost dev defaults
RUN rm -f /usr/share/nginx/html/config.js

FROM web AS uc
COPY --from=build /repo/apps/uc/dist /usr/share/nginx/html

FROM web AS flow
COPY --from=build /repo/apps/flow/dist /usr/share/nginx/html
