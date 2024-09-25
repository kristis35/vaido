import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  Box,
  Typography,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook from React Router
import { getData } from '../../services/api/Axios'; // Import the axios helper function for GET requests
import { Useris } from '../../interfaces';
const UserList: React.FC = () => {
  const [users, setUsers] = useState<Useris[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Fetch users from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const userList = await getData<Useris[]>('/user/get-all-users');
        setUsers(userList);
      } catch (error) {
        console.error('Nepavyko gauti vartotojų sąrašo:', error);
        setError('Nepavyko gauti vartotojų sąrašo. Bandykite dar kartą.');
      }
    };

    fetchUsers();
  }, []);

  const handleAddUserClick = () => {
    navigate('/addmaster');
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Vartotoju Sąrašas
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddUserClick}>
          Pridėti Vartotoją
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prisijungimo Vardas</TableCell>
              <TableCell>Vardas</TableCell>
              <TableCell>Pavardė</TableCell>
              <TableCell>Telefonas</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell>Vartotojo Rolė</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.prisijungimoVardas}</TableCell>
                <TableCell>{user.vardas}</TableCell>
                <TableCell>{user.pavarde}</TableCell>
                <TableCell>{user.telefonas}</TableCell>
                <TableCell>{user.fakultetas || 'Nėra'}</TableCell>
                <TableCell>{user.universitetas || 'Nėra'}</TableCell>
                <TableCell>{user.vartotojoRole}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserList;
