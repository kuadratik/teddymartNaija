<?php

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Symfony\Component\DomCrawler\Crawler;

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


Route::get('/scrape', function () {
    $client = new Client([
        'headers' => [
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ],
        'verify' => false, // In case SSL verification causes issues
    ]);

    $categories = [
        'home-appliances', 'kitchen-appliances', 'fashion-and-beauty'
    ];

    $scrapedData = [];

    foreach ($categories as $category) {
        $url = "https://jiji.ng/$category";

        try {
            $response = $client->get($url);
            $html = $response->getBody()->getContents();
            $crawler = new Crawler($html);

            $vendors = $crawler->filter('.b-list-advert__item')->each(function ($node) {
                return [
                    'name' => $node->filter('.b-advert-title')->count() ? trim($node->filter('.b-advert-title')->text()) : 'N/A',
                    'phone' => 'Hidden (Requires Login)', // Jiji hides contact details
                    'email' => 'N/A',
                    'category' => 'N/A'
                ];
            });

            $scrapedData[$category] = $vendors;

            foreach ($vendors as $vendor) {
                Log::info("Vendor Found: " . json_encode($vendor));
            }

        } catch (\Exception $e) {
            Log::error("Failed to scrape $url: " . $e->getMessage());
            continue;
        }
    }

    // Save results in a file
    file_put_contents(storage_path('logs/jiji_vendors.json'), json_encode($scrapedData, JSON_PRETTY_PRINT));

    return response()->json([
        'message' => 'Scraping completed successfully!',
        'data' => $scrapedData
    ]);
});

