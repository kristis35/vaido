import React, { useState } from 'react';
import { Avatar, Button, TextField, Typography, Box, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/api/Context';
import { jwtDecode } from 'jwt-decode';
import { postData } from '../../services/api/Axios'; // Make sure to adjust the import path

const theme = createTheme();

interface JwtPayload {
  role: 'seniunas' | 'studentas' | 'fotolaboratorija' | 'maketuotojas' | 'fotografas' | 'administratoriust' | 'super administratorius';
  exp: number;
  [key: string]: any;
}

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setRole, setUserId } = useAuth();

  const handleRoleBasedRedirect = (role: JwtPayload['role']) => {
    switch (role) {
      case 'super administratorius':
      case 'administratoriust':
        navigate('/userlist');
        break;
      case 'studentas':
        break;
      case 'seniunas':
        navigate("/addgroup");
        break;
      case 'fotolaboratorija':
        break;
      case 'maketuotojas':
        break;
      case 'fotografas':
        break;
      default:
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
      const result = await postData<{ token: string, userId: string }>('http://vinjetes.lt/api/Auth/login', loginData);
      // const result = await postData<{ token: string, userId: string }>('https://localhost:44359/api/Auth/login', loginData);
      const token = result.token;
      const userId = result.userId;

      localStorage.setItem('jwtToken', token);

      const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
      setRole(decodedToken.role);
      setUserId(Number(userId)); 

      handleRoleBasedRedirect(decodedToken.role);
    } catch (error) {
      setErrorMessage('Neteisingas el paštas arba prisijungimo vardas');
      setTimeout(() => setErrorMessage(null), 3000);
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
            Prisijungti
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
              label="El. paštas"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Slaptažodis"
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
              Prisijungti
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
