<?php

use App\Console\Commands\CacheStores;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

Schedule::command(CacheStores::class)->everyTwoMinutes();

Schedule::command('advert:check-expired-adverts')->everyFifteenMinutes();
Schedule::command('advert:check-expired-promotions')->everyFifteenMinutes();

