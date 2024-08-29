import React, { useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  group: string;
  photos: string[]; // Array to store the URLs of assigned photos
}

const mockUsers: User[] = [
  { id: 1, name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', group: 'Group A', photos: [] },
  { id: 2, name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', group: 'Group B', photos: [] },
  { id: 3, name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', group: 'Group A', photos: [] },
  { id: 4, name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', group: 'Group B', photos: [] },
];

interface PhotographerPortalProps {
  selectedGroup?: string;  // Make selectedGroup optional
}

const PhotographerPortal: React.FC<PhotographerPortalProps> = ({ selectedGroup = "Group A" }) => {
  const [users] = useState<User[]>(mockUsers);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const getGroupMembers = (groupName: string) => {
    return users.filter(user => user.group === groupName);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Fotografijų valdymas
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            fullWidth
          >
            Įkelti nuotraukas
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

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h6">Grupės nariai: {selectedGroup}</Typography>
            <List>
              {getGroupMembers(selectedGroup).map((user) => (
                <ListItem key={user.id} alignItems="flex-start">
                  <ListItemText
                    primary={`${user.name} ${user.surname}`}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          El. paštas: {user.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Telefonas: {user.telephone}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" style={{ marginTop: '16px' }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default PhotographerPortal;
