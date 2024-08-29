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
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface GroupInfo {
  faculty: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  elder: string;
}

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
  group: string;
}

const mockGroups: Record<string, GroupInfo> = {
  'Group A': {
    faculty: 'Engineering',
    yearOfEntry: 2018,
    yearOfGraduation: 2022,
    elder: 'Jonas Jonaitis',
  },
  'Group B': {
    faculty: 'Arts',
    yearOfEntry: 2019,
    yearOfGraduation: 2023,
    elder: 'Petras Petraitis',
  },
};

const mockUsers: User[] = [
  { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija', group: 'Group A' },
  { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija', group: 'Group B' },
  { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas', group: 'Group A' },
  { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija', group: 'Group B' },
];

const groupedUsers = mockUsers.reduce<Record<string, User[]>>((acc, user) => {
  if (!acc[user.group]) {
    acc[user.group] = [];
  }
  acc[user.group].push(user);
  return acc;
}, {});

const AdminPhotoshoot: React.FC = () => {
  const navigate = useNavigate();

  const [groupDatesTimes, setGroupDatesTimes] = useState<Record<string, { date: Dayjs | null; time: Dayjs | null; location: string }>>({
    'Group A': { date: null, time: null, location: '' },
    'Group B': { date: null, time: null, location: '' },
  });

  const handleDateChange = (group: string, newValue: Dayjs | null) => {
    setGroupDatesTimes(prevState => ({
      ...prevState,
      [group]: {
        ...prevState[group],
        date: newValue,
      },
    }));
  };

  const handleTimeChange = (group: string, newValue: Dayjs | null) => {
    setGroupDatesTimes(prevState => ({
      ...prevState,
      [group]: {
        ...prevState[group],
        time: newValue,
      },
    }));
  };

  const handleLocationChange = (group: string, newValue: string) => {
    setGroupDatesTimes(prevState => ({
      ...prevState,
      [group]: {
        ...prevState[group],
        location: newValue,
      },
    }));
  };

  const handleSave = (group: string) => {
    console.log(`Group ${group} Details:`, groupDatesTimes[group]);
    // Implement save logic here for the specific group
  };

  const handleEditGroup = (group: string) => {
    navigate(`/group/${group}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        {Object.keys(groupedUsers).map((group, index) => (
          <Paper key={index} style={{ marginBottom: '20px', padding: '20px' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="h6">{group}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => handleEditGroup(group)} size="small">
                      <Edit />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle1">Fakultetas:</Typography>
                    <Typography variant="body2">{mockGroups[group].faculty}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle1">Įstojimo metai:</Typography>
                    <Typography variant="body2">{mockGroups[group].yearOfEntry}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle1">Baigimo metai:</Typography>
                    <Typography variant="body2">{mockGroups[group].yearOfGraduation}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle1">Grupės seniūnas:</Typography>
                    <Typography variant="body2">{mockGroups[group].elder}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle1">Narių skaičius:</Typography>
                    <Typography variant="body2">{groupedUsers[group].length}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <TableContainer component={Paper} style={{ marginTop: '20px', marginBottom: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vardas</TableCell>
                    <TableCell>Pavardė</TableCell>
                    <TableCell>El. paštas</TableCell>
                    <TableCell>Telefonas</TableCell>
                    <TableCell>Fraze</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedUsers[group].map((user, userIndex) => (
                    <TableRow key={userIndex}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.surname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.telephone}</TableCell>
                      <TableCell>{user.phrase}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid container spacing={2} style={{ marginTop: '10px' }}>
              <Grid item xs={4}>
                <DatePicker
                  label="Pasirinkite datą"
                  value={groupDatesTimes[group].date}
                  onChange={(newValue) => handleDateChange(group, newValue)}
                />
              </Grid>
              <Grid item xs={4}>
                <TimePicker
                  label="Pasirinkite laiką"
                  value={groupDatesTimes[group].time}
                  onChange={(newValue) => handleTimeChange(group, newValue)}
                  ampm={false} // Set to 24-hour format
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Vieta"
                  fullWidth
                  value={groupDatesTimes[group].location}
                  onChange={(e) => handleLocationChange(group, e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: '10px' }}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSave(group)}
                  fullWidth
                >
                  Išsaugoti {group} duomenis
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Container>
    </LocalizationProvider>
  );
};

export default AdminPhotoshoot;
