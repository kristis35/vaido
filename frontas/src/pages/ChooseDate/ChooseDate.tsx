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
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
  group: string;
}

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" style={{ paddingTop: '20px' }}>
        {Object.keys(groupedUsers).map((group, index) => (
          <React.Fragment key={index}>
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              {group}
            </Typography>
            <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
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
          </React.Fragment>
        ))}
      </Container>
    </LocalizationProvider>
  );
};

export default AdminPhotoshoot;
