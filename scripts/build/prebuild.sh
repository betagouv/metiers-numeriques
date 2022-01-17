#!/bin/bash

# Exit when any command fails:
set -e

# Skip all postbuild steps if within Github Actions
if [ -z "${GITHUB_WORKFLOW}" ]; then
  yarn db:migrate
  yarn data:import
  # yarn cache:purge
  # yarn cache:update
  yarn build:sitemap
fi
