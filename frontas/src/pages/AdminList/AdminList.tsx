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
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Edit, GetApp, CalendarToday, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
}

interface PhotoshootInfo {
  groupName: string;
  location: string;
  date: string;
  time: string;
  faculty: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  university: string;
  elder: string;
  orderStatus: string;
  members: User[];
}

const mockPhotoshootData: PhotoshootInfo[] = [
  {
    groupName: 'Kompiuterių Mokslai 2022',
    location: 'Studija 1',
    date: '2024-08-30',
    time: '10:00',
    faculty: 'Inžinerija ir Informatika',
    yearOfEntry: 2018,
    yearOfGraduation: 2022,
    university: 'Vilniaus Universitetas',
    elder: 'Jonas Jonaitis',
    orderStatus: 'Patvirtinta',
    members: [
      { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija' },
      { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas' },
    ],
  },
  {
    groupName: 'Menas ir Dizainas 2023',
    location: 'Lauko Parkas',
    date: '2024-08-31',
    time: '14:00',
    faculty: 'Menai',
    yearOfEntry: 2019,
    yearOfGraduation: 2023,
    university: 'Kauno Technologijos Universitetas',
    elder: 'Petras Petraitis',
    orderStatus: 'Vyksta',
    members: [
      { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija' },
      { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija' },
    ],
  },
];

const AdminView: React.FC = () => {
  const [photoshootData, setPhotoshootData] = useState<PhotoshootInfo[]>(mockPhotoshootData);
  const [openAddGroupDialog, setOpenAddGroupDialog] = useState(false);
  const [newGroup, setNewGroup] = useState<PhotoshootInfo>({
    groupName: '',
    location: '',
    date: '',
    time: '',
    faculty: '',
    yearOfEntry: 2020,
    yearOfGraduation: 2024,
    university: '',
    elder: '',
    orderStatus: 'Naujas',
    members: [],
  });

  const navigate = useNavigate();

  const handleDownload = (groupName: string, members: User[]) => {
    const wsData = [
      ['Vardas', 'Pavardė', 'El. paštas', 'Telefonas', 'Fraze'],
      ...members.map((member) => [
        member.name,
        member.surname,
        member.email,
        member.telephone,
        member.phrase,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, groupName);

    XLSX.writeFile(workbook, `${groupName}_nariai.xlsx`);
  };

  const handleEditGroup = (groupName: string) => {
    navigate(`/edit-group/${groupName}`);
  };

  const handleChooseDate = (groupName: string) => {
    navigate(`/choosedate/${groupName}`);
  };

  const handleAddGroup = () => {
    setPhotoshootData([...photoshootData, newGroup]);
    setOpenAddGroupDialog(false);
  };

  const handleRemoveGroup = (groupName: string) => {
    const updatedData = photoshootData.filter((group) => group.groupName !== groupName);
    setPhotoshootData(updatedData);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes to the server or database:');
    console.log(photoshootData); // This is where you would send the data to your backend API
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Grupės Valdymas
      </Typography>

      {/* Add Group Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddGroupDialog(true)}
        style={{ marginBottom: '20px' }}
      >
        Pridėti Naują Grupę
      </Button>

      {/* Save Changes Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSaveChanges}
        style={{ marginBottom: '20px', marginLeft: '20px' }}
      >
        Išsaugoti Pakeitimus
      </Button>

      {/* Table displaying the groups */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Grupė</TableCell>
              <TableCell>Data ir Laikas</TableCell>
              <TableCell>Vieta</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell>Įstojimo/Baigimo Metai</TableCell>
              <TableCell>Grupės Seniūnas / Narių Skaičius</TableCell>
              <TableCell>Užsakymo Statusas</TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {photoshootData.map((photoshoot, index) => (
              <TableRow key={index}>
                <TableCell>{photoshoot.groupName}</TableCell>
                <TableCell>
                  {photoshoot.date} {photoshoot.time}
                </TableCell>
                <TableCell>{photoshoot.location}</TableCell>
                <TableCell>{photoshoot.faculty}</TableCell>
                <TableCell>{photoshoot.university}</TableCell>
                <TableCell>
                  {photoshoot.yearOfEntry} / {photoshoot.yearOfGraduation}
                </TableCell>
                <TableCell>
                  {photoshoot.elder} / {photoshoot.members.length} nariai
                </TableCell>
                <TableCell>{photoshoot.orderStatus}</TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item>
                      <IconButton onClick={() => handleEditGroup(photoshoot.groupName)}>
                        <Edit />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleChooseDate(photoshoot.groupName)}>
                        <CalendarToday />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleDownload(photoshoot.groupName, photoshoot.members)}>
                        <GetApp />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleRemoveGroup(photoshoot.groupName)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Group Dialog */}
      <Dialog open={openAddGroupDialog} onClose={() => setOpenAddGroupDialog(false)}>
        <DialogTitle>Pridėti Naują Grupę</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Grupės Pavadinimas"
            margin="normal"
            value={newGroup.groupName}
            onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
          />
          <TextField
            fullWidth
            label="Vieta"
            margin="normal"
            value={newGroup.location}
            onChange={(e) => setNewGroup({ ...newGroup, location: e.target.value })}
          />
          <TextField
            fullWidth
            label="Data"
            margin="normal"
            value={newGroup.date}
            onChange={(e) => setNewGroup({ ...newGroup, date: e.target.value })}
          />
          <TextField
            fullWidth
            label="Laikas"
            margin="normal"
            value={newGroup.time}
            onChange={(e) => setNewGroup({ ...newGroup, time: e.target.value })}
          />
          <TextField
            fullWidth
            label="Fakultetas"
            margin="normal"
            value={newGroup.faculty}
            onChange={(e) => setNewGroup({ ...newGroup, faculty: e.target.value })}
          />
          <TextField
            fullWidth
            label="Universitetas"
            margin="normal"
            value={newGroup.university}
            onChange={(e) => setNewGroup({ ...newGroup, university: e.target.value })}
          />
          <TextField
            fullWidth
            label="Grupės Seniūnas"
            margin="normal"
            value={newGroup.elder}
            onChange={(e) => setNewGroup({ ...newGroup, elder: e.target.value })}
          />
          <TextField
            fullWidth
            label="Įstojimo Metai"
            margin="normal"
            type="number"
            value={newGroup.yearOfEntry}
            onChange={(e) => setNewGroup({ ...newGroup, yearOfEntry: parseInt(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Baigimo Metai"
            margin="normal"
            type="number"
            value={newGroup.yearOfGraduation}
            onChange={(e) => setNewGroup({ ...newGroup, yearOfGraduation: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddGroupDialog(false)} color="secondary">
            Atšaukti
          </Button>
          <Button onClick={handleAddGroup} color="primary">
            Pridėti
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminView;
