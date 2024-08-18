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

    /**
     * Convert Base64 images to actual files.
     *
     * @return void
     */
    protected function convertFiles()
    {
        $keys = $this->base64FileKeys();

        foreach ($keys as $key) {
            $files = $this->input($key, []);

            if (is_array($files)) {
                $convertedFiles = array_map(function ($base64File) {
                    return $this->convertBase64ToFile($base64File);
                }, $files);

                $this->merge([$key => $convertedFiles]);
            }
        }
    }

    /**
     * Convert a Base64 encoded string to a file.
     *
     * @param string $base64File
     * @return \Illuminate\Http\UploadedFile|null
     */
    protected function convertBase64ToFile(string $base64File)
    {
        if (!preg_match('/^data:image\/(\w+);base64,/', $base64File, $type)) {
            abort(422, 'Invalid image file format.');
        }

        $fileContent = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64File));

        if ($fileContent === false) {
            abort(422, 'Base64 decoding failed.');
        }

        $extension = $type[1];
        $fileName = Str::random(10) . '.' . $extension;
        $tempFilePath = sys_get_temp_dir() . '/' . $fileName;

        file_put_contents($tempFilePath, $fileContent);

        return new \Illuminate\Http\UploadedFile($tempFilePath, $fileName, null, null, true);
    }
}
