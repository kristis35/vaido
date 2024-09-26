import React, { useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Save, ReportProblem } from '@mui/icons-material';
import { styled } from '@mui/system';

interface Student {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  group: string;
  photo: string; // URL of the photo
}

const mockStudent: Student = {
  name: 'Jonas',
  surname: 'Jonaitis',
  email: 'jonas.jonaitis@example.com',
  telephone: '+37060000000',
  group: 'Kompiuterių Mokslai 2022',
  photo: 'https://via.placeholder.com/200', // Placeholder image URL
};

const VignetteImage = styled('img')(
  () => ({
    transition: 'all 0.3s ease-in-out',
    width: '100%', // Make image responsive
    maxWidth: '250px',
    height: 'auto',
    borderRadius: '8px', // Add slight rounding to soften look
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for better visibility
  })
);

const ProofreadDetails: React.FC = () => {
  const [student, setStudent] = useState<Student>(mockStudent);
  const [selectedPortraitOption, setSelectedPortraitOption] = useState<string>('none');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [vignetteChecked, setVignetteChecked] = useState<boolean>(false);

  const handleSaveSelection = () => {
    // Implement save logic here
  };

  const handleChange = (field: keyof Student, value: string) => {
    setStudent((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleReportIssue = () => {
    // Implement reporting logic here
  };

  const handlePortraitOptionChange = (event: SelectChangeEvent<string>) => {
    setSelectedPortraitOption(event.target.value);
  };

  const handleVignetteCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVignetteChecked(event.target.checked);
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Peržiūrėti ir redaguoti duomenis
      </Typography>

      <Paper sx={{ padding: '20px', marginBottom: '30px', borderRadius: '12px' }}>
        <Grid container spacing={4}>
          {/* Form Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Jūsų duomenys
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Vardas"
                    value={student.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Vardas:</strong> {student.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Pavardė"
                    value={student.surname}
                    onChange={(e) => handleChange('surname', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Pavardė:</strong> {student.surname}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="El. paštas"
                    value={student.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>El. paštas:</strong> {student.email}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Telefonas"
                    value={student.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Telefonas:</strong> {student.telephone}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Grupė:</strong> {student.group}
                </Typography>
              </Grid>
            </Grid>

            {/* Vignette Checkbox (moved above) */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={vignetteChecked}
                  onChange={handleVignetteCheckboxChange}
                />
              }
              label="Pridėti vinjetę"
              sx={{ marginTop: '20px' }}
            />

            {/* Portrait Options (moved below) */}
            <Paper sx={{ padding: '10px', marginTop: '10px', borderRadius: '8px' }}>
              <Typography variant="h6" gutterBottom>
              Galite papildomai įsigyti savo portretinę nuotrauką:
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Portreto formatas</InputLabel>
                <Select
                  value={selectedPortraitOption}
                  onChange={handlePortraitOptionChange}
                  label="Portreto formatas"
                >
                  <MenuItem value="none">Be papildomo portreto</MenuItem>
                  <MenuItem value="hqJpg">Aukštos kokybės JPG formatas (2 eurai)</MenuItem>
                  <MenuItem value="4portrets">4 portretai puslapyje (2 eurai)</MenuItem>
                  <MenuItem value="8portrets">8 portretai puslapyje (2.5 eurai)</MenuItem>
                  <MenuItem value="4withJpg">4 portretai su JPG (3 eurai)</MenuItem>
                  <MenuItem value="8withJpg">8 portretai su JPG (4 eurai)</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Action Buttons */}
            <Grid container spacing={2} justifyContent="flex-start" sx={{ marginTop: '30px' }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSaveSelection}
                >
                  Išsaugoti
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<ReportProblem />}
                  onClick={handleReportIssue}
                >
                  Pranešti apie klaidą
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Profile Photo */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <VignetteImage
                src={student.photo}
                alt="Student Photo"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProofreadDetails;
