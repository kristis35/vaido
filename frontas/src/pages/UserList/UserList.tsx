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
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook from React Router
import { getData } from '../../services/api/Axios'; // Import the axios helper function for GET requests

interface User {
  id: number;
  prisijungimoVardas: string;
  vardas: string;
  pavarde: string;
  telefonas: string;
  fakultetas: string | null;
  universitetas: string | null;
  vartotojoRole: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Fetch users from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const userList = await getData<User[]>('/user/get-all-users');
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
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={handleAddUserClick}>
          Pridėti Vartotoją
        </Button>
      </Box>
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
