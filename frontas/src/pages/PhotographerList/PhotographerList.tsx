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
  Button,
  Grid,
} from '@mui/material';
import * as XLSX from 'xlsx';

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
  group: string;
}

interface PhotoshootInfo {
  groupName: string;
  location: string;
  date: string;
  time: string;
  members: User[];
}

const mockPhotoshootData: PhotoshootInfo[] = [
  {
    groupName: 'Group A',
    location: 'Studio 1',
    date: '2024-08-30',
    time: '10:00',
    members: [
      { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija', group: 'Group A' },
      { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas', group: 'Group A' },
    ],
  },
  {
    groupName: 'Group B',
    location: 'Outdoor Park',
    date: '2024-08-31',
    time: '14:00',
    members: [
      { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija', group: 'Group B' },
      { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija', group: 'Group B' },
    ],
  },
];

const PhotographerView: React.FC = () => {

  const handleDownload = (groupName: string, members: User[]) => {
    const wsData = [
      ['Vardas', 'Pavardė', 'El. paštas', 'Telefonas', 'Fraze'],
      ...members.map(member => [
        member.name,
        member.surname,
        member.email,
        member.telephone,
        member.phrase,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, groupName);

    XLSX.writeFile(workbook, `${groupName}_members.xlsx`);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Fotografijų tvarkaraštis
      </Typography>
      {mockPhotoshootData.map((photoshoot, index) => (
        <React.Fragment key={index}>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            {photoshoot.groupName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Vieta: {photoshoot.location}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Data: {photoshoot.date}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Laikas: {photoshoot.time}
          </Typography>

          <TableContainer component={Paper} style={{ marginTop: '10px', marginBottom: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vardas</TableCell>
                  <TableCell>Pavardė</TableCell>
                  <TableCell>El. paštas</TableCell>
                  <TableCell>Telefonas</TableCell>
                  <TableCell>Fraze</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {photoshoot.members.map((member, memberIndex) => (
                  <TableRow key={memberIndex}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.surname}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.telephone}</TableCell>
                    <TableCell>{member.phrase}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleDownload(photoshoot.groupName, photoshoot.members)}
            >
              Atsisiųsti {photoshoot.groupName} sąrašą
            </Button>
          </Grid>
        </React.Fragment>
      ))}
    </Container>
  );
};

export default PhotographerView;