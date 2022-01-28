#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^(#|EDDSA_PRIVATE_KEY|NEXT_PUBLIC_EDDSA_PUBLIC_KEY)' ./.env | xargs)

DOCKER_COMPOSE_SERVICE_NAME="db"
DOCKER_CONTAINER_NAME="metiers_numeriques_db"

LAST_BACKUP_FILE_NAME=$(ls -p ./.backups | grep -v / | sort -V | tail -n 1)
LAST_BACKUP_FILE_PATH="./.backups/${LAST_BACKUP_FILE_NAME}"

echo "info  - Stopping all Docker containers, removing all volumes…"
docker-compose down -v
echo "event - All Docker containers stopped, all volumes removed."

echo "info  - Starting ${DOCKER_COMPOSE_SERVICE_NAME} Docker container…"
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d "${DOCKER_COMPOSE_SERVICE_NAME}"
echo "event - ${DOCKER_COMPOSE_SERVICE_NAME} Docker container started."

echo "info  - Waiting for database to be ready…"
# https://stackoverflow.com/a/63011266/2736233
timeout 90s bash -c "until docker exec ${DOCKER_CONTAINER_NAME} pg_isready ; do sleep 1 ; done"
echo "event - Database ready."

echo "info  - Restoring ${LAST_BACKUP_FILE_PATH}…"
cat "${LAST_BACKUP_FILE_PATH}" \
  | docker exec -i "${DOCKER_CONTAINER_NAME}" psql -d "${POSTGRE_DATABASE}" -q -U "${POSTGRE_USERNAME}"
echo "event - ${LAST_BACKUP_FILE_PATH} restored."
