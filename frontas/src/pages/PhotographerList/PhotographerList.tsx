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
} from '@mui/material';
import { Edit, GetApp, PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  faculty: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  university: string;
  elder: string;
  members: User[];
}

const mockPhotoshootData: PhotoshootInfo[] = [
  {
    groupName: 'Kompiuterių Mokslai 2022',
    location: 'Studija 1',
    date: '2024-08-30',
    time: '10:00',
    faculty: 'Inžinerija ir Informatika',
    yearOfEntry: 2018,
    yearOfGraduation: 2022,
    university: 'Vilniaus Universitetas',
    elder: 'Jonas Jonaitis',
    members: [
      { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija', group: 'Kompiuterių Mokslai 2022' },
      { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas', group: 'Kompiuterių Mokslai 2022' },
    ],
  },
  {
    groupName: 'Menas ir Dizainas 2023',
    location: 'Lauko Parkas',
    date: '2024-08-31',
    time: '14:00',
    faculty: 'Menai',
    yearOfEntry: 2019,
    yearOfGraduation: 2023,
    university: 'Kauno Technologijos Universitetas',
    elder: 'Petras Petraitis',
    members: [
      { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija', group: 'Menas ir Dizainas 2023' },
      { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija', group: 'Menas ir Dizainas 2023' },
    ],
  },
];

const PhotographerList: React.FC = () => {
  const navigate = useNavigate();

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

    XLSX.writeFile(workbook, `${groupName}_nariai.xlsx`);
  };

  const handleEditGroup = (groupName: string) => {
    navigate(`/edit-group/${groupName}`);
  };

  const handleUploadPhotos = (groupName: string) => {
    navigate(`/upload-photos/${groupName}`);
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Tvarkaraštis
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Grupė</TableCell>
              <TableCell>Data ir Laikas</TableCell>
              <TableCell>Vieta</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell>Įstojimo/Baigimo Metai</TableCell>
              <TableCell>Grupės Seniūnas / Narių Skaičius</TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPhotoshootData.map((photoshoot, index) => (
              <TableRow key={index}>
                <TableCell>{photoshoot.groupName}</TableCell>
                <TableCell>{photoshoot.date} {photoshoot.time}</TableCell>
                <TableCell>{photoshoot.location}</TableCell>
                <TableCell>{photoshoot.faculty}</TableCell>
                <TableCell>{photoshoot.university}</TableCell>
                <TableCell>{photoshoot.yearOfEntry} / {photoshoot.yearOfGraduation}</TableCell>
                <TableCell>
                  {photoshoot.elder} / {photoshoot.members.length} nariai
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditGroup(photoshoot.groupName)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleUploadPhotos(photoshoot.groupName)}>
                    <PhotoCamera />
                  </IconButton>
                  <IconButton onClick={() => handleDownload(photoshoot.groupName, photoshoot.members)}>
                    <GetApp />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PhotographerList;