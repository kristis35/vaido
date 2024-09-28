import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Useris, Group } from '../../interfaces';


const GroupMembersList: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the group ID from the URL params
  const [group, setGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState<Useris[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupAndUsers = async () => {
      try {
        setLoading(true);

        // Fetch group details
        console.log(`Fetching group with ID: ${id}`); // Debugging
        const groupResponse = await axios.get(`https://localhost:44359/api/Group/get/${id}`);
        console.log('Group response:', groupResponse.data); // Debugging
        setGroup(groupResponse.data);

        // Fetch users (members) of the group
        const usersResponse = await axios.get(`https://localhost:44359/api/User/get-users-by-group/${id}`);
        console.log('Users response:', usersResponse.data); // Debugging
        setUsers(usersResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching group and users:', err);
        setError('Failed to fetch group or users. Please try again later.');
        setLoading(false);
      }
    };

    fetchGroupAndUsers();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Klaida
        </Typography>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          No group found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      {/* Display the group information */}
      <Typography variant="h4" gutterBottom>
        Grupės Informacija
      </Typography>

      {/* Categories based on the information from the group */}
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={6}>
          <Typography variant="h6">Pavadinimas:</Typography>
          <Typography>{group.pavadinimas}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Ilgas Pavadinimas:</Typography>
          <Typography>{group.ilgasPavadinimas}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Įstojimo Metai:</Typography>
          <Typography>{group.įstojimoMetai}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Baigimo Metai:</Typography>
          <Typography>{group.baigimoMetai}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Studentų Skaičius:</Typography>
          <Typography>{group.studentuSkaicius}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Grupės Seniūnas:</Typography>
          <Typography>{group.grupesSeniunas}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Fotografavimo Data ir Vieta:</Typography>
          <Typography>{group.fotografavimoDataVieta}</Typography>
        </Grid>
      </Grid>

      {/* Display the group members */}
      <Typography variant="h5" gutterBottom>
        Grupės Nariai
      </Typography>
      {users.length === 0 ? (
        <Typography>No members found for this group.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.prisijungimoVardas}</TableCell>
                  <TableCell>{user.vardas}</TableCell>
                  <TableCell>{user.pavarde}</TableCell>
                  <TableCell>{user.telefonas}</TableCell>
                  <TableCell>{user.fakultetas || 'N/A'}</TableCell>
                  <TableCell>{user.universitetas || 'N/A'}</TableCell>
                  <TableCell>{user.vartotojoRole}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default GroupMembersList;
