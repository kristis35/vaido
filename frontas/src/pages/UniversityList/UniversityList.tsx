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
import { getData } from '../../services/api/Axios'; // Import your Axios helper
import { University } from '../../interfaces';

const UniversityList: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);

  // Fetch university data from the API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universityList = await getData<University[]>('/UniversityCrud/all');
        setUniversities(universityList);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  const handleAddUniversity = () => {
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Universitetų Sąrašas
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddUniversity}
        >
          Pridėti Universitetą
        </Button> */}
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pavadinimas</TableCell>
              <TableCell>Trumpas Pavadinimas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {universities.map((university) => (
              <TableRow key={university.id}>
                <TableCell>{university.id}</TableCell>
                <TableCell>{university.pavadinimas}</TableCell>
                <TableCell>{university.trumpasPavadinimas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UniversityList;
