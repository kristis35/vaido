import React from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import { GetApp, Save, Collections } from '@mui/icons-material';
import JSZip from 'jszip';

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
  group: string;
  photo: string; // URL of the photo
}

interface GroupInfo {
  groupName: string;
  faculty: string;
  university: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  elder: string;
  members: User[];
}

const mockGroupData: GroupInfo[] = [
  {
    groupName: 'Kompiuterių Mokslai 2022',
    faculty: 'Inžinerija ir Informatika',
    university: 'Vilniaus Universitetas',
    yearOfEntry: 2018,
    yearOfGraduation: 2022,
    elder: 'Jonas Jonaitis',
    members: [
      { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija', group: 'Kompiuterių Mokslai 2022', photo: 'https://via.placeholder.com/150' },
      { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas', group: 'Kompiuterių Mokslai 2022', photo: 'https://via.placeholder.com/150' },
    ],
  },
  {
    groupName: 'Menas ir Dizainas 2023',
    faculty: 'Menai',
    university: 'Kauno Technologijos Universitetas',
    yearOfEntry: 2019,
    yearOfGraduation: 2023,
    elder: 'Petras Petraitis',
    members: [
      { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija', group: 'Menas ir Dizainas 2023', photo: 'https://via.placeholder.com/150' },
      { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija', group: 'Menas ir Dizainas 2023', photo: 'https://via.placeholder.com/150' },
    ],
  },
];

const PhotoEditor: React.FC = () => {
  const handleDownloadAllPhotos = (groupName: string, members: User[]) => {
    const zip = new JSZip();
    const folder = zip.folder(groupName);

    if (folder) {
      members.forEach((member, index) => {
        const photoName = `${member.name}_${member.surname}.jpg`;
        folder.file(photoName, fetch(member.photo).then(res => res.blob()));
      });

      zip.generateAsync({ type: 'blob' }).then(content => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${groupName}_photos.zip`;
        a.click();
      });
    }
  };

  const handleDownloadLayout = (groupName: string) => {
    // Implement logic to download group photo layout
  };

  const handleSaveVignette = (groupName: string) => {
    // Implement logic to save the vignette for the group
  };

  const handleCompleteOrder = (groupName: string) => {
    // Implement logic to complete the order for the specific group
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      {mockGroupData.map((group, index) => (
        <Paper key={index} style={{ marginBottom: '20px', padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {group.groupName}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Fakultetas:</strong> {group.faculty}
              </Typography>
              <Typography variant="body1">
                <strong>Universitetas:</strong> {group.university}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Įstojimo/Baigimo Metai:</strong> {group.yearOfEntry} / {group.yearOfGraduation}
              </Typography>
              <Typography variant="body1">
                <strong>Grupės Seniūnas:</strong> {group.elder}
              </Typography>
              <Typography variant="body1">
                <strong>Narių Skaičius:</strong> {group.members.length}
              </Typography>
            </Grid>
          </Grid>

          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vardas</TableCell>
                  <TableCell>Pavardė</TableCell>
                  <TableCell>El. paštas</TableCell>
                  <TableCell>Telefonas</TableCell>
                  <TableCell>Fraze</TableCell>
                  <TableCell>Nuotrauka</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.members.map((member, memberIndex) => (
                  <TableRow key={memberIndex}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.surname}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.telephone}</TableCell>
                    <TableCell>{member.phrase}</TableCell>
                    <TableCell>
                      <img src={member.photo} alt={`${member.name} ${member.surname}`} style={{ width: 50 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container justifyContent="flex-end" spacing={2} style={{ marginTop: '20px' }}>
            <Grid item>
              <IconButton onClick={() => handleDownloadAllPhotos(group.groupName, group.members)}>
                <GetApp />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={() => handleDownloadLayout(group.groupName)}>
                <Collections />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={() => handleSaveVignette(group.groupName)}>
                <Save />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCompleteOrder(group.groupName)}
            >
              Užbaigti Užsakymą
            </Button>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
};

export default PhotoEditor;
