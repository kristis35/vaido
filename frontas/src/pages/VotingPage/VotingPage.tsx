import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';

// Išplėsti fonų duomenis
const backgrounds = [
  { id: 1, image: 'https://via.placeholder.com/200', description: 'Fonas 1' },
  { id: 2, image: 'https://via.placeholder.com/200', description: 'Fonas 2' },
  { id: 3, image: 'https://via.placeholder.com/200', description: 'Fonas 3' },
  { id: 4, image: 'https://via.placeholder.com/200', description: 'Fonas 4' },
  { id: 5, image: 'https://via.placeholder.com/200', description: 'Fonas 5' },
  { id: 6, image: 'https://via.placeholder.com/200', description: 'Fonas 6' },
  { id: 7, image: 'https://via.placeholder.com/200', description: 'Fonas 7' },
  { id: 8, image: 'https://via.placeholder.com/200', description: 'Fonas 8' },
  { id: 9, image: 'https://via.placeholder.com/200', description: 'Fonas 9' },
];

const PointsAllocation: React.FC = () => {
  const [selectedPoints, setSelectedPoints] = useState<{ [key: number]: number | null }>({});
  const [error, setError] = useState<string | null>(null);

  // Funkcija taškų paskirstymui
  const handlePointChange = (backgroundId: number, points: number) => {
    const alreadySelectedPoints = Object.values(selectedPoints);
    
    // Patikrinkite, ar taškas jau priskirtas kitam fonui
    if (alreadySelectedPoints.includes(points)) {
      setError(`Jūs jau priskyrėte ${points} tašką(-us) kitam fonui.`);
      return;
    }
    
    // Išvalyti ankstesnes klaidas ir atnaujinti taškus
    setError(null);
    setSelectedPoints((prev) => ({ ...prev, [backgroundId]: points }));
  };

  // Funkcija taškams išsaugoti
  const handleSave = () => {
    const pointsArray = Object.values(selectedPoints);
    if (pointsArray.length !== 3 || !pointsArray.includes(1) || !pointsArray.includes(2) || !pointsArray.includes(3)) {
      setError('Prašome paskirstyti 3, 2 ir 1 tašką skirtingiems fonams.');
      return;
    }
    setError(null);
    // Čia galite išsaugoti taškus ar išsiųsti į serverį
    alert('Taškai sėkmingai paskirstyti!');
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Priskirkite taškus fonams
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {backgrounds.map((background) => (
          <Grid item xs={12} sm={6} md={4} key={background.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={background.image}
                alt={background.description}
              />
              <CardContent>
                <Typography variant="h6">{background.description}</Typography>
              </CardContent>
              <CardActions>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="points"
                    value={selectedPoints[background.id] || ''}
                    onChange={(e) => handlePointChange(background.id, parseInt(e.target.value))}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="1 Taškas" />
                    <FormControlLabel value="2" control={<Radio />} label="2 Taškai" />
                    <FormControlLabel value="3" control={<Radio />} label="3 Taškai" />
                  </RadioGroup>
                </FormControl>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '5px' }}
        onClick={handleSave}
      >
        Išsaugoti
      </Button>
    </Container>
  );
};

export default PointsAllocation;
