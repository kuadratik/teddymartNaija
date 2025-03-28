<?php

namespace App\Http\Requests\Auth;

use App\Models\School;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;


class MagicLoginRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'store' => ['required', 'string', 'exists:stores,slug'],
        ];
    }   

    /**
     * Handle the magic link
     */
    public function magicLink()
    {
        $store = Store::where('slug', $this->store)->firstOrFail();
        $user = User::where('id', $store->user_id)->firstOrFail();
        $url = env('FRONT_URL');

        $token = strtoupper(Str::random());
        $cacheKey = "magic-link-{$token}";

        Cache::put($cacheKey, [
            'mail' => $user->email,
        ], now()->addMinutes(2));

        $link = "$url/passwordless-login?token={$token}";

        return $link;
    }
}
