<?php

namespace App\Http\Middleware;

use App\Support\Utils;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureClipUidHeader
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->hasHeader('Clip-Uid')) {
            return Utils::validateResp(['error' => 'The Clip-Uid header is required.']);
        }
        return $next($request);
    }
}
