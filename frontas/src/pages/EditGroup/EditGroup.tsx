import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

// Define the structure of the group information
interface GroupInfo {
  faculty: string;
  university: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  elder: string;
  membersCount: number;
}

// Manually set the mock group data (without URL parameter fetching)
const initialGroupData: GroupInfo = {
  faculty: 'Inžinerija ir Informatika',
  university: 'Vilniaus Universitetas',
  yearOfEntry: 2018,
  yearOfGraduation: 2022,
  elder: 'Jonas Jonaitis',
  membersCount: 24,
};

const EditGroup: React.FC = () => {
  const [formData, setFormData] = useState<GroupInfo>(initialGroupData);

  // Function to handle input changes
  const handleInputChange = (field: keyof GroupInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to save changes
  const handleSaveChanges = () => {
    console.log('Saving changes for the group');
    console.log(formData); // Implement save logic here
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
