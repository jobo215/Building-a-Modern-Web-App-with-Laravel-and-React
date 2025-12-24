import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        px: 2,
      }}
    >
      <Typography variant="h1" fontWeight={700} color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/home")}
        sx={{ px: 4, py: 1.5, fontWeight: 600 }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
