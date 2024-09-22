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

const UniversityList: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>(mockUniversities);

  const handleAddUniversity = () => {
    const newId = universities.length + 1;
    const newUniversity: University = { id: newId, name: `Naujas Universitetas ${newId}` };
    setUniversities([...universities, newUniversity]);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Universitetų Sąrašas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddUniversity}
        >
          Pridėti Universitetą
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pavadinimas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {universities.map((university) => (
              <TableRow key={university.id}>
                <TableCell>{university.id}</TableCell>
                <TableCell>{university.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UniversityList;