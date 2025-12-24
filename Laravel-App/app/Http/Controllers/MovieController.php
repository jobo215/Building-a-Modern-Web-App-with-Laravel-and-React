<?php

namespace App\Http\Controllers;

use App\DTO\ListMovieDTO;
use App\DTO\SingleMovieDTO;
use App\Models\Favorite;
use App\Models\Movies;
use App\Services\MovieExternalApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class MovieController extends Controller
{

    protected MovieExternalApiService $movieExternalApiService;

    public function __construct(MovieExternalApiService $movieExternalApiService)
    {
        $this->middleware("auth:api");
        $this->movieExternalApiService = $movieExternalApiService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $movies = $this->movieExternalApiService->getMoviesForHomePage();
        $movieDTOs = [];

        if ($movies == null) {
            return response()->json(["message" => "No movies found"], 404);
        }

        foreach ($movies as $movie) {
            $movieDTOs[] = ListMovieDTO::getDtoFromExternalApi($movie);
        }
        return response()->json($movieDTOs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $userId = Auth::id();
        $movieId = $request->input('movie_id');

        $request->validate([
            'movie_id' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'image' => 'required|string|max:255',
        ]);

        Movies::firstOrCreate([
            'id' => $movieId,
        ], [
            'id' => $movieId,
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'type' => $request->get('type'),
            'image' => $request->get('image'),
        ]);

        $conditions = [
            'user_id' => $userId,
            'movie_id' => $movieId
        ];

        $favorite = Favorite::firstOrCreate($conditions);

        if ($favorite->wasRecentlyCreated) {
            return response()->json([
                "message" => "Movie added to favorites successfully!",
                "favorite" => $favorite
            ], 201);
        }

        return response()->json([
            "message" => "Movie is already a favorite.",
            "favorite" => $favorite
        ], 409);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $movieData = $this->movieExternalApiService->getMovieById($id);

        if ($movieData === null) {
            return response()->json([
                'message' => 'Movie with ID ' . $id . ' not found on external API.'
            ], 404);
        }

        return response()->json(SingleMovieDTO::getSingleDtoFromExternalApi($movieData, $this->isMovieFavorite($id)));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $favoriteMovie = $this->findFavoriteMovieForUser($id);
        if ($favoriteMovie !== null) {
            $favoriteMovie->delete();
            return response()->json([
                'message' => 'Movie with ID ' . $id . ' not found on external API.'
            ]);
        } else {
            return response()->json("Not found as favorite!", 404);
        }
    }

    private function getUserId(): int
    {
        return Auth::id();
    }

    private function findFavoriteMovieForUser(string $movieId): ?Favorite
    {
        return Favorite::where('user_id', $this->getUserId())
            ->where('movie_id', $movieId)
            ->first();
    }

    private function isMovieFavorite(string $movieId): bool
    {
        return $this->findFavoriteMovieForUser($movieId) !== null;
    }

}
