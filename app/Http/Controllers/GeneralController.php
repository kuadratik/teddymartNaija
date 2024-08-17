<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Support\Utils;
use App\Http\Requests\Store\UploadTempFileRequest;
use Illuminate\Support\Facades\Validator;

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
}
