import { Card, CardMedia, CardContent, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardMovie } from "../types/CardMovie";

export const MovieCard = (props: CardMovie) => {
  const navigate = useNavigate();

  const getTypeFormatted = (type: string) => {
    switch (type) {
      case "movie":
        return "Movie";
      case "tvSpecial":
        return "Special";
      case "tvSeries":
        return "TV Show";
      default:
        return "Unknown";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "movie":
        return "primary";
      case "tvSpecial":
        return "secondary";
      case "tvSeries":
        return "warning";
      default:
        return "default";
    }
  };

  const doRedirect = () => {
    navigate("/" + props.id);
  };

  return (
    <>
      <Card sx={{ cursor: "pointer", height: 600 }} onClick={doRedirect}>
        <CardMedia
          component="img"
          height="400"
          sx={{ objectFit: "fill" }}
          image={props.image}
          title={props.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography pb={1}>
            <Chip
              label={getTypeFormatted(props.type)}
              color={getTypeColor(props.type)}
            />
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", textOverflow: "ellipsis" }}
          >
            {props.description}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
