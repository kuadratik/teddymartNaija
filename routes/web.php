<?php

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Symfony\Component\DomCrawler\Crawler;
use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return view('welcome');
    // return Hash::make('TE-485527');
});

Route::post('/passcode', function (Request $request) {
    $hashed = file_get_contents(storage_path('keep/access.txt'));
    $checked = Hash::check($request->passcode, $hashed);

    if ($checked) {
        session()->put('docs-passcode', $request->passcode);
        return redirect('/docs');
    } else {
        return back()->with('error');
    }
});

Route::get('/docs', function () {
    $hashed = file_get_contents(storage_path('keep/access.txt'));
    $passcode = session('docs-passcode');
    $checked = Hash::check($passcode, $hashed);

    return view('api', [
        'checked' => $checked
    ]);
});


Route::get('/test', function () {
    $message = 'This is a test email sent from the /scrape route.';

    $sent = Mail::raw($message, function ($mail) {
        $mail->to('afuwapesunday12@gmail.com')
            ->subject('Test')
            ->from('postmaster@kuadratik.com', 'Sender Name');
    });

    return 'Email has been sent';
});
