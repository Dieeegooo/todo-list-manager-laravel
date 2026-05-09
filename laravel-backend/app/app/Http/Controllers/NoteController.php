<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Task;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;

use function Laravel\Prompts\task;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Note::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id'=>['required','integer','exists:tasks,id'],
            'name' => ['required', 'string', 'max:255'],
            'state'=>['required','string','max:255'],
        ]);
        $note = Note::create($validated);
        return response()->json($note,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        return $note->load('task');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'task_id'=>['sometimes','required','integer','exists:tasks,id'],
            'name' => ['sometimes','required', 'string', 'max:255'],
            'state'=>['sometimes','required','string','max:255'],
        ]);
        $note->update($validated);
        return response()->json($note);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json(null,204);
    }
}
