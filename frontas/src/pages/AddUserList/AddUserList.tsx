import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Alert,
  Box,
  Typography, // Importing Typography
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, UploadFile, Download } from '@mui/icons-material';

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
}

const AddUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { name: '', surname: '', email: '', telephone: '', phrase: '' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [name]: value };
    setUsers(newUsers);
  };

  const handleAddUser = () => {
    setUsers([...users, { name: '', surname: '', email: '', telephone: '', phrase: '' }]);
  };

  const handleRemoveUser = (index: number) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const handleUploadExcel = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = (event.type === 'drop') 
      ? (event as React.DragEvent<HTMLDivElement>).dataTransfer.files[0] 
      : (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // Replace with actual logic to process the uploaded Excel file
        console.log('Excel failas įkeltas:', data);
        // Process the Excel file content and update users state accordingly
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleSave = () => {
    const hasIncompleteEmails = users.some(user => !user.email);
    if (hasIncompleteEmails) {
      setError('Kai kurie vartotojai turi neužpildytus el. pašto adresus. Prašome juos pataisyti prieš tvirtinant.');
    } else {
      setError(null);
      console.log('Vartotojai išsaugoti:', users);
      // Implement save logic here
    }
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUploadExcel}
            sx={{
              border: isDragActive ? '2px dashed #1976d2' : 'none',
              borderRadius: '4px',
              padding: isDragActive ? '20px' : '0',
              backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
              textAlign: 'center',
            }}
          >
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
              fullWidth
            >
              Įkelti Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={handleUploadExcel}
              />
            </Button>
            {isDragActive && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Numeskite failą čia
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Download />}
            fullWidth
            href="/Sarasas.xlsx"
            download="Vartotojų_Šablonas.xlsx"
          >
            Atsisiųsti šabloną
          </Button>
        </Grid>
        <Grid item xs={4}>
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
      {error && (
        <Alert severity="error" style={{ marginTop: '16px' }}>
          {error}
        </Alert>
      )}
      {users.map((user, index) => (
        <Paper key={index} elevation={3} style={{ padding: 16, marginTop: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Vardas"
                name="name"
                value={user.name}
                onChange={(event) => handleInputChange(index, event)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pavardė"
                name="surname"
                value={user.surname}
                onChange={(event) => handleInputChange(index, event)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="El. paštas"
                name="email"
                value={user.email}
                onChange={(event) => handleInputChange(index, event)}
                error={!user.email}
                helperText={!user.email && "El. paštas yra privalomas"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Telefonas"
                name="telephone"
                value={user.telephone}
                onChange={(event) => handleInputChange(index, event)}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Fraze"
                name="phrase"
                value={user.phrase}
                onChange={(event) => handleInputChange(index, event)}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              {users.length > 1 && (
                <IconButton
                  onClick={() => handleRemoveUser(index)}
                  color="secondary"
                  aria-label="pašalinti vartotoją"
                >
                  <RemoveCircleOutline />
                </IconButton>
              )}
              {index === users.length - 1 && (
                <IconButton
                  onClick={handleAddUser}
                  color="primary"
                  aria-label="pridėti vartotoją"
                >
                  <AddCircleOutline />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
};

export default AddUserList;
