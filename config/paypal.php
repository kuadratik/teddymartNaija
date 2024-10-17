<?php

return [
    'mode' => env('PAYPAL_MODE', 'sandbox'),

    'sandbox' => [
        'client_id' => env('PAYPAL_SANDBOX_CLIENT_ID'),
        'client_secret' => env('PAYPAL_SANDBOX_SECRET'),
        'app_id' => 'APP-80W284485P519543T',
    ],

    'live' => [
        'client_id' => env('PAYPAL_LIVE_CLIENT_ID'),
        'client_secret' => env('PAYPAL_LIVE_SECRET'),
        'app_id' => env('PAYPAL_LIVE_APP_ID', ''),
    ],

    'settings' => [
        'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'),
        'currency' => env('PAYPAL_CURRENCY', 'USD'),
        'locale' => env('PAYPAL_LOCALE', 'en_US'),
        'validate_ssl' => env('PAYPAL_VALIDATE_SSL', true),
    ],

    'webhook' => [
        'id' => env('PAYPAL_WEBHOOK_ID'),
    ],

    'urls' => [
        'success' => env('PAYPAL_SUCCESS_URL', '/payment/paypal/success'),
        'cancel' => env('PAYPAL_CANCEL_URL', '/payment/paypal/cancel'),
        'notify' => env('PAYPAL_NOTIFY_URL', '/payment/paypal/notify'),
    ]
];
