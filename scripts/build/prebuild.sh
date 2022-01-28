#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^(#|EDDSA_PRIVATE_KEY|NEXT_PUBLIC_EDDSA_PUBLIC_KEY)' ./.env | xargs)

yarn prisma generate
yarn db:migrate
yarn db:seed
yarn build:sitemap
