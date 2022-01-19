#!/bin/bash

# Exit when any command fails:
set -e

yarn db:migrate
yarn db:seed
yarn build:sitemap
