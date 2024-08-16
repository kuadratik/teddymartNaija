#!/bin/bash

# Start PHP-FPM
php-fpm &

# Install composer dependencies
composer install --no-ansi --no-dev --no-interaction --no-plugins --no-scripts --optimize-autoloader

# Set permissions
chown -R www-data:www-data .
chown -R www-data:www-data storage
chmod 755 -R storage bootstrap/cache storage/logs

# Start Redis
service redis-server start

# Start supervisor and scheduler
exec supervisord -c /etc/supervisord.conf

# Run artisan commands
php artisan migrate --force
php artisan optimize:clear
