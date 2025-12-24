import { useEffect, useState } from "react";
import { CardMovie } from "../types/CardMovie";
import { Grid } from "@mui/material";
import { MovieCard } from "../components/MovieCard";
import { AxiosError, AxiosResponse } from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import api from "../api/api";
import { toast } from "react-toastify";
import { useToast } from "../hooks/useToast";
import NotFoundPage from "./NotFound";

export const Home = () => {
  const showToast = useToast();

  const [movies, setMovies] = useState<CardMovie[] | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    api
      .get<CardMovie[]>(`/movie/all`)
      .then((response: AxiosResponse) => {
        setMovies(response.data);
      })
      .catch((error: AxiosError) => {
        if (error.status === 401) {
          window.location.href = "/";
          showToast("Unauthorized!", "error");
        }
        if (error.status === 404) {
          setMovies([]);
          setNotFound(true);
        }
      });
  }, []);

  if (!movies) return <LoadingSpinner />;
  if (notFound) return <NotFoundPage />;

  return (
    <>
      <Grid container spacing={2} rowGap={1} pl={1} pr={1} pt={2}>
        {movies.map((movie) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MovieCard
              id={movie.id}
              title={movie.title}
              description={movie.description}
              type={movie.type}
              image={movie.image}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
