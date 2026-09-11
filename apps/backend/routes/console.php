<?php

use App\Console\Commands\CacheStores;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;

Schedule::command(CacheStores::class)->everyThreeMinutes();

Schedule::command('advert:check-expired-adverts')->everyFifteenMinutes();
Schedule::command('advert:check-expired-promotions')->everyFifteenMinutes();
Schedule::command('discounts:check-expired-listings')->everyMinute();
Schedule::command('discounts:check-expired-variants')->everyMinute();
Schedule::command('listings:notify-low-stock')->daily();
Schedule::command('listings:notify-out-of-stock')->daily();
Schedule::command('cart:send-abandoned-emails')->daily();
Schedule::command('orders:notify-shipped')->everyTwoMinutes();
Schedule::command('orders:notify-vendors-delivery')->daily();
Schedule::command('orders:send-vendor-reminders')->daily();
Schedule::command('vendor:send-reminder-emails')->twiceDaily();

if (App::environment(['local', 'staging'])) {
    Schedule::command('telescope:prune --hours=48')->daily();
}
