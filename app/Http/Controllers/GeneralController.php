<?php

namespace App\Http\Controllers;

use App\Actions\RecordUserInteractionAction;
use App\Http\Requests\ContactUsRequest;
use Illuminate\Http\Request;
use App\Support\Utils;
use App\Http\Requests\Store\UploadTempFileRequest;
use App\Http\Requests\Store\VideoUploadTempFileRequest;
use App\Models\Category;
use App\Notifications\ContactUsNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class GeneralController extends Controller
{
    /**
     * upload temp file to spaces
     */
    public function uploadTempFile(UploadTempFileRequest $request)
    {
        $path = Utils::uploadTemporary($request->validated('images'));
        return $this->success($path);
    }
    /**
     * upload temp file to spaces
     */
    public function videoUploadTempFile(VideoUploadTempFileRequest $request)
    {
        $path = Utils::uploadTemporary($request->validated('videos'));
        return $this->success($path);
    }




    /**
     * delete temporary file paths
     */
    public function deleteTempFiles(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paths' => 'required|array',
            'paths.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return Utils::validateResp($validator->errors());
        }
        Utils::deleteTemporaryFiles($request->input('paths'));
        return $this->success();
    }

    /**
     *  get categories and filter by service and product
     */
    public function getCategories(Request $request)
    {
        $type = $request->query('type');

        $categories = Cache::remember('categories_' . $type, now()->addMinutes(60), function () use ($type) {
            return Category::query()
                ->when($type, function ($query) use ($type) {
                    $query->where('type', $type);
                })
                ->get();
        });

        return $this->success($categories);
    }

    /**
     *  Record user interaction
     */
    public function recordUserInteraction(
        Request $request,
        Category $category,
        RecordUserInteractionAction $recordUserInteractionAction
    ) {
        $category = [['category' => $category->id, 'interaction_count' => 1]];
        $recordUserInteractionAction->record($category, $request->header('interactUid'));

        return $this->success();
    }

    /**
     * Get all countries
     */
    public function countries(Request $request)
    {
        $countries = DB::table('countries')
            ->select('id', 'name', 'emoji', 'code', 'currency_code', 'phonecode')
            ->when($request->filled('search'))->where(
                fn($q) => $q->where('name', 'LIKE', "%$request->search%")
                    ->orWhere('phonecode', 'LIKE', "%$request->search%")
            )->get();

        $mapped = $countries->map(fn($c) => collect($c)
            ->merge(['flag' => strtolower("https://flagcdn.com/120x90/{$c->code}.png")]));

        return $this->success($mapped);
    }

    /**
     * Get country divisions
     */
    public function countryDivision(Request $request)
    {
        $divisions = DB::table('states')
            ->where('country_id', $request->country)
            ->where(function ($query) use ($request) {
                if ($request->has('search')) {
                    $query->where('name', 'LIKE', "%$request->search%");
                }
            })
            ->get();

        return $this->success($divisions);
    }

    /**
     * Send contact us message to our contact email
     */
    public function contactUs(ContactUsRequest $request)
    {
        Notification::route('mail', config('services.inquiry.email'))
            ->notify(new ContactUsNotification($request->validated()));
        return $this->success('Thank you for your inquiry. We will get back to you shortly.');
    }
}
