import React, { useState } from 'react';
import { Avatar, Button, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from '@mui/material';
import { Navigate, useNavigate} from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../services/api/Context';
import { jwtDecode } from 'jwt-decode';

const theme = createTheme();

interface JwtPayload {
  role: 'seniunas' | 'studentas' | 'fotolaboratorija' | 'maketuotojas' | 'fotografas' | 'administratoriust' | 'super administratorius';
  exp: number;
  [key: string]: any;
}

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate(); 
  const { setRole, setUserId } = useAuth(); // Destructure setUserId from useAuth

  const handleRoleBasedRedirect = (role: JwtPayload['role']) => {
    switch (role) {
      case 'super administratorius':
      case 'administratoriust':
        navigate('/userlist');
        break;
      case 'studentas':
        console.log('Redirecting to Student dashboard');
        break;
      case 'seniunas':
        navigate("/adduserlist");
        break;
      case 'fotolaboratorija':
        console.log('Redirecting to Fotolaboratorija dashboard');
        break;
      case 'maketuotojas':
        console.log('Redirecting to Maketuotojas dashboard');
        break;
      case 'fotografas':
        console.log('Redirecting to Fotografas dashboard');
        break;
      default:
        console.log('Role not recognized');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      prisijungimoVardas: data.get('email'),
      slaptazodis: data.get('password'),
    };

    try {
      const response = await fetch('https://localhost:44359/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;
        const userId = result.userId; // Extract userId from the response

        localStorage.setItem('jwtToken', token);

        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        setRole(decodedToken.role); // Set the role in the context
        setUserId(userId); // Store the user ID in the context

        handleRoleBasedRedirect(decodedToken.role);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
