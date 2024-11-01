<?php

namespace App\Http\Controllers;

use App\Http\Requests\Advert\CreateAdvertRequest;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertsController extends Controller
{
    public function create(CreateAdvertRequest $request)
    {
        Advertisement::create($request->advertAttributes());
        return $this->success();
    }
}
