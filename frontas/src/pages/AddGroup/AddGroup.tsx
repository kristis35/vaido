import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Box,
} from '@mui/material';
import { Group, Useris } from '../../interfaces'; // Adjust the import path as necessary
import { getData, postData } from '../../services/api/Axios'; // Adjust the import path as necessary
import { useAuth } from '../../services/api/Context'; // Adjust the import path as necessary
import { useLocation, useNavigate } from 'react-router-dom';

const AddGroupForm: React.FC = () => {
  const { role, userId } = useAuth(); // Get role and userId from the Auth context
  const navigate = useNavigate(); // Hook to navigate to a different page

  const [group, setGroup] = useState<Group>({
    id: 0,
    pavadinimas: '',
    ilgasPavadinimas: '',
    universitetasId: 0, // Set from user data
    fakultetasId: 0,    // Set from user data
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
    grupesSeniunas: 0, // This field can now be ignored
    fotografavimoDataVieta: '',
  });

  const [existingGroup, setExistingGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  const [message, setMessage] = useState<string>(location.state?.message || '');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getData<Useris>(`/User/get-user/${userId}`);

        if (role === 'seniunas' && userData) {
          const groupData = await getData<Group>(`/Group/get-by-user/${userData.id}`);

          if (groupData) {
            setExistingGroup(groupData); // Save the existing group data if found
          } else {
            setGroup(prevGroup => ({
              ...prevGroup,
              universitetasId: userData.universitetasId, // Set from user data
              fakultetasId: userData.fakultetasId,       // Set from user data
              grupesSeniunas: userData.id,              // Set the seniunasId
            }));
          }
        }
      } catch (error) {
      }
    };

    fetchData();
  }, [role, userId]);

  const handleInputChange = (field: keyof Group, value: any) => {
    setGroup({ ...group, [field]: value });
  };

  const handleSave = async () => {
    if (existingGroup) {
      setError('Jūs jau turite priskirtą grupę.');
      return;
    }

    const trimmedPavadinimas = group.pavadinimas.trim();
    const trimmedIlgasPavadinimas = group.ilgasPavadinimas.trim();

    if (
      trimmedPavadinimas === '' ||
      trimmedIlgasPavadinimas === '' ||
      group.įstojimoMetai <= 0 ||
      group.baigimoMetai <= 0 ||
      group.universitetasId <= 0 ||  // Validate universitetasId
      group.fakultetasId <= 0 ||     // Validate fakultetasId
      group.grupesSeniunas <= 0      // Validate grupesSeniunas (seniunasId)
    ) {
      setError('Prašome užpildyti visus privalomus laukus.');
    } else {
      setError(null);
      try {
        const updatedGroup = {
          ...group,
          pavadinimas: trimmedPavadinimas,
          ilgasPavadinimas: trimmedIlgasPavadinimas,
        };

        await postData('/Group/create', updatedGroup);
        setSuccessMessage('Grupė sėkmingai išsaugota!');

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
          grupesSeniunas: 0,  // Reset the seniunasId
          fotografavimoDataVieta: '',
        });

        navigate('/adduserlist');
      } catch (error) {
        setError('Įvyko klaida bandant išsaugoti grupę.');
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
      {message && (
        <Alert severity="info" style={{ marginBottom: '16px' }}>
          {message}
        </Alert>
      )}
      {successMessage && (
        <Box marginBottom={2}>
          <Alert severity="success">{successMessage}</Alert>
        </Box>
      )}

      {existingGroup ? (
        <Box mt={4}>
          <Alert severity="info">
            Jūs jau turite priskirtą grupę: {existingGroup.pavadinimas}. Nauja grupė negali būti sukurta.
          </Alert>
        </Box>
      ) : (
        <Paper elevation={3} style={{ padding: 16, marginTop: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grupės trumpinys"
                value={group.pavadinimas}
                onChange={(e) => handleInputChange('pavadinimas', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gupės pavadinimas"
                value={group.ilgasPavadinimas}
                onChange={(e) => handleInputChange('ilgasPavadinimas', e.target.value)}
                required
              />
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
            <Grid item xs={12} sm={12}>
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
      )}

      {!existingGroup && (
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
      )}
    </Container>
  );
};

export default AddGroupForm;
