<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !($request->user() instanceof Admin)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}