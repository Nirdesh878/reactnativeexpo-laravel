<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\UserLocation;
use Illuminate\Support\Facades\Auth;

class LocationController extends Controller {
    public function updateLocation(Request $request) {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        UserLocation::updateOrCreate(
            ['user_id' => Auth::id()],
            ['latitude' => $request->latitude, 'longitude' => $request->longitude]
        );

        return response()->json(['message' => 'Location updated']);
    }

    public function getLocations() {
        return response()->json(UserLocation::with('user:id,name')->get());
    }

    public function getNearbyWashers() {
        $washers = UserLocation::with('user:id,name')->get()->map(function ($washer) {
            return [
                'id' => $washer->id,
                'latitude' => (float) $washer->latitude, // Ensure it's a float
                'longitude' => (float) $washer->longitude,
                'user' => [
                    'id' => $washer->user->id,
                    'name' => $washer->user->name
                ],
            ];
        });
    
        return response()->json($washers);
    }    
    
}
