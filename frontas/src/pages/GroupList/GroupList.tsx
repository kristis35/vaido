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
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { getData } from '../../services/api/Axios';
import { useNavigate } from 'react-router-dom'; 
import { Group, University } from '../../interfaces';




const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getData<Group[]>('/Group/get-all');
        setGroups(response);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const universityList = await getData<University[]>('/UniversityCrud/all');
        setUniversities(universityList);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
      }
    };

    fetchGroups();
    fetchUniversities();
  }, []);

  const handleAddGroup = () => {
    navigate('/addgroup'); // Navigate to the AddGroup page
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>
            Grupės Sąrašas
          </Typography>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddGroup}
        style={{ marginBottom: '20px' }}
      >
        Pridėti Grupę
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Grupė</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell>Įstojimo Metai</TableCell>
              <TableCell>Baigimo Metai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.pavadinimas}</TableCell>
                <TableCell>{group.ilgasPavadinimas}</TableCell>
                <TableCell>
                  {universities.find(
                    (university) => university.id === group.universitetasId
                  )?.pavadinimas}
                </TableCell>
                <TableCell>{group.įstojimoMetai}</TableCell>
                <TableCell>{group.baigimoMetai}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default GroupList;
