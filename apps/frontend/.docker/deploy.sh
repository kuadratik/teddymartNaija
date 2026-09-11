#!/bin/sh
set -e

# Check if the number of arguments passed is less than expected
if [ $# -lt 1 ]; then
   echo "Pass the container name."
   exit 1
fi

# Validate the application name
case $1 in
martfront-staging | martfront-prod) ;;
*)
   echo "Wrong container name"
   exit 1
   ;;
esac

APP_NAME=$1

echo "Deploying"

# Create a temporary build directory and run npm install and build there
docker exec ${APP_NAME} sh -c "mkdir -p /var/build && cp -r /var/www/. /var/build"
docker exec ${APP_NAME} sh -c "cd /var/build && npm install"
docker exec ${APP_NAME} sh -c "cd /var/build && npm run build"

# Copy the .next folder to the working directory after the build
docker exec ${APP_NAME} sh -c "cp -r /var/build/.next /var/www/"

# Clean up the temporary build directory
docker exec ${APP_NAME} sh -c "rm -rf /var/build"

# Restart the container
docker restart ${APP_NAME}

echo "Deployed"
