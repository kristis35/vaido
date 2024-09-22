import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
} from '@mui/material';

interface University {
  universityName: string;
}

const AddUniversity: React.FC = () => {
  const [university, setUniversity] = useState<University>({ universityName: '' });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setUniversity({ universityName: value });
  };

  const handleSave = () => {
    if (!university.universityName) {
      setError('Prašome įvesti universiteto pavadinimą.');
    } else {
      setError(null);
      console.log('University added:', university);
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
            <TextField
              fullWidth
              required
              label="Universiteto Pavadinimas"
              value={university.universityName}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
              Pridėti Universitetą
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddUniversity;
