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
  MenuItem,
  Select,
  SelectChangeEvent,
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

interface GroupInfo {
  name: string;
  location: string;
  date: Dayjs | null;
  time: Dayjs | null;
  members: User[];
}

const mockGroups: GroupInfo[] = [
  {
    name: 'Kompiuterių Mokslai 2022',
    location: 'Studija 1',
    date: dayjs('2024-08-30'),
    time: dayjs('10:00', 'HH:mm'),
    members: [
      { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija', group: 'Kompiuterių Mokslai 2022' },
      { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas', group: 'Kompiuterių Mokslai 2022' },
    ],
  },
  {
    name: 'Menas ir Dizainas 2023',
    location: 'Lauko Parkas',
    date: dayjs('2024-08-31'),
    time: dayjs('14:00', 'HH:mm'),
    members: [
      { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija', group: 'Menas ir Dizainas 2023' },
      { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija', group: 'Menas ir Dizainas 2023' },
    ],
  },
];

const ChooseDate: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>(mockGroups[0].name);
  const [groupData, setGroupData] = useState<GroupInfo>(mockGroups[0]);

  const handleGroupChange = (event: SelectChangeEvent) => {
    const groupName = event.target.value;
    const groupInfo = mockGroups.find((group) => group.name === groupName);
    if (groupInfo) {
      setSelectedGroup(groupName);
      setGroupData(groupInfo);
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setGroupData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  const handleTimeChange = (newTime: Dayjs | null) => {
    setGroupData((prev) => ({
      ...prev,
      time: newTime,
    }));
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupData((prev) => ({
      ...prev,
      location: event.target.value,
    }));
  };

  const handleSave = () => {
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" style={{ paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Grupės Datos Pasirinkimas
        </Typography>

        {/* Group Selection */}
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid item xs={12}>
            <Select
              fullWidth
              value={selectedGroup}
              onChange={handleGroupChange}
              variant="outlined"
            >
              {mockGroups.map((group) => (
                <MenuItem key={group.name} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        {/* Group Information */}
        <Typography variant="h6">{groupData.name}</Typography>
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
              {groupData.members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.surname}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.telephone}</TableCell>
                  <TableCell>{member.phrase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Date and Time Selection */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <DatePicker
              label="Pasirinkite datą"
              value={groupData.date}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TimePicker
              label="Pasirinkite laiką"
              value={groupData.time}
              onChange={handleTimeChange}
              ampm={false} // 24-hour format
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Vieta"
              fullWidth
              value={groupData.location}
              onChange={handleLocationChange}
            />
          </Grid>
        </Grid>

        {/* Save Button */}
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
            >
              Išsaugoti
            </Button>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default ChooseDate;
