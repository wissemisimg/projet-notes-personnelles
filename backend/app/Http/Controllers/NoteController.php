<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = $request->user()->notes()
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'nullable|string',
            'priority' => 'required|in:Basse,Moyenne,Haute',
        ]);

        $note = $request->user()->notes()->create($request->all());

        return response()->json($note, 201);
    }

    public function show(Note $note)
    {
        $this->authorize('view', $note);
        return response()->json($note);
    }

    public function update(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'nullable|string',
            'priority' => 'required|in:Basse,Moyenne,Haute',
        ]);

        $note->update($request->all());

        return response()->json($note);
    }

    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);
        $note->delete();

        return response()->json(['message' => 'Note supprimée avec succès']);
    }
}