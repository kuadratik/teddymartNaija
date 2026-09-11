<?php

namespace App\Http\Requests\Listing;

use App\Enums\ListingType;
use App\Models\Listing;
use App\Models\ListingRating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddRatingRequest extends FormRequest
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
            'listing_id' => [
                'required', Rule::exists('listings', 'id'),
                function ($attr, $val, $fail) {

                    if (ListingRating::where('listing_id', $val)->where('user_id', $this->user()->id)->exists()) {
                        $fail('You are not allowed rate a product or service twice!');
                    }
                }
            ],
            'store_id' => ['required', Rule::exists('listings', 'store_id')->where('id', $this->listing_id)],
            'rating' => ['required', 'numeric', 'integer', 'max:5']
        ];
    }

    /**
     * Prepare rating attributes for saving.
     */
    public function ratingAttributes()
    {
        return collect($this->safe())->merge([
            'user_id' =>  $this->user()->id
        ])->toArray();
    }
}
