#!/bin/sh
set -e

# Check if the number of arguments passed is less than expected
if [ $# -lt 1 ]; then
   echo "Pass the container name."
   exit 1
fi

# Validate the application name
case $1 in
teddymart-prod | teddymart-staging | teddymart-dev) ;;
*)
   echo "Wrong container name"
   exit 1
   ;;
esac

APP_NAME=$1

echo "Deploying"

# (docker exec ${APP_NAME} php artisan down) || true
# docker exec ${APP_NAME} php artisan up

# Install dependencies based on lock file
docker exec ${APP_NAME} composer install --no-ansi --no-interaction --no-plugins --optimize-autoloader

docker exec ${APP_NAME} php artisan optimize:clear
docker exec ${APP_NAME} php artisan reverb:restart
docker exec ${APP_NAME} php artisan queue:restart

# Migrate database
docker exec ${APP_NAME} php artisan migrate --force

echo "Deployed"
