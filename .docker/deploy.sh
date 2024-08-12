#!/bin/sh
set -e

# Check if the number of arguments passed is less than expected
if [ $# -lt 1 ]; then
   echo "Pass the container name."
   exit 1
fi

# Validate the application name
case $1 in
prod-app | staging-app) ;;
*)
   echo "Wrong container name"
   exit 1
   ;;
esac

APP_NAME=$1

echo "Deploying"

# Enter maintenance mode
(docker exec ${APP_NAME} php artisan down) || true

# Install dependencies based on lock file
docker exec ${APP_NAME} composer install --no-ansi --no-dev --no-interaction --no-plugins --no-scripts --optimize-autoloader

docker exec ${APP_NAME} php artisan optimize:clear
docker exec ${APP_NAME} php artisan queue:restart
docker exec ${APP_NAME} php artisan swoole:http reload

# Migrate database
docker exec ${APP_NAME} php artisan migrate --force

# Seed necessary seeder
docker exec ${APP_NAME} php artisan db:seed --class=FormElementSeeder

# Exit maintenance mode
docker exec ${APP_NAME} php artisan up

echo "Deployed"
