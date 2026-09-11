#!/bin/bash

# Access env variable and default to 3000
PORT=${NEXTJS_PORT:-3000}

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
   # Install packages
   yarn install
fi

# Check if .next directory exists
if [ ! -d ".next" ]; then
   yarn run build
fi

# Start the Next.js application
npm run start -- -p $PORT
