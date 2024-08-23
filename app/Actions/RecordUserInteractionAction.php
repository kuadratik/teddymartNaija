<?php

namespace App\Actions;

use App\Models\UserInteraction;

class RecordUserIntercationAction
{

    public function record($category , $userUid)
    {
      $userInteraction = UserInteraction::firstOrCreate(['user_uid' => $userUid]);


     
    }
}
