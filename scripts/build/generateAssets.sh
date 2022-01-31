#!/bin/bash

# Exit when any command fails:
set -e

echo "info  - Generating @gouvfr/dsfr CSS file…"
rm -f ./public/dsfr.min.css
cp ./node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css ./public/dsfr.min.css
sed -i 's/..\/fonts/\/fonts/g' ./public/dsfr.min.css
echo "event - @gouvfr/dsfr CSS file generated."

echo "info  - Generating @gouvfr/dsfr font files…"
rm -Rf ./public/fonts
cp -r ./node_modules/@gouvfr/dsfr/dist/fonts ./public/fonts
echo "event - @gouvfr/dsfr font files generated."
