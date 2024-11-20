FROM php:8.2-fpm

# Env build argument with a default value
ARG PHP_FPM_PORT=9000
ARG REVERRB_PORT=8080

COPY .docker/php.ini /usr/local/etc/php/
COPY .docker/docker.conf /usr/local/etc/php-fpm.d/docker.conf

# mix
RUN apt-get update \
   && apt-get install -y build-essential zlib1g-dev default-mysql-client curl gnupg procps nano git unzip libzip-dev libpq-dev \
   && docker-php-ext-install zip pdo_mysql pdo_pgsql pgsql bcmath sockets pcntl

# Install intl
RUN apt-get install -y libicu-dev \
   && docker-php-ext-configure intl \
   && docker-php-ext-install intl

# Install gd
RUN apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev && \
   docker-php-ext-configure gd --with-freetype --with-webp --with-jpeg && \
   docker-php-ext-install gd

# Install supervisor
RUN apt-get install -y supervisor

# Install redis
RUN pecl install redis && docker-php-ext-enable redis

RUN apt-get install -y redis-server redis-tools

# Install pcov
RUN pecl install pcov && docker-php-ext-enable pcov

# Install swoole
RUN pecl install swoole && docker-php-ext-enable swoole

# Install FFmpeg
RUN apt-get install -y ffmpeg

# Install dependencies for the uv extension
RUN apt-get install -y libuv1-dev 

# Install PECL extension for uv
RUN pecl install channel://pecl.php.net/uv-0.3.0 && \
   docker-php-ext-enable uv

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN composer config --global process-timeout 3600

# Install nodejs
RUN apt-get install -y ca-certificates gnupg && \
   mkdir -p /etc/apt/keyrings && \
   curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
ENV NODE_MAJOR 20
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
   apt update && \
   apt install -y nodejs

WORKDIR /root
RUN git clone https://github.com/seebi/dircolors-solarized

# Change default FPM Port
RUN sed -i "s/9000/${PHP_FPM_PORT}/" /usr/local/etc/php-fpm.d/zz-docker.conf

# Change default FPM PM settings
RUN echo 'pm.max_children = 50' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
   echo 'pm.max_requests = 500' >> /usr/local/etc/php-fpm.d/zz-docker.conf

# Expose PHP-fpm and Swoole port
EXPOSE $PHP_FPM_PORT
EXPOSE $REVERRB_PORT

WORKDIR /var/www
COPY .docker/supervisord.conf /etc/supervisord.conf

COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]