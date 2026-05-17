import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Api from "../api/authApi";

const theme = createTheme({
  palette: {
    primary: { main: "#8c5a37" },
    background: { default: "#f4ede4" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
  },
});

const heroStyles = {
  backgroundImage:
    "linear-gradient(180deg, rgba(49,31,17,0.22), rgba(49,31,17,0.5)), url(https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(244,237,228,0.16), rgba(0,0,0,0))",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isDisabled = useMemo(
    () => !email.trim() || !password.trim(),
    [email, password]
  );

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await Api.login(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token);
        axios.defaults.headers.common.Authorization = `Bearer ${response.token}`;
      }

      localStorage.setItem("user_id", String(response.user.user_id));
      localStorage.setItem("user_name", response.user.user_name);
      navigate("/account");
    } catch (err: any) {
      setError(String(err));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} md={7} sx={heroStyles} />
        <Grid item xs={12} md={5} component={Paper} elevation={0} square>
          <Box
            sx={{
              minHeight: "100%",
              px: { xs: 4, sm: 8 },
              py: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle at top, rgba(199,162,120,0.2), transparent 40%), #fbf8f3",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 420 }}>
              <Avatar
                sx={{
                  mb: 2,
                  bgcolor: "#c79c6c",
                  boxShadow: "0 12px 30px rgba(140,90,55,0.2)",
                }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="overline" sx={{ letterSpacing: 2.4, color: "#8c5a37" }}>
                Daily Planner
              </Typography>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Sign in
              </Typography>
              <Typography sx={{ color: "rgba(56,40,26,0.75)", mb: 3 }}>
                Keep your tasks organized with a calmer, cleaner dashboard.
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Box component="form" noValidate onSubmit={handleLogin}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isDisabled}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  className="sign-in-btn"
                >
                  Sign In
                </Button>
                <Typography sx={{ textAlign: "center", color: "rgba(56,40,26,0.75)" }}>
                  New here?{" "}
                  <Link component={RouterLink} to="/register" underline="hover" color="#8c5a37">
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
