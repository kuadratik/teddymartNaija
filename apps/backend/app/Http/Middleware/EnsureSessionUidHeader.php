<?php

namespace App\Http\Middleware;

use App\Support\Utils;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionUidHeader
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->hasHeader('session-uid')) {
            return Utils::validateResp(['error' => 'The session-uid header is required.']);
        }
        return $next($request);
    }
}
