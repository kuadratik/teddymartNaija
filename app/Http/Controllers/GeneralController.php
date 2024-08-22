<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Support\Utils;
use App\Http\Requests\Store\UploadTempFileRequest;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

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
}
