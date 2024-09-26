import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface Faculty {
  university: string;
  facultyName: string;
}

const universities = ['Vilniaus Universitetas', 'Kauno Technologijos Universitetas', 'Lietuvos Sveikatos Mokslų Universitetas'];

const AddFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty>({ university: '', facultyName: '' });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof Faculty, value: string) => {
    setFaculty((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!faculty.university || !faculty.facultyName) {
      setError('Prašome užpildyti visus privalomus laukus.');
    } else {
      setError(null);
      // Implement save logic here
    }
  };

  return (
    <Container maxWidth="sm" style={{ paddingTop: '20px' }}>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        {error && (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Universitetas</InputLabel>
              <Select
                value={faculty.university}
                onChange={(e: SelectChangeEvent) => handleInputChange('university', e.target.value)}
                label="Universitetas"
              >
                {universities.map((uni, i) => (
                  <MenuItem key={i} value={uni}>
                    {uni}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Fakulteto Pavadinimas"
              value={faculty.facultyName}
              onChange={(e) => handleInputChange('facultyName', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
              Pridėti Fakultetą
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddFaculty;
