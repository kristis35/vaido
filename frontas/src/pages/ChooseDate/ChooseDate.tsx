import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  ListItemText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { Group } from '../../interfaces'; // Assuming Group interface is defined

const ChooseDate: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [universityName, setUniversityName] = useState<string>('');
  const [facultyName, setFacultyName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null); // Error state for form validation
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`https://localhost:44359/api/Group/get/${groupId}`);
        const groupData = response.data;
        setGroup(groupData);

        const [datePart, timePart, ...locationParts] = groupData.fotografavimoDataVieta.split(' ');
        setSelectedDate(dayjs(datePart)); // Extract date
        setSelectedTime(dayjs(timePart, 'HH:mm')); // Extract time
        setLocation(locationParts.join(' ')); // Extract location (remaining parts of the string)

        // Fetch university name
        const universityResponse = await axios.get(`https://localhost:44359/api/UniversityCrud/${groupData.universitetasId}`);
        setUniversityName(universityResponse.data.pavadinimas);

        // Fetch faculty name
        const facultyResponse = await axios.get(`https://localhost:44359/api/Fakultetas/${groupData.fakultetasId}`);
        setFacultyName(facultyResponse.data.pavadinimas);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching group, university, or faculty data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime: Dayjs | null) => {
    setSelectedTime(newTime);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  // Only validate if a value has been entered
  const validateForm = (): boolean => {
    if (selectedDate && !selectedDate.isValid()) {
      setFormError('Invalid date. Please enter a valid date.');
      return false;
    }
    if (selectedTime && !selectedTime.isValid()) {
      setFormError('Invalid time. Please enter a valid time.');
      return false;
    }

    // Clear any existing form errors
    setFormError(null);
    return true;
  };

  const handleSave = async () => {
    // Validate form data before saving
    if (!validateForm()) {
      return;
    }

    try {
      if (!groupId || !group) {
        setError('Invalid group ID or group data.');
        return;
      }

      // Prepare the updated data
      const updatedData = {
        id: groupId, // Group ID
        fotografavimoDataVieta: `${selectedDate?.format('YYYY-MM-DD')} ${selectedTime?.format('HH:mm')} ${location}`, // Date, Time, and Location
        pavadinimas: group?.pavadinimas || '', // Group name
        ilgasPavadinimas: group?.ilgasPavadinimas || '', // Long name
        universitetasId: group?.universitetasId || 0, // University ID
        fakultetasId: group?.fakultetasId || 0, // Faculty ID
        įstojimoMetai: group?.įstojimoMetai || 0, // Entry year
        baigimoMetai: group?.baigimoMetai || 0, // Graduation year
        grupesSeniunas: group.grupesSeniunas, // Group elder
        studentuSkaicius: group?.studentuSkaicius || 0, // Number of students
        pastabos: group?.pastabos || '', // Notes (required)
        gamybosStadija: group?.gamybosStadija || '', // Production stage (required)
        apmokejimoStadija: group?.apmokejimoStadija || '', // Payment stage (required),
      };

      console.log('Updated Data:', updatedData);

      // Send PUT request to update group data
      const response = await axios.put(`https://localhost:44359/api/Group/edit/${groupId}`, updatedData);

      if (response.status === 200) {
        console.log('Group data saved successfully');
        setError(null); // Clear any previous errors
      } else {
        setError('Failed to save data. Please try again.');
      }
    } catch (err: any) {
      if (err.response) {
        console.error('Error saving group data (Response):', err.response.data);
        setError(`Error: ${err.response.data.title || 'Failed to save data. Please try again.'}`);
      } else if (err.request) {
        console.error('Error saving group data (Request):', err.request);
        setError('Error: No response received from the server.');
      } else {
        console.error('Error saving group data (General):', err.message);
        setError('Error: Failed to save data due to an unknown error.');
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" style={{ paddingTop: '20px' }}>
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" style={{ paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Klaida
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" style={{ paddingTop: '20px' }}>
        {group && (
          <>
            <Typography variant="h4" gutterBottom>
              Pasirinkite Fotografavimo Datą ir Laiką
            </Typography>

            <Typography variant="h6" gutterBottom>
              Grupė: {group.pavadinimas}
            </Typography>

            {/* Displaying Group, University, Faculty, and Elder Info in a Row */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ListItemText primary="Universitetas" secondary={universityName} />
              </Grid>
              <Grid item xs={6}>
                <ListItemText primary="Fakultetas" secondary={facultyName} />
              </Grid>
              <Grid item xs={6}>
                <ListItemText primary="Grupės Seniūnas" secondary={group.grupesSeniunas} />
              </Grid>
              <Grid item xs={6}>
                <ListItemText primary="Studentų Skaičius" secondary={group.studentuSkaicius} />
              </Grid>
            </Grid>

            {/* Top-level error message */}
            {formError && (
              <Alert severity="error" style={{ marginBottom: '20px' }}>
                {formError}
              </Alert>
            )}

            {/* Date, Time, and Location Selection */}
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              <Grid item xs={4}>
                <DatePicker
                  label="Pasirinkite datą"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      error: false, // Disable inline error display
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TimePicker
                  label="Pasirinkite laiką"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  ampm={false} // 24-hour format
                  slotProps={{
                    textField: {
                      error: false, // Disable inline error display
                    },
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label="Vieta"
                  fullWidth
                  value={location}
                  onChange={handleLocationChange}
                />
              </Grid>
            </Grid>

            {/* Save Button */}
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              <Grid item xs={12}>
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
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default ChooseDate;
