<?php

namespace App\Actions\Admin;

use App\Models\Store;
use App\Models\StoreActionNote;
use Illuminate\Support\Facades\DB;

class StoreActivationAction
{
    public function handle(array $validated)
    {
        try {
            DB::beginTransaction();

            $storeIds = $this->storeIds($validated['all_stores'], $validated);
            StoreActionNote::insert($this->notes($storeIds, $validated));
            Store::whereIn('id', $storeIds)->update([
                'active' => $validated['active'],
                ...data_get($validated, 'payment_status') ? ['payment_status' => $validated['payment_status']] : []
            ]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    private function notes(array $ids, array $validated)
    {
        return collect($ids)->map(fn($id) => [
            'store_id' => $id,
            'admin_id' => request()->user()->id,
            'note' => $validated['note'],
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString(),
        ])->toArray();
    }

    /**
     * Return the list of activatable store
     */
    private function storeIds(bool $all, $validated)
    {
        if ($all) {
            return Store::pluck('id')->toArray();
        } else {
            return $validated['stores'];
        }
    }
}
