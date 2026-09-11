FROM node:18-alpine AS base

RUN apk update && apk add --no-cache \
   libc6-compat \
   bash

# Env build argument with a default value
ARG NEXTJS_PORT=3000
ENV NEXTJS_PORT=${NEXTJS_PORT}

# Expose port and set working directory
EXPOSE $NEXTJS_PORT
WORKDIR /var/www

# Enable core and set yarn version
RUN corepack enable \
   && corepack prepare yarn@3.8.3 --activate

# Copy Config files
COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

