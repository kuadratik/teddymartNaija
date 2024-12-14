<?php

namespace App\Services\Store;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Models\OrderDetail;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreService
{

    /**
     * Retrieves a paginated list of store listings for a given user store.
     * Applies various filters and sorting options based on the request parameters,
     * including search, availability, draft status, date, and price.
     *
     * @param \Illuminate\Http\Request $request The HTTP request containing filter and sort parameters.
     * @param \App\Models\Store $userStore The store model instance representing the user's store.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator The paginated list of filtered and sorted listings.
     */
    public function getUserStoreListings(Request $request, Store $userStore)
    {
        $query = $userStore->listings();

        $query = $this->applySearchFilter($query, $request);
        $query = $this->applyAvailabilityFilter($query, $request);
        $query = $this->applyDraftFilter($query, $request);
        $query = $this->applySortByDate($query, $request);
        $query = $this->applySortByPrice($query, $request);

        return $query
            ->with('ratings')
            ->paginate();
    }

    /**
     * Applies a search filter to the query based on the 'search' parameter in the request.
     * Filters listings by matching the search term against the 'name', 'description',
     * and 'slug' fields using a case-insensitive 'like' query.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query The query builder instance.
     * @param \Illuminate\Http\Request $request The HTTP request containing search parameters.
     * @return \Illuminate\Database\Eloquent\Builder The modified query with the search filter applied.
     */
    private function applySearchFilter($query, $request)
    {
        return $query->when($request->filled('search'), function ($q) use ($request) {
            $searchTerm = '%' . $request->search . '%';
            return $q->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhere('slug', 'like', $searchTerm);
            });
        });
    }


    /**
     * Applies an availability filter to the query based on the 'availability' parameter in the request.
     * Filters listings by the specified availability status.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query The query builder instance.
     * @param \Illuminate\Http\Request $request The HTTP request containing availability parameters.
     * @return \Illuminate\Database\Eloquent\Builder The modified query with the availability filter applied.
     */
    private function applyAvailabilityFilter($query, $request)
    {
        return $query->when($request->filled('availability'), function ($q) use ($request) {
            return $q->availability($request->availability);
        });
    }

    /**
     * Applies a draft filter to the query based on the 'is_draft' parameter in the request.
     * Filters listings by their draft status.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query The query builder instance.
     * @param \Illuminate\Http\Request $request The HTTP request containing draft status parameters.
     * @return \Illuminate\Database\Eloquent\Builder The modified query with the draft filter applied.
     */
    private function applyDraftFilter($query, $request)
    {
        return $query->when($request->filled('is_draft'), function ($q) use ($request) {
            return $q->isDraft($request->is_draft);
        });
    }

    /**
     * Applies a date sorting to the query based on the 'sort_date' parameter in the request.
     * Sorts listings by their creation date, either from oldest to newest or vice versa.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query The query builder instance.
     * @param \Illuminate\Http\Request $request The HTTP request containing date sorting parameters.
     * @return \Illuminate\Database\Eloquent\Builder The modified query with the date sorting applied.
     */
    private function applySortByDate($query, $request)
    {
        return $query->when($request->filled('sort_date'), function ($q) use ($request) {
            return match ($request->sort_date) {
                'oldest' => $q->oldest(),
                'newest' => $q->latest(),
                default => $q
            };
        });
    }

    /**
     * Applies a price sorting to the query based on the 'sort_price' parameter in the request.
     * Sorts listings by their display price, either from lowest to highest or vice versa.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query The query builder instance.
     * @param \Illuminate\Http\Request $request The HTTP request containing price sorting parameters.
     * @return \Illuminate\Database\Eloquent\Builder The modified query with the price sorting applied.
     */
    private function applySortByPrice($query, $request)
    {
        return $query->when($request->filled('sort_price'), function ($q) use ($request) {
            return match ($request->sort_price) {
                'lowest'  => $q->orderBy('display_price', 'asc'),
                'highest' => $q->orderBy('display_price', 'desc'),
                default   => $q
            };
        });
    }
}
