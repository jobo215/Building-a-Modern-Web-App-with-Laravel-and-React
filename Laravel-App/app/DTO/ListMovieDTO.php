<?php

namespace App\DTO;

class ListMovieDTO
{

    public function __construct(
        public string $id,
        public string $title,
        public string $type,
        public string $description,
        public string $image
    ) {
    }

    public static function getDtoFromExternalApi(array $data): self
    {
        return new self(
            id: $data['id'],
            title: $data['originalTitle'],
            type: $data['type'],
            description: $data['description'],
            image: $data['primaryImage']
        );
    }

}