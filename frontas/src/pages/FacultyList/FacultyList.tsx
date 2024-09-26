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
import { Faculty, University } from '../../interfaces';

const FacultyList: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  // Fetch faculties and universities data from the API
  useEffect(() => {
    const fetchFacultiesAndUniversities = async () => {
      try {
        const facultyList = await getData<Faculty[]>('/Fakultetas/all');
        setFaculties(facultyList);

        const universityList = await getData<University[]>('/UniversityCrud/all');
        setUniversities(universityList);
      } catch (error) {
      }
    };

    fetchFacultiesAndUniversities();
  }, []);

  const handleAddFaculty = () => {
    // This function could be used to add a new faculty.
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>
            Fakultetų Sąrašas
          </Typography>
        </Grid>
      </Grid>

      {/* <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddFaculty}
        style={{ marginBottom: '20px' }}
      >
        Pridėti Fakultetą
      </Button> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fakultetas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculties.map((faculty) => (
              <TableRow key={faculty.id}>
                <TableCell>{faculty.id}</TableCell>
                <TableCell>{faculty.pavadinimas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FacultyList;
