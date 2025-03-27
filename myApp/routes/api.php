<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
}); 

Route::middleware('auth:sanctum')->post('/update-location', [LocationController::class, 'updateLocation']);
Route::get('/get-locations', [LocationController::class, 'getLocations']);
Route::get('/get-nearby-washers', [LocationController::class, 'getNearbyWashers']);

Route::post('/google-login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found. Please register.'], 404);
    }

    $token = $user->createToken('authToken')->plainTextToken;
    return response()->json(['user' => $user, 'token' => $token]);
});



