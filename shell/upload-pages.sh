#!/bin/bash

set -euo pipefail

staticDir="${STATIC_DIR:-build}"

if [ "${GENERATE_STATIC:-true}" != "false" ]; then
  BUILD_PATH="${staticDir}" yarn pages
fi

: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID is required}"
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"

pagesProjectName="${CLOUDFLARE_PAGES_PROJECT_NAME:-zrlog-editor}"
deployBranch="${CLOUDFLARE_PAGES_BRANCH:-${GITHUB_REF_NAME:-main}}"
wranglerPackage="${WRANGLER_PACKAGE:-wrangler@latest}"

if [ ! -d "${staticDir}" ]; then
  echo "static directory not found: ${staticDir}" >&2
  exit 1
fi

npx --yes "${wranglerPackage}" pages deploy "${staticDir}" \
  --project-name="${pagesProjectName}" \
  --branch="${deployBranch}"
