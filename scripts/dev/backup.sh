#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^(#|GOOGLECLOUD_CLIENT_PRIVATE_KEY|EDDSA_PRIVATE_KEY|NEXT_PUBLIC_EDDSA_PUBLIC_KEY)' ./.env | xargs) > /dev/null

DOCKER_COMPOSE_SERVICE_NAME="db"
DOCKER_CONTAINER_NAME="metiers_numeriques_db"

BACKUP_FILE_PATH="./.backups/$(date '+%Y-%m-%d').sql"

if [ ! -d ./.backups ]; then
  echo "info  - Creating ./.backups directory…"
  mkdir ./.backups
  echo "event - ./.backups directory created."
fi

if [ -f "${BACKUP_FILE_PATH}" ]; then
  echo "info  - Deleting ${BACKUP_FILE_PATH} file…"
  rm -f "${BACKUP_FILE_PATH}"
  echo "event - ${BACKUP_FILE_PATH} file deleted."
fi

echo "info  - Dumping database into ${BACKUP_FILE_PATH} file…"
docker exec -t "${DOCKER_CONTAINER_NAME}" pg_dumpall -c -U "${POSTGRE_USERNAME}" > "${BACKUP_FILE_PATH}"
echo "event - Database dumped into ${BACKUP_FILE_PATH} file."
