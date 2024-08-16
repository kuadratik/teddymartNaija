<?php

namespace App\Utils;

use App\Support\Utils;
use Illuminate\Support\Facades\Storage;

class FileUploader
{
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
            $fileName = Utils::fileNamer($file);

            Storage::disk('spaces')->put($fileName, file_get_contents($file));

            $tempPaths[] = $fileName;
        }

        return $tempPaths;
    }

    /**
     * Move multiple images from the temporary location to a permanent directory.
     *
     * @param array $tempPaths
     * @param string $permanentDirectory
     * @return array
     */
    public static function moveToPermanentPath(array $tempPaths, $permanentDirectory)
    {
        $permanentPaths = [];

        foreach ($tempPaths as $tempPath) {
            $fileName = basename($tempPath);

            $permanentPath = $permanentDirectory . '/' . $fileName;

            Storage::disk('spaces')->copy($tempPath, $permanentPath);

            Storage::disk('spaces')->delete($tempPath);

            $permanentPaths[] = $permanentPath;
        }

        return $permanentPaths;
    }
}
