<?php

namespace App\DTO;

class SingleMovieDTO extends ListMovieDTO
{

    public string $releaseDate;
    public int $runtimeMinutes;
    public array $genres;
    public array $countriesOfOrigin;
    public float $averageRating;
    public int $numVotes;
    public bool $isFavorite;

    public function __construct(
        string $id,
        string $title,
        string $type,
        string $description,
        string $image,
        string $releaseDate,
        int $runtimeMinutes,
        array $genres,
        array $countriesOfOrigin,
        float $averageRating,
        int $numVotes,
        bool $isFavorite
    ) {
        parent::__construct($id, $title, $type, $description, $image);
        $this->releaseDate = $releaseDate;
        $this->runtimeMinutes = $runtimeMinutes;
        $this->genres = $genres;
        $this->countriesOfOrigin = $countriesOfOrigin;
        $this->averageRating = $averageRating;
        $this->numVotes = $numVotes;
        $this->isFavorite = $isFavorite;
    }

    public static function getSingleDtoFromExternalApi(array $data, bool $isFavorite): self
    {
        return new self(
            id: $data['id'],
            title: $data['originalTitle'],
            type: $data['type'],
            description: $data['description'],
            image: $data['primaryImage'],
            releaseDate: $data['releaseDate'],
            runtimeMinutes: $data['runtimeMinutes'],
            genres: $data['genres'],
            countriesOfOrigin: $data['countriesOfOrigin'],
            averageRating: $data['averageRating'],
            numVotes: $data['numVotes'],
            isFavorite: $isFavorite
        );
    }

}
