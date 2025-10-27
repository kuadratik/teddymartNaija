<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;

class AdminStoreController extends Controller
{
    public function deactivate(Store $store)
    {
        $store->update(['active' => false]);
        
        return $this->success(['message' => 'Store deactivated successfully']);
    }

    public function activate(Store $store)
    {
        $store->update(['active' => true]);
        
        return $this->success(['message' => 'Store activated successfully']);
    }
}