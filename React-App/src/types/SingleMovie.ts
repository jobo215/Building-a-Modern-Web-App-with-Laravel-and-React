export type SingleMovie = {
    id: string;
    image: string;
    title: string;
    type:string;
    description: string;
    genres: string[];
    countriesOfOrigin: string[];
    releaseDate: string;
    runtimeMinutes: number;
    averageRating:number;
    numVotes: number;
    isFavorite: boolean;
}