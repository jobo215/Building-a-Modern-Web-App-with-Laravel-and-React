<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MovieExternalApiService
{

    protected $baseUrl = "https://imdb236.p.rapidapi.com/api/imdb/";

    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('MOVIE_API_KEY');
    }

    private function getFromExternalApi(string $endpoint, array $query = [])
    {
        $response = Http::baseUrl($this->baseUrl)
            ->withHeaders([
                'x-rapidapi-key' => $this->apiKey,
                'x-rapidapi-host' => 'imdb236.p.rapidapi.com'
            ])
            ->get($endpoint, $query);


        if ($response->successful()) {
            return $response->json();
        }

        logger()->error('External API GET Failed', [
            'status' => $response->status(),
            'body' => $response->body(),
            'endpoint' => $endpoint,
        ]);

        return null;

    }

    public function getMovieById(string $id)
    {
        return $this->getFromExternalApi($id, []);
    }

    public function getMoviesForHomePage()
    {
        return $this->getFromExternalApi("most-popular-movies", []);
    }

}
