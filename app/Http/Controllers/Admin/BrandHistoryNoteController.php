<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HistoryNote;
use Illuminate\Http\Request;

class BrandHistoryNoteController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'note' => 'required|string',
        ]);

        HistoryNote::create(['note' => $request->note]);

        return $this->list();
    }

    /**
     * Update an existing note
     */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'note' => 'required|string',
        ]);

        $note = HistoryNote::findOrFail($id);
        $note->update(['note' => $request->note]);

        return $this->list();
    }

    /**
     * Delete a note
     */
    public function delete(int $id)
    {
        HistoryNote::findOrFail($id)->delete();

        return $this->list();
    }

    /**
     * Show a single note
     */
    public function show(int $id)
    {
        $note = HistoryNote::findOrFail($id);
        return $this->success($note);
    }

    /**
     * List all notes (text only)
     */
    public function list()
    {
        $notes = HistoryNote::orderBy('created_at', 'desc')->pluck('note');

        return $this->success($notes);
    }
}
