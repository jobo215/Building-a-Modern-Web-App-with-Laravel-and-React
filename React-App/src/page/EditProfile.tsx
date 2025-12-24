import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AxiosError, AxiosResponse } from "axios";
import { useToast } from "../hooks/useToast";
import { User } from "../types/User";
import { LoadingSpinner } from "../components/LoadingSpinner";

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

type EditForm = {
  firstName?: string;
  lastName?: string;
  bio?: string;
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

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

  const mapUserToForm = (user: User): EditForm => {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
    };
  };

  useEffect(() => {
    api
      .post("/auth/me")
      .then((response: AxiosResponse) => {
        let user: User = mapBEUserToUser(response.data);
        setUser(user);
        setForm(mapUserToForm(user));
        if (user.avatarUrl) {
          setAvatarPreview(process.env.REACT_APP_S3_URL + user.avatarUrl);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setNewAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form) {
      const formData = new FormData();
      formData.append("first_name", form.firstName ?? "");
      formData.append("last_name", form.lastName ?? "");
      formData.append("bio", form.bio ?? "");

      if (newAvatarFile) {
        formData.append("avatar", newAvatarFile);
      }

      api
        .post("/auth/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            navigate("/me");
            showToast("Profile updated successfully!", "success");
          }
        })
        .catch((error: AxiosError) => {});
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          Edit Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={avatarPreview} sx={{ width: 80, height: 80, mr: 2 }}>
              {!avatarPreview && form && form.firstName
                ? form.firstName[0]
                : null}
            </Avatar>
            <label htmlFor="avatar-upload">
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <IconButton color="primary" component="span">
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>

          <TextField
            label="First Name"
            name="firstName"
            value={form?.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form?.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bio"
            name="bio"
            value={form?.bio}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/me")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProfile;
