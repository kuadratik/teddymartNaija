<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\PersonalAccessToken;

class ImpersonateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
        ];
    }

    /**
     * Magic login for admin
     */
    public function magicLogin()
    {
        $cacheKey = "magic-link-{$this->token}";
        $tokenData = Cache::get($cacheKey);

        if (is_null($tokenData)) {
            return Utils::validateResp([
                'token' => ['The selected token is invalid.'],
            ]);
        }

        logger($tokenData);

        $user = User::where('email',$tokenData['mail'])->first();

        if(is_null($user)) {
            return Utils::validateResp([
                'token' => ['Invalid token user'],
            ]);
        }
        

        $plainToken =  $user->createToken('authToken')->plainTextToken;
        $personalAccessToken = PersonalAccessToken::findToken($plainToken);
        $tokenUpdated = $personalAccessToken->update(['expires_at' => now()->addMinutes(25)]);

        abort_if(!$tokenUpdated, 500, 'Sorry error occurred while trying to sign you in.');

        return [
            'token' => $plainToken,
            'user' => $user->load('store'),
        ];
    }
}
