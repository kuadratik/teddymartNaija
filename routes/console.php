<?php

use App\Console\Commands\CacheStores;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;

Schedule::command(CacheStores::class)->everyThreeMinutes();

Schedule::command('advert:check-expired-adverts')->everyFifteenMinutes();
Schedule::command('advert:check-expired-promotions')->everyFifteenMinutes();
Schedule::command('discounts:check-expired-listings')->everyMinute();
Schedule::command('discounts:check-expired-variants')->everyMinute();
Schedule::command('listings:notify-low-stock')->everyMinute();
Schedule::command('listings:notify-out-of-stock')->everyMinute();
Schedule::command('cart:send-abandoned-emails')->daily();
Schedule::command('orders:notify-shipped')->everyFourHours();
Schedule::command('orders:notify-vendors-delivery')->daily();
