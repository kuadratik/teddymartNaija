<?php

use App\Http\Middleware\BlockConcurrency;
use App\Http\Middleware\CheckIfUserHasStore;
use App\Http\Middleware\EnsureClipUidHeader;
use App\Http\Middleware\EnsureSessionUidHeader;
use App\Http\Middleware\OptionalSanctum;
use App\Http\Middleware\RespondWithJson;
use App\Http\Middleware\VerifyWebhookSignature;
use App\Support\Utils;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        channels: __DIR__ . '/../routes/channels.php',
        commands: __DIR__ . '/../routes/console.php',
        then: function () {
            Route::middleware('api')->prefix('api')->group(base_path('routes/admin.php'));
        },
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('api', [RespondWithJson::class]);
        $middleware->alias([]);
        $middleware->alias([
            'hasUid' => EnsureClipUidHeader::class,
            'hasSessionUid' => EnsureSessionUidHeader::class,
            'hasStore' => CheckIfUserHasStore::class,
            'optionalAuth' => OptionalSanctum::class,
            'verifyWebhookSignature' => VerifyWebhookSignature::class,
            'stopper' => BlockConcurrency::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class
        ]);
        $middleware->validateCsrfTokens(except: [
            'https://9f6d9d9fe38133.lhr.life/api/webhook/paypal'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $exception, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                if (
                    $exception->getPrevious() instanceof ModelNotFoundException ||
                    $exception instanceof ModelNotFoundException
                ) {
                    $model = str(class_basename($exception->getPrevious()->getModel() ?? 'record'))
                        ->headline()->lower();

                    return Utils::failure("The requested resource {$model} information was not found", 404);
                }

                if ($exception instanceof NotFoundHttpException) {
                    return Utils::failure('Invalid resource url Path', 404);
                }

                if ($exception instanceof AuthorizationException) {
                    return Utils::failure($exception->getMessage(), 403);
                }

                if ($exception instanceof AccessDeniedHttpException) {
                    return Utils::failure('This action is unauthorized.', 403);
                }

                if ($exception instanceof HttpException) {
                    return Utils::failure($exception->getMessage(), 403);
                }

                if ($exception instanceof ThrottleRequestsException) {
                    return Utils::failure('Too many attempts was made please try later.', 429);
                }

                if ($exception instanceof MethodNotAllowedHttpException) {
                    return Utils::failure($exception->getMessage(), 405);
                }

                if ($exception instanceof QueryException) {
                    return Utils::failure("Whoops there were some problems on our end. Our team has been notified, and we're working to fix it", 500);
                }

                if ($exception instanceof RelationNotFoundException) {
                    return Utils::failure("Whoops there were some problems on our end. Our team has been notified, and we're working to fix it", 500);
                }

                if ($exception instanceof AuthenticationException) {
                    return Utils::failure('You are not authenticated please login.', 401);
                }

                if ($exception instanceof ValidationException) {
                    return Utils::error($exception);
                }

                if (env('APP_ENV') !== 'local') {
                    return Utils::failure();
                }
            }
        });

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return match ($response->getStatusCode()) {
                    400 => Utils::failure($exception->getMessage(), 400),
                    default => $response,
                };
            }

            return $response;
        });
    })->create();
