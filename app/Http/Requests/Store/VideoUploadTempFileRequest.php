<?php

namespace App\Http\Requests\Store;

use App\Rules\VideoDuration;
use App\Traits\BaseToFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class VideoUploadTempFileRequest extends FormRequest
{
    use BaseToFile;
    /**
     * The files array key to convert from Base64
     *
     * @return array
     */
    protected function base64FileKeys()
    {
        return ['videos'];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'videos' => ['required', 'array'],
            'videos.*' => ['required', 'max:50000', new VideoDuration()]
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->convertMultiFiles();
    }
}
