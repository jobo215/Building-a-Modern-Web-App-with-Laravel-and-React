import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import api from "../api/api";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import { AuthResponse } from "../types/AuthResponse";
import { useToast } from "../hooks/useToast";

type LoginFormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const showToast = useToast();

  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post<AuthResponse>(`/auth/login`, form)
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
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Please enter your email and password to log in
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <EmailInput value={form.email} onChange={handleChange} />
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <PasswordInput value={form.password} onChange={handleChange} />
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
                  Sign In
                </Button>
              </Grid>
              <Grid sx={{ xs: 12 }} textAlign="center" mt={1}>
                <Typography variant="body2">
                  Don’t have an account?{" "}
                  <Link component={RouterLink} to="/register" fontWeight={600}>
                    Register
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
