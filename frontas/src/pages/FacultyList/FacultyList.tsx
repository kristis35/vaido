import React, { useState } from 'react';
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

// Mock data for universities
interface University {
  id: number;
  name: string;
}

const mockUniversities: University[] = [
  { id: 1, name: 'Vilniaus Universitetas' },
  { id: 2, name: 'Kauno Technologijos Universitetas' },
  { id: 3, name: 'Vilniaus Gedimino Technikos Universitetas' },
];

// Mock data for faculties
interface Faculty {
  id: number;
  universityId: number;
  name: string;
}

const mockFaculties: Faculty[] = [
  { id: 1, universityId: 1, name: 'Informatikos fakultetas' },
  { id: 2, universityId: 2, name: 'Verslo administravimo fakultetas' },
  { id: 3, universityId: 3, name: 'Architektūros fakultetas' },
];

const FacultyList: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>(mockFaculties);

  const handleAddFaculty = () => {
    const newId = faculties.length + 1;
    const newFaculty: Faculty = {
      id: newId,
      universityId: 1, // Default university for new faculty
      name: `Naujas Fakultetas ${newId}`,
    };
    setFaculties([...faculties, newFaculty]);
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

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddFaculty}
        style={{ marginBottom: '20px' }}
      >
        Pridėti Fakultetą
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculties.map((faculty) => (
              <TableRow key={faculty.id}>
                <TableCell>{faculty.id}</TableCell>
                <TableCell>{faculty.name}</TableCell>
                <TableCell>
                  {
                    mockUniversities.find(
                      (university) => university.id === faculty.universityId
                    )?.name
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FacultyList;
