<?php

namespace App\Http\Controllers;

use App\Models\Movies;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{

    public function __construct()
    {
        $this->middleware("auth:api");
    }


    public function show()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $favoriteMovies = $user->favorites()->get();

        if ($favoriteMovies == null) {
            return response()->json(["message" => "No movies found"], 404);
        }

        return response()->json($favoriteMovies);
    }

}
