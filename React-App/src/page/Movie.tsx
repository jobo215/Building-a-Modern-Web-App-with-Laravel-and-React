import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { Grid } from "@mui/material";
import { SingleMovie } from "../types/SingleMovie";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AxiosError, AxiosResponse } from "axios";
import api from "../api/api";
import { toast } from "react-toastify";
import NotFoundPage from "./NotFound";
import { useToast } from "../hooks/useToast";

type FavoriteMovie = {
  movie_id?: string;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
};

export const MoviePage = () => {
  const showToast = useToast();
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<SingleMovie | null>(null);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    api
      .get<SingleMovie>(`/movie/${id}`)
      .then((response: AxiosResponse) => {
        setMovie(response.data);
        setFavorite(response.data.isFavorite);
      })
      .catch((error: AxiosError) => {
        if (error.status === 404) {
          setIsNotFound(true);
          showToast("Movie not found!", "error");
        }
        if (error.status === 401) {
          window.location.href = "/";
          showToast("Unauthorized!", "error");
        }
      });
  }, []);

  const handleFavoriteClick = () => {
    if (!favorite) {
      handleAddFavorite();
    } else {
      handleRemoveFavorite();
    }
  };

  const getMovieAsFavorite = (): FavoriteMovie => {
    return {
      movie_id: movie?.id,
      title: movie?.title,
      type: movie?.type,
      description: movie?.description,
      image: movie?.image,
    };
  };

  const handleAddFavorite = () => {
    api
      .post("/movie/create-favorite", getMovieAsFavorite())
      .then((response: AxiosResponse) => {
        setFavorite(response.status === 201);
      })
      .catch((error: AxiosError) => {
        if (error.status === 409) {
          toast.warning("Movie is already in favorites!", {
            position: "bottom-right",
          });
        }
      });
  };

  const handleRemoveFavorite = () => {
    api
      .delete(`/movie/${id}`)
      .then((response: AxiosResponse) => {
        setFavorite(!(response.status === 200));
      })
      .catch(() => {
        toast.error("Error while removing movie from favorites!", {
          position: "bottom-right",
        });
      });
  };

  if (isNotFound) return <NotFoundPage />;
  if (!movie) return <LoadingSpinner />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardMedia
          component="img"
          sx={{ objectFit: "cover" }}
          image={movie.image}
          alt={movie.title}
        />

        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {movie.title}
            </Typography>

            <IconButton onClick={handleFavoriteClick} color="error">
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ my: 2 }}>
            {movie.description}
          </Typography>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Genres
            </Typography>
            <Grid container>
              {movie.genres.map((g) => (
                <Grid size={{ xs: 2 }} key={g}>
                  <Chip label={g} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Countries
            </Typography>
            <Grid container spacing={1}>
              {movie.countriesOfOrigin.map((c) => (
                <Grid size={{ xs: 1 }} key={c}>
                  <Chip label={c} color="primary" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 3 }}>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Release Date
                </Typography>
                <Typography variant="body1">{movie.releaseDate}</Typography>
              </Grid>
              <Grid sx={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Runtime
                </Typography>
                <Typography variant="body1">
                  {movie.runtimeMinutes} min
                </Typography>
              </Grid>
              <Grid sx={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating
                </Typography>
                <Typography variant="body1">{movie.averageRating}</Typography>
              </Grid>
              <Grid sx={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Votes
                </Typography>
                <Typography variant="body1">
                  {movie.numVotes.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
