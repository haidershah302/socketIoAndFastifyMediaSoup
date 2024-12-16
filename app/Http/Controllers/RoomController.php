<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    // Display a listing of rooms
    public function index()
    {
        $rooms = Room::all();
        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms,
        ]);
    }

    // Show the form for creating a new room
    public function create()
    {
        return Inertia::render('Rooms/Create');
    }

    // Store a newly created room
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Room::create($validated);

        return redirect()->route('rooms.index')->with('success', 'Room created successfully!');
    }

    public function show(Room $room)
    {
        return Inertia::render('Rooms/Show', [
            'room' => $room
        ]);
    }

    // Show the form for editing a room
    public function edit(Room $room)
    {
        return Inertia::render('Rooms/Edit', [
            'room' => $room,
        ]);
    }

    // Update the specified room
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $room->update($validated);

        return redirect()->route('rooms.index')->with('success', 'Room updated successfully!');
    }

    // Remove the specified room
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->route('rooms.index')->with('success', 'Room deleted successfully!');
    }
}
