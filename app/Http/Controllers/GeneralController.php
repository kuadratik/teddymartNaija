<?php

namespace App\Http\Controllers;

use App\Actions\RecordUserIntercationAction;
use Illuminate\Http\Request;
use App\Support\Utils;
use App\Http\Requests\Store\UploadTempFileRequest;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Store;
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
        RecordUserIntercationAction $recordUserIntercationAction
    ) {
        $validatedData = $request->validate(['category' => ['required', 'exists:categories']]);
        $recordUserIntercationAction->record($validatedData['category'], $request->header());

        return $this->success();
    }

    /**
     * Get all countries
     */
    public function countries(Request $request)
    {
        $countries = DB::table('countries')
            ->select('id', 'name', 'emoji', 'currency_code', 'phonecode')
            ->where(function ($query) use ($request) {
                if ($request->has('search')) {
                    $query->where('name', 'LIKE', "%$request->search%")
                        ->orWhere('phonecode', 'LIKE', "%$request->search%");
                }
            })->get();

        return $this->success($countries);
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
}
