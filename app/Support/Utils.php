<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class Utils
{
    /**
     * Throw validation with json repoonse
     *
     * @param  mixed  $errors
     * @throws \Illuminate\Validation\ValidationException;
     */
    public static function validateResp($errors = [])
    {
        throw ValidationException::withMessages($errors);
    }

    /**
     * Generate file path with folder append
     */
    public static function fileName(UploadedFile $file, $folder = 'images')
    {
        $name = Str::random(20) . '.' . $file->getClientOriginalExtension();
        return [$name, "teddymart/{$folder}/{$name}"];
    }

    /**
     * Generate file name only
     */
    public static function fileNamer(UploadedFile $file)
    {
        return Str::random(20) . '.' . $file->getClientOriginalExtension();
    }

    /**
     * Upload or abort with http Exception
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public static function uploadOrFail(UploadedFile $file, $path = 'images')
    {
        $fileName = self::fileNamer($file);
        $uploaded = $file->storePubliclyAs($path, $fileName, 'spaces');

        if (!$uploaded) {
            abort(500, 'Unable to upload file to storage provider.');
        }

        return $uploaded;
    }

    /**
     * Upload and return path
     *
     * @return string|false
     */
    public static function upload(UploadedFile $file, $path = 'images')
    {
        $fileName = self::fileNamer($file);
        return $file->storePubliclyAs($path, $fileName, 'spaces');
    }

    /**
     * Return digital ocean space path
     */
    public static function filePath(String $path)
    {
        return "https://kuadratik.nyc3.digitaloceanspaces.com/teddymart{$path}";
    }
    /**
     * Upload multiple images temporarily to DigitalOcean Spaces.
     *
     * @param array $files
     * @return array
     */
    public static function uploadTemporary(array $files)
    {
        $tempPaths = [];

        foreach ($files as $file) {
            $path = self::filePath('/temp/uploads');
            $uploadedPath = self::uploadOrFail($file, $path);
            $tempPaths[] = $uploadedPath;
        }

        return $tempPaths;
    }


    /**
     * Move multiple images from the temporary location to a permanent directory, avoiding duplicates.
     *
     * @param array $tempPaths
     * @param string $permanentDirectory
     * @return array
     */
    public static function moveToPermanentPath(array $tempPaths, $permanentDirectory)
    {
        $permanentPaths = [];

        foreach ($tempPaths as $tempPath) {
            $fileName = basename('teddymart/temp/uploads' . $tempPath);

            $permanentPath = "{$permanentDirectory}/{$fileName}";

            if (Storage::disk('spaces')->exists('teddymart/' . $permanentPath)) {
                continue;
            }

            Storage::disk('spaces')->move($tempPath, 'teddymart/' . $permanentPath);

            $permanentPaths[] = $permanentPath;
        }

        return $permanentPaths;
    }

    /**
     * Delete multiple files from a permanent directory.
     *
     * @param array $filePaths
     * @param string $permanentDirectory
     * @return void
     */
    public static function deletePermanentFiles(array $filePaths, $permanentDirectory)
    {
        foreach ($filePaths as $filePath) {
            $fullPath = 'teddymart/' . $permanentDirectory . '/' . $filePath;

            if (Storage::disk('spaces')->exists($fullPath)) {
                Storage::disk('spaces')->delete($fullPath);
            }
        }
    }

    /**
     * Delete multiple temporary files.
     *
     * @param array $tempPaths
     * @return void
     */
    public static function deleteTemporaryFiles(array $tempPaths)
    {
        foreach ($tempPaths as $tempPath) {
            if (Storage::disk('spaces')->exists($tempPath)) {
                Storage::disk('spaces')->delete($tempPath);
            }
        }
    }

    /**
     * Creates a replace callback using regex
     */
    public static function replaceCallback($subject)
    {
        return preg_replace_callback('/(\d+)/', function ($matches) {
            return '#' . ($matches[1] + 1);
        }, $subject, 4, $count);
    }

    /**
     * Create an error message summary from the validation errors.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator#
     * @return string
     */
    public static function summarize($validator)
    {
        $messages = $validator->errors()->all();

        if (!count($messages) || !is_string($messages[0])) {
            return $validator->getTranslator()->get('The given data was invalid.');
        }

        $message = self::replaceCallback(array_shift($messages));

        if ($count = count($messages)) {
            $pluralized = $count === 1 ? 'error' : 'errors';

            $message .= ' ' . $validator->getTranslator()->get("(and :count more $pluralized)", compact('count'));
        }

        return "Whoops something went wrong, " . preg_replace('/(?<=.)\.(?=.)/', ' ', str($message)->headline()->lower());
    }

    /**
     * collect error messages and transform it
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator#
     */
    public static function collectErrors(ValidationException $exception)
    {
        return collect($exception->errors())->map(function ($messages, $key) {
            if (strpos($key, '.') !== false) {
                return collect($messages)->map(function ($message) {
                    $transed = self::replaceCallback($message);
                    return preg_replace('/(?<=.)\.(?=.)/', ' ', str($transed)->headline()->lower());
                });
            }

            return $messages;
        });
    }

    /**
     * Json success response helper without extra headers
     * and body
     *
     * @param  mixed  $message
     * @param  mixed  $data
     * @return \Illuminate\Http\JsonResponse
     */
    public static function success($data = [], $message = 'successful')
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], 200);
    }

    /**
     * Json post request response helper
     *
     * @param  mixed  $message
     * @param  mixed  $data
     * @return \Illuminate\Http\JsonResponse
     */
    public static function failure($message = 'Error occured while processing your request.', $status = 409)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    /**
     * Json erros request response helper
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public static function error(ValidationException $exception)
    {
        $errors = self::collectErrors($exception);

        return response()->json([
            'success' => false,
            'message' => self::summarize($exception->validator),
            'errors' => $errors->toArray()
        ], 422);
    }
}
