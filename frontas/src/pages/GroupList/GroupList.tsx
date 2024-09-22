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

// Mock data for groups
interface Group {
  id: number;
  universityId: number;
  faculty: string;
  name: string;
  yearOfEntry: number;
  yearOfGraduation: number;
}

const mockGroups: Group[] = [
  { id: 1, universityId: 1, faculty: 'Informatikos fakultetas', name: 'Kompiuterių Mokslai', yearOfEntry: 2018, yearOfGraduation: 2022 },
  { id: 2, universityId: 2, faculty: 'Verslo administravimo fakultetas', name: 'Verslo Administravimas', yearOfEntry: 2019, yearOfGraduation: 2023 },
  { id: 3, universityId: 3, faculty: 'Architektūros fakultetas', name: 'Architektūra', yearOfEntry: 2020, yearOfGraduation: 2024 },
];

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(mockGroups);

  const handleAddGroup = () => {
    const newId = groups.length + 1;
    const newGroup: Group = {
      id: newId,
      universityId: 1, // Default university for new group
      faculty: 'Naujas fakultetas',
      name: `Nauja Grupė ${newId}`,
      yearOfEntry: 2021,
      yearOfGraduation: 2025,
    };
    setGroups([...groups, newGroup]);
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
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.faculty}</TableCell>
                <TableCell>
                  {mockUniversities.find(
                    (university) => university.id === group.universityId
                  )?.name}
                </TableCell>
                <TableCell>{group.yearOfEntry}</TableCell>
                <TableCell>{group.yearOfGraduation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default GroupList;
