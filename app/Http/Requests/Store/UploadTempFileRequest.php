<?php

namespace App\Http\Requests\Store;

use App\Traits\BaseToFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UploadTempFileRequest extends FormRequest
{
    use BaseToFile;
    /**
     * The files array key to convert from Base64
     *
     * @return array
     */
    protected function base64FileKeys()
    {
        return ['images'];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'images' => ['required', 'array'],
            'image' => ['nullable', 'image', 'max:2048']
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->convertFiles();
    }


}
