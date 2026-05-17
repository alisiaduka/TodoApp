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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
    "linear-gradient(180deg, rgba(36,24,14,0.18), rgba(36,24,14,0.48)), url(https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Register() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDisabled = useMemo(
    () => !userName.trim() || !email.trim() || !password.trim(),
    [userName, email, password]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await Api.register(userName, email, password);
      setSuccess("Account created. You can sign in now.");
      setTimeout(() => navigate("/"), 700);
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
                <PersonAddAlt1Icon />
              </Avatar>
              <Typography variant="overline" sx={{ letterSpacing: 2.4, color: "#8c5a37" }}>
                Daily Planner
              </Typography>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Create account
              </Typography>
              <Typography sx={{ color: "rgba(56,40,26,0.75)", mb: 3 }}>
                Set up your workspace and start tracking tasks without extra clutter.
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
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
                  Create Account
                </Button>
                <Typography sx={{ textAlign: "center", color: "rgba(56,40,26,0.75)" }}>
                  Already registered?{" "}
                  <Link component={RouterLink} to="/" underline="hover" color="#8c5a37">
                    Sign in
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
