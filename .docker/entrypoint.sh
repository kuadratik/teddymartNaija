#!/bin/bash

# Access env variable and default to 3000
PORT=${NEXTJS_PORT:-3000}

corepack enable
yarn set version 3.8.3

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
   echo "node_modules not found. Installing packages..."

   # Install packages
   yarn install
fi

# Check if .next directory exists
if [ ! -d ".next" ]; then
   echo ".next directory not found. Building the application..."

   # Build the dependencies
   npm run build
else
   echo ".next directory found. Skipping build..."
fi

# Start the Next.js application
npm run start -- -p $PORT
