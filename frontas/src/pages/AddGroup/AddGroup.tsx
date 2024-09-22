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
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Group {
  faculty: string;
  university: string;
  yearOfEntry: string;
  yearOfGraduation: string;
  elder: string;
  memberCount: number;
}

const faculties = ['Engineering', 'Arts', 'Sciences', 'Law'];
const universities = ['Vilnius University', 'Kaunas University of Technology', 'Lithuanian University of Health Sciences'];

const AddGroupForm: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    { faculty: '', university: '', yearOfEntry: '', yearOfGraduation: '', elder: '', memberCount: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: keyof Group, value: string | number) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setGroups(newGroups);
  };

  const handleAddGroup = () => {
    setGroups([...groups, { faculty: '', university: '', yearOfEntry: '', yearOfGraduation: '', elder: '', memberCount: 0 }]);
  };

  const handleRemoveGroup = (index: number) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
  };

  const handleSave = () => {
    const hasIncompleteFields = groups.some(group => !group.faculty || !group.university || !group.yearOfEntry || !group.yearOfGraduation || !group.elder);
    if (hasIncompleteFields) {
      setError('Prašome užpildyti visus privalomus laukus.');
    } else {
      setError(null);
      console.log('Grupės išsaugotos:', groups);
      // Implement save logic here
    }
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}

      {groups.map((group, index) => (
        <Paper key={index} elevation={3} style={{ padding: 16, marginTop: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fakultetas</InputLabel>
                <Select
                  value={group.faculty}
                  onChange={(e) => handleInputChange(index, 'faculty', e.target.value)}
                  required
                >
                  {faculties.map((faculty, i) => (
                    <MenuItem key={i} value={faculty}>
                      {faculty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Universitetas</InputLabel>
                <Select
                  value={group.university}
                  onChange={(e) => handleInputChange(index, 'university', e.target.value)}
                  required
                >
                  {universities.map((university, i) => (
                    <MenuItem key={i} value={university}>
                      {university}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Įstojimo Metai"
                value={group.yearOfEntry}
                onChange={(e) => handleInputChange(index, 'yearOfEntry', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Baigimo Metai"
                value={group.yearOfGraduation}
                onChange={(e) => handleInputChange(index, 'yearOfGraduation', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grupės Seniūnas"
                value={group.elder}
                onChange={(e) => handleInputChange(index, 'elder', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Narių Skaičius"
                type="number"
                value={group.memberCount}
                onChange={(e) => handleInputChange(index, 'memberCount', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              {groups.length > 1 && (
                <IconButton
                  onClick={() => handleRemoveGroup(index)}
                  color="secondary"
                  aria-label="Pašalinti Grupę"
                >
                  <RemoveCircleOutline />
                </IconButton>
              )}
              {index === groups.length - 1 && (
                <IconButton
                  onClick={handleAddGroup}
                  color="primary"
                  aria-label="Pridėti Grupę"
                >
                  <AddCircleOutline />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
        >
          Išsaugoti
        </Button>
      </Box>
    </Container>
  );
};

export default AddGroupForm;
