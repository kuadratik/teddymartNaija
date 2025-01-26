<?php

namespace App\Actions\Customer;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;

class BusinessScrapeAction
{
    /**
     * Handle the action
     */
    public function handle(string $url)
    {
        return $this->scrapeWebsite($url);
    }

    public function scrapeWebsite($url)
    {
        try {
            // Make a GET request using the HTTP facade
            $response = Http::timeout(120)->get($url);

            if (!$response->successful()) {
                abort(400, 'Website not found or not accessible.');
            }

            $htmlContent = $response->body();

            // Load HTML content into DOMDocument
            $dom = new DOMDocument();
            @$dom->loadHTML($htmlContent);

            // Initialize DOMXPath for querying
            $xpath = new DOMXPath($dom);

            // Extract meta description
            $metaDescription = $this->getMetaDescription($xpath);

            // Extract contact information
            $contactInfo = $this->extractContactInfo($htmlContent);

            return [
                'meta_description' => $metaDescription,
                'contact_info' => $contactInfo,
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    protected function getMetaDescription($xpath)
    {
        $metaTag = $xpath->query("//meta[@name='description']")->item(0);

        return $metaTag ? $metaTag->getAttribute('content') : null;
    }

    /**
     * Extract the emails and phone number
     */
    protected function extractContactInfo($htmlContent)
    {
        $emails = [];
        $phones = [];
        $addresses = [];

        preg_match_all('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $htmlContent, $emailMatches);
        if (!empty($emailMatches[0])) {
            $emails = collect($emailMatches[0])->unique()->values()->toArray();
        }

        $dom = new DOMDocument();
        @$dom->loadHTML($htmlContent);
        $xpath = new DOMXPath($dom);

        $telLinks = $xpath->query("//a[starts-with(@href, 'tel:')]");

        foreach ($telLinks as $link) {
            $displayedPhone = trim($link->nodeValue);
            $hrefPhone = $link->getAttribute('href');
            $hrefPhone = str_replace('tel:', '', $hrefPhone);

            $phones[] = !empty($displayedPhone) ? $displayedPhone : $hrefPhone;
        }

        // Extract addresses from <address> tags
        $addressTags = $xpath->query("//address");
        foreach ($addressTags as $addressTag) {
            $addresses[] = trim($addressTag->nodeValue);
        }

        // Attempt to find addresses in <p> or <div> tags containing keywords
        $possibleAddressTags = $xpath->query("//p[contains(text(), 'Address') or contains(text(), 'Location')]");
        foreach ($possibleAddressTags as $tag) {
            $addresses[] = trim($tag->nodeValue);
        }

        return [
            'emails' => $emails,
            'phones' => array_unique($phones),
            'addresses' => array_unique($addresses),
        ];
    }
}
