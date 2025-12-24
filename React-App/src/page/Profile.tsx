import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";
import { LoadingSpinner } from "../components/LoadingSpinner";
import api from "../api/api";
import { AxiosResponse } from "axios";

type UserDataBE = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  image: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const mapBEUserToUser = (beUser: UserDataBE): User => {
    return {
      id: beUser.id.toString(),
      firstName: beUser.first_name,
      lastName: beUser.last_name,
      email: beUser.email,
      avatarUrl: beUser.image,
      bio: beUser.bio,
      joinedDate: beUser.created_at,
    };
  };

  useEffect(() => {
    api
      .post("/auth/me")
      .then((response: AxiosResponse) => {
        setUser(mapBEUserToUser(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid>
              <Avatar
                src={`${process.env.REACT_APP_S3_URL}${user.avatarUrl}`}
                sx={{ width: 100, height: 100 }}
              >
                {!user.avatarUrl && user.firstName[0]}
              </Avatar>
            </Grid>
            <Grid>
              <Typography variant="h5" fontWeight={700}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Joined: {new Date(user.joinedDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          {user.bio && (
            <Typography variant="body1" mt={3}>
              {user.bio}
            </Typography>
          )}

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
