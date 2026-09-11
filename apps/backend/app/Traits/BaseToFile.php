<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\FileBag;
use Symfony\Component\HttpFoundation\ParameterBag;

trait BaseToFile
{
    /**
     * Helper method to get the body parameters bag.
     *
     * @return \Symfony\Component\HttpFoundation\ParameterBag
     */
    private function bodyParametersBag(): ParameterBag
    {
        return $this->request;
    }

    /**
     * Helper method to get the uploaded files bag.
     *
     * @return FileBag
     */
    private function uploadFilesBag(): FileBag
    {
        return $this->files;
    }

    /**
     * Set file extension
     *
     * @return string
     */
    private function setExtension($tempFileName, $mime)
    {
        return $tempFileName . '.' . explode('/', $mime)[1];
    }

    /**
     * Set file upload instance
     *
     * @return UploadedFile
     */
    private function fileUploaded($tempFilePath, $tempFilename)
    {
        $tempFile = new UploadedFile($tempFilePath, $tempFilename, null, null, true);

        $filename = $this->setExtension($tempFilename, $tempFile->getMimeType());

        return new UploadedFile($tempFilePath, $filename, null, null, true);
    }

    /**
     * Pulls the Base64 contents for each image key and creates
     * an UploadedFile instance from it and sets it on the
     * request.
     *
     * @return void
     */
    protected function convertFiles()
    {
        $flattened = Arr::dot($this->base64FileKeys());

        Collection::make($flattened)->each(function ($key) {
            $base64Files = $this->input($key);

            if (!is_array($base64Files)) {
                $base64Files = [$base64Files];
            }

            $uploadedFiles = [];

            foreach ($base64Files as $base64Contents) {
                $tempFilename = bin2hex(random_bytes(10));

                if (!$base64Contents || !is_string($base64Contents)) {
                    continue;
                }

                if (!preg_match('/^data:image\/(\w+);base64,/', $base64Contents, $match)) {
                    continue;
                }

                $extension = $match[1];
                $tempFilePath = tempnam(sys_get_temp_dir(), $tempFilename);
                $fileContent = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Contents));

                if ($fileContent === false) {
                    continue;
                }

                file_put_contents($tempFilePath, $fileContent);

                $tempFilename = $tempFilename . '.' . $extension;

                $uploadedFile = new UploadedFile($tempFilePath, $tempFilename, 'image/' . $extension, null, true);

                $uploadedFiles[] = $uploadedFile;
            }

            if (!empty($uploadedFiles)) {
                $this->merge([$key => $uploadedFiles]);
            }
        });
    }



    /**
     * Convert base64 encoded files to UploadedFile objects for images and videos.
     */
    protected function convertMultiFiles()
    {
        $flattened = Arr::dot($this->base64FileKeys());

        Collection::make($flattened)->each(function ($key) {
            $base64Files = $this->input($key);

            if (!is_array($base64Files)) {
                $base64Files = [$base64Files];
            }

            $uploadedFiles = [];

            foreach ($base64Files as $base64Contents) {
                $tempFilename = bin2hex(random_bytes(10));

                if (!$base64Contents || !is_string($base64Contents)) {
                    continue;
                }

                // Check if the Base64 string is for an image
                if (preg_match('/^data:image\/(\w+);base64,/', $base64Contents, $match)) {
                    $extension = $match[1];
                    $tempFilePath = tempnam(sys_get_temp_dir(), $tempFilename);
                    $fileContent = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Contents));

                    if ($fileContent === false) {
                        continue;
                    }

                    file_put_contents($tempFilePath, $fileContent);

                    $tempFilename = $tempFilename . '.' . $extension;

                    $uploadedFile = new UploadedFile($tempFilePath, $tempFilename, 'image/' . $extension, null, true);
                    $uploadedFiles[] = $uploadedFile;
                }
                // Check if the Base64 string is for a video
                elseif (preg_match('/^data:video\/(\w+);base64,/', $base64Contents, $match)) {
                    $extension = $match[1];
                    $tempFilePath = tempnam(sys_get_temp_dir(), $tempFilename);
                    $fileContent = base64_decode(preg_replace('#^data:video/\w+;base64,#i', '', $base64Contents));

                    if ($fileContent === false) {
                        continue;
                    }

                    file_put_contents($tempFilePath, $fileContent);

                    $tempFilename = $tempFilename . '.' . $extension;

                    $uploadedFile = new UploadedFile($tempFilePath, $tempFilename, 'video/' . $extension, null, true);
                    $uploadedFiles[] = $uploadedFile;
                }
            }

            if (!empty($uploadedFiles)) {
                $this->merge([$key => $uploadedFiles]);
            }
        });
    }
}
