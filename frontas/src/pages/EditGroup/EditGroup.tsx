import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import * as XLSX from 'xlsx';

// Define the structure of the group information
interface GroupInfo {
  faculty: string;
  university: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  elder: string;
  membersCount: number;
}

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
}

// Mock initial group data
const initialGroupData: GroupInfo = {
  faculty: 'Inžinerija ir Informatika',
  university: 'Vilniaus Universitetas',
  yearOfEntry: 2018,
  yearOfGraduation: 2022,
  elder: 'Jonas Jonaitis',
  membersCount: 24,
};

// Mock user list
const initialUsers: User[] = [
  { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija' },
  { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000001', phrase: 'Portretas' },
];

const EditGroup: React.FC = () => {
  const [formData, setFormData] = useState<GroupInfo>(initialGroupData);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track which user is being edited
  const [currentUser, setCurrentUser] = useState<User>({ name: '', surname: '', email: '', telephone: '', phrase: '' });

  // Function to handle input changes for the group form
  const handleInputChange = (field: keyof GroupInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to handle input changes for user information
  const handleUserInputChange = (field: keyof User, value: string) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }));
  };

  // Function to add or edit users
  const handleAddOrEditUser = () => {
    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = currentUser;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      setUsers([...users, currentUser]);
    }
    setCurrentUser({ name: '', surname: '', email: '', telephone: '', phrase: '' });
  };

  // Function to handle editing a user
  const handleEditUser = (index: number) => {
    setEditIndex(index);
    setCurrentUser(users[index]);
  };

  // Function to handle deleting a user
  const handleDeleteUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  // Function to download Excel template
  const handleDownloadTemplate = () => {
    const wsData = [['Name', 'Surname', 'Email', 'Telephone', 'Phrase']];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'UserTemplate.xlsx');
  };

  // Function to handle file upload and import users
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        const importedUsers = data.slice(1).map((row) => ({
          name: row[0] || '',
          surname: row[1] || '',
          email: row[2] || '',
          telephone: row[3] || '',
          phrase: row[4] || '',
        }));
        setUsers([...users, ...importedUsers]);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Function to save changes to the group
  const handleSaveChanges = () => {
    console.log('Saving changes for the group');
    console.log(formData);
    console.log(users);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Redaguoti Grupės Informaciją
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fakultetas"
              fullWidth
              value={formData.faculty}
              onChange={(e) => handleInputChange('faculty', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Universitetas"
              fullWidth
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Įstojimo metai"
              fullWidth
              type="number"
              value={formData.yearOfEntry}
              onChange={(e) => handleInputChange('yearOfEntry', parseInt(e.target.value))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Baigimo metai"
              fullWidth
              type="number"
              value={formData.yearOfGraduation}
              onChange={(e) => handleInputChange('yearOfGraduation', parseInt(e.target.value))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Grupės Seniūnas"
              fullWidth
              value={formData.elder}
              onChange={(e) => handleInputChange('elder', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Narių Skaičius"
              fullWidth
              type="number"
              value={formData.membersCount}
              onChange={(e) => handleInputChange('membersCount', parseInt(e.target.value))}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Narių Sąrašas
        </Typography>

        {/* User Table */}
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vardas</TableCell>
                <TableCell>Pavardė</TableCell>
                <TableCell>El. paštas</TableCell>
                <TableCell>Telefonas</TableCell>
                <TableCell>Fraze</TableCell>
                <TableCell>Veiksmai</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>{user.phrase}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditUser(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit User Form */}
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vardas"
              fullWidth
              value={currentUser.name}
              onChange={(e) => handleUserInputChange('name', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pavardė"
              fullWidth
              value={currentUser.surname}
              onChange={(e) => handleUserInputChange('surname', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="El. paštas"
              fullWidth
              value={currentUser.email}
              onChange={(e) => handleUserInputChange('email', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefonas"
              fullWidth
              value={currentUser.telephone}
              onChange={(e) => handleUserInputChange('telephone', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fraze"
              fullWidth
              value={currentUser.phrase}
              onChange={(e) => handleUserInputChange('phrase', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddOrEditUser}
              startIcon={<Add />}
              fullWidth
            >
              {editIndex !== null ? 'Atnaujinti Vartotoją' : 'Pridėti Vartotoją'}
            </Button>
          </Grid>
        </Grid>

        {/* File Upload and Template Download */}
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" color="primary" fullWidth onClick={handleDownloadTemplate}>
              Atsisiųsti Excel Šabloną
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth>
              Įkelti Excel Failą
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" style={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Išsaugoti Pakeitimus
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EditGroup;
