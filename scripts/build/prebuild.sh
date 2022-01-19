#!/bin/bash

# Exit when any command fails:
set -e

yarn db:migrate

# Skip data import if within Github Actions
if [ -z "${GITHUB_WORKFLOW}" ]; then
  yarn data:import
fi

yarn db:seed
yarn build:sitemap
