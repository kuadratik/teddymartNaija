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

# install packages
docker exec ${APP_NAME} yarn install

# Run production build
docker exec ${APP_NAME} npm run build

docker restart ${APP_NAME}

echo "Deployed"
