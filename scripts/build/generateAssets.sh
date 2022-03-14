#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^(#|GOOGLECLOUD_CLIENT_PRIVATE_KEY|EDDSA_PRIVATE_KEY|NEXT_PUBLIC_EDDSA_PUBLIC_KEY)' ./.env | xargs)

echo "info  - Generating @gouvfr/dsfr CSS file…"
rm -f ./public/dsfr.min.css
cp ./node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css ./public/dsfr.min.css
if [[ "$OSTYPE" == "darwin"* ]]; then
  gsed -i 's/..\/fonts/\/fonts/g' ./public/dsfr.min.css
else
  sed -i 's/..\/fonts/\/fonts/g' ./public/dsfr.min.css
fi

if [ "${NODE_ENV}" != 'production' ] || [ -n "${CI}" ]; then
  rm -f ./public/dsfr.css
  cp ./node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.css ./public/dsfr.css
  if [[ "$OSTYPE" == "darwin"* ]]; then
    gsed -i 's/..\/fonts/\/fonts/g' ./public/dsfr.css
  else
    sed -i 's/..\/fonts/\/fonts/g' ./public/dsfr.css
  fi
fi
echo "event - @gouvfr/dsfr CSS file generated."

echo "info  - Generating @gouvfr/dsfr font files…"
rm -Rf ./public/fonts
cp -r ./node_modules/@gouvfr/dsfr/dist/fonts ./public/fonts
echo "event - @gouvfr/dsfr font files generated."
