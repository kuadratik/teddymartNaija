<?php

use App\Console\Commands\CacheStores;
use Illuminate\Support\Facades\Schedule;

Schedule::command(CacheStores::class)->everyThreeMinutes();

Schedule::command('advert:check-expired-adverts')->everyFifteenMinutes();
Schedule::command('advert:check-expired-promotions')->everyFifteenMinutes();
Schedule::command('discounts:check-expired')->everyMinute();
