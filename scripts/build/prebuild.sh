#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^(#|GOOGLECLOUD_CLIENT_PRIVATE_KEY|EDDSA_PRIVATE_KEY|NEXT_PUBLIC_EDDSA_PUBLIC_KEY)' ./.env | xargs)

yarn prisma generate
yarn db:migrate
yarn db:seed
ts-node -r dotenv/config ./scripts/build/generateSitemap.ts
