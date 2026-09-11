#!/bin/bash

# Start PHP-FPM
php-fpm &

# Install composer dependencies
composer install --no-ansi --no-interaction --no-plugins --optimize-autoloader

# Set permissions
chown -R www-data:www-data .
chown -R www-data:www-data storage
chown -R www-data:www-data storage/framework/cache/data
chmod 755 -R storage bootstrap/cache storage/logs storage/framework/cache/data

# Start Redis
service redis-server start

# Start supervisor and scheduler
exec supervisord -c /etc/supervisord.conf

# Run artisan commands
php artisan migrate --force
php artisan optimize:clear
