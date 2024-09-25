import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Faculty, University, Group, Useris } from '../../interfaces'; // Adjust the import path as necessary
import { getData, postData } from '../../services/api/Axios'; // Adjust the import path as necessary

const AddGroupForm: React.FC = () => {
  const [group, setGroup] = useState<Group>({
    id: 0,
    pavadinimas: '',
    ilgasPavadinimas: '',
    universitetasId: 0,
    fakultetasId: 0,
    įstojimoMetai: 0,
    baigimoMetai: 0,
    studentuSkaicius: 0,
    sumoketasAvansas: 0,
    apmokejimoStadija: '',
    gamybosStadija: '',
    pasleptiGrupe: false,
    pastabos: '',
    patvirtintasSarasas: false,
    balsavimasMaketai: false,
    grupesSeniunas: '',  // Changed to string
    fotografavimoDataVieta: '',
  });

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [seniunai, setSeniunai] = useState<Useris[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacultiesAndUniversitiesAndSeniunai = async () => {
      try {
        const facultyList = await getData<Faculty[]>('/Fakultetas/all');
        setFaculties(facultyList);

        const universityList = await getData<University[]>('/UniversityCrud/all');
        setUniversities(universityList);

        const seniunaiList = await getData<Useris[]>('/User/get-all-users');
        setSeniunai(seniunaiList.filter(user => user.vartotojoRole === 'seniunas'));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchFacultiesAndUniversitiesAndSeniunai();
  }, []);

  const handleInputChange = (field: keyof Group, value: any) => {
    setGroup({ ...group, [field]: value });
  };

  const handleSave = async () => {
    if (
      !group.pavadinimas ||
      !group.ilgasPavadinimas ||
      !group.universitetasId ||
      !group.fakultetasId ||
      !group.įstojimoMetai ||
      !group.baigimoMetai ||
      !group.grupesSeniunas
    ) {
      setError('Prašome užpildyti visus privalomus laukus.');
    } else {
      setError(null);
      try {
        await postData('/Group/create', group);
        setSuccessMessage('Grupė sėkmingai išsaugota!');
        console.log('Grupė išsaugota:', group);

        // Reset the form after a successful save
        setGroup({
          id: 0,
          pavadinimas: '',
          ilgasPavadinimas: '',
          universitetasId: 0,
          fakultetasId: 0,
          įstojimoMetai: 0,
          baigimoMetai: 0,
          studentuSkaicius: 0,
          sumoketasAvansas: 0,
          apmokejimoStadija: '',
          gamybosStadija: '',
          pasleptiGrupe: false,
          pastabos: '',
          patvirtintasSarasas: false,
          balsavimasMaketai: false,
          grupesSeniunas: '',
          fotografavimoDataVieta: '',
        });
      } catch (error) {
        console.error('Failed to save group:', error);
      }
    }
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Box marginBottom={2}>
          <Alert severity="success">{successMessage}</Alert>
        </Box>
      )}

      <Paper elevation={3} style={{ padding: 16, marginTop: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pavadinimas"
              value={group.pavadinimas}
              onChange={(e) => handleInputChange('pavadinimas', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ilgas Pavadinimas"
              value={group.ilgasPavadinimas}
              onChange={(e) => handleInputChange('ilgasPavadinimas', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Universitetas</InputLabel>
              <Select
                value={group.universitetasId}
                onChange={(e) => handleInputChange('universitetasId', e.target.value)}
                required
              >
                {universities.map((university) => (
                  <MenuItem key={university.id} value={university.id}>
                    {university.pavadinimas}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fakultetas</InputLabel>
              <Select
                value={group.fakultetasId}
                onChange={(e) => handleInputChange('fakultetasId', e.target.value)}
                required
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.pavadinimas}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Įstojimo Metai"
              type="number"
              value={group.įstojimoMetai}
              onChange={(e) => handleInputChange('įstojimoMetai', parseInt(e.target.value))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Baigimo Metai"
              type="number"
              value={group.baigimoMetai}
              onChange={(e) => handleInputChange('baigimoMetai', parseInt(e.target.value))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Grupės Seniūnas</InputLabel>
              <Select
                value={group.grupesSeniunas}
                onChange={(e) => handleInputChange('grupesSeniunas', e.target.value)}
                required
              >
                {seniunai.map((seniunas) => (
                  <MenuItem key={seniunas.id} value={String(seniunas.id)}>
                    {`${seniunas.vardas} ${seniunas.pavarde}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Narių Skaičius"
              type="number"
              value={group.studentuSkaicius}
              onChange={(e) => handleInputChange('studentuSkaicius', parseInt(e.target.value))}
            />
          </Grid>
        </Grid>
      </Paper>

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
