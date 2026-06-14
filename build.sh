#!/usr/bin/env bash
set -euo pipefail

HUGO_VERSION="${HUGO_VERSION:-0.163.0}"
BUILD_TEMP_DIR=""

cleanup() {
  if [[ -n "${BUILD_TEMP_DIR}" && -d "${BUILD_TEMP_DIR}" ]]; then
    rm -rf "${BUILD_TEMP_DIR}"
  fi
}

trap cleanup EXIT SIGINT SIGTERM

ensure_hugo() {
  if [[ -z "${VERCEL:-}" ]] && command -v hugo >/dev/null 2>&1; then
    echo "Using Hugo: $(hugo version)"
    return
  fi

  BUILD_TEMP_DIR="$(mktemp -d)"
  pushd "${BUILD_TEMP_DIR}" >/dev/null

  echo "Installing Hugo ${HUGO_VERSION}..."
  curl -sLJO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-amd64.tar.gz"
  mkdir -p "${HOME}/.local/hugo"
  tar -C "${HOME}/.local/hugo" -xf "hugo_${HUGO_VERSION}_linux-amd64.tar.gz"
  export PATH="${HOME}/.local/hugo:${PATH}"

  popd >/dev/null
  echo "Using Hugo: $(hugo version)"
}

main() {
  ensure_hugo

  local site_dir
  site_dir="$(mktemp -d)"
  local cache_dir
  cache_dir="$(mktemp -d)"

  tar \
    --exclude public \
    --exclude resources \
    --exclude .hugo_build.lock \
    -cf - -C exampleSite . | tar -C "${site_dir}" -xf -

  mkdir -p "${site_dir}/themes/linewise"
  tar \
    --exclude .git \
    --exclude .pnpm-store \
    --exclude node_modules \
    --exclude public \
    --exclude exampleSite/public \
    --exclude exampleSite/resources \
    --exclude resources \
    --exclude playwright-report \
    --exclude test-results \
    -cf - . | tar -C "${site_dir}/themes/linewise" -xf -

  tar -cf - layouts assets static archetypes | tar -C "${site_dir}" -xf -

  local base_url=/
  if [[ -n "${VERCEL_PROJECT_PRODUCTION_URL:-}" ]]; then
    base_url="https://${VERCEL_PROJECT_PRODUCTION_URL}"
  fi

  rm -rf exampleSite/public

  hugo --source "${site_dir}" \
    --cacheDir "${cache_dir}" \
    --gc \
    --minify \
    --baseURL "${base_url}"

  mkdir -p exampleSite
  cp -R "${site_dir}/public" exampleSite/public
}

main "$@"
