import { ChangeEvent, FormEvent, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { PasswordInput } from "../components/PasswordInput";
import { EmailInput } from "../components/EmailInput";
import { TextInput } from "../components/TextInput";
import api from "../api/api";
import { AxiosError, AxiosResponse } from "axios";
import { AuthResponse } from "../types/AuthResponse";
import { useToast } from "../hooks/useToast";

type RegistrationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
};

type RegistrationBackendData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function RegistrationForm() {
  const showToast = useToast();

  const [form, setForm] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const mapFormToBackend = (
    form: RegistrationFormData
  ): RegistrationBackendData => {
    return {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
      password_confirmation: form.rePassword,
    };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post<AuthResponse>("/auth/register", mapFormToBackend(form))
      .then((response: AxiosResponse<AuthResponse>) => {
        const token = response.data.access_token;
        if (token) {
          localStorage.setItem("jwt", token);
          window.location.href = "/home";
        } else {
          console.error("Token not found", response.data);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          showToast("Invalid credentials!", "error");
        } else if (error.response?.status === 422) {
          showToast("Email already in use!", "error");
        } else {
          showToast("Something went wrong", "error");
        }
      });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={700}
            gutterBottom
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Please fill in the information to register
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <TextInput
                  value={form.firstName}
                  onChange={handleChange}
                  name="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <TextInput
                  value={form.lastName}
                  onChange={handleChange}
                  name="lastName"
                  label="Last Name"
                />
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <EmailInput value={form.email} onChange={handleChange} />
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <PasswordInput value={form.password} onChange={handleChange} />
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <PasswordInput
                  value={form.rePassword}
                  onChange={handleChange}
                  label="Re-Password"
                  name="rePassword"
                />
              </Grid>
              <Grid sx={{ xs: 12 }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
