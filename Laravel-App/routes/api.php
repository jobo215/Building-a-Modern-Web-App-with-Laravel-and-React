<?php

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::post('me', [AuthController::class, 'me']);
    Route::post("/update", [AuthController::class, 'update']);
    Route::put("/upload-avatar", [AuthController::class, 'uploadAvatar']);
});

Route::group(
    [
        "middleware" => 'api',
        "prefix" => 'movie'
    ],
    function () {
        Route::get("all", [MovieController::class, "index"]);
        Route::get("/favorites", [FavoriteController::class, "show"]);
        Route::get("{id}", [MovieController::class, "show"]);
        Route::post("/create-favorite", [MovieController::class, "store"]);
        Route::delete("{id}", [MovieController::class, "destroy"]);
    }
);
