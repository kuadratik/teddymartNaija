<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // return view('welcome');
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
