# Task recipes; version source is root package.json (see docs/deployment.md)

default:
    @just --list

# Build all images: tag = version, git sha as OCI label
build:
    TAG=$(jq -r .version package.json) \
    docker compose build --build-arg GIT_SHA=$(git rev-parse --short HEAD)

# Deploy a version tag; rollback = pass an older tag. --no-build: a missing
# image fails loudly instead of silently rebuilding (wrong sha) without a registry
deploy tag:
    TAG={{ tag }} docker compose up -d --no-build

# Show OCI labels (git sha) of an image tag
inspect tag app="portal":
    docker inspect platform-{{ app }}:{{ tag }} | jq -c '.[0].Config.Labels'
