import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Group } from '../../interfaces'; // Assuming Group interface is correctly defined

const PhotoUpload: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    // Fetch the group data using the groupId from the URL
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`https://localhost:44359/api/Group/get/${groupId}`);
        setGroup(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to fetch group data. Please try again later.');
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPhotos(Array.from(files));
    }
  };

  const handleSavePhotos = () => {
    // Logic to save the uploaded photos for the group
    console.log('Saving photos for group:', groupId);
    console.log('Uploaded photos:', photos);
    // Implement save logic here
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
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      {group && (
        <>
          <Typography variant="h4" gutterBottom>
            Nuotraukų Įkėlimas grupei: {group.pavadinimas}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Grupės seniūnas: {group.grupesSeniunas}
          </Typography>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                fullWidth
              >
                Pasirinkite nuotraukas
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handlePictureUpload}
                />
              </Button>
            </Grid>
          </Grid>

          <Box mt={2}>
            <Typography variant="body1">
              Pasirinktos nuotraukos: {photos.length}
            </Typography>
            {photos.length > 0 && (
              <ul>
                {photos.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </Box>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSavePhotos}
                fullWidth
              >
                Išsaugoti Nuotraukas
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default PhotoUpload;
