import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  TableSortLabel,
} from '@mui/material';
import { GetApp, PhotoCamera, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Group } from '../../interfaces'; // Assuming you have the Group interface

type Order = 'asc' | 'desc';

const PhotographerList: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [order, setOrder] = useState<Order>('asc'); // Sorting order: 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState<keyof Group>('pavadinimas'); // Default sort by 'pavadinimas'

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('https://localhost:44359/api/Group/get-all');
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to fetch groups. Please try again later.');
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleDownload = (groupName: string) => {
    console.log(`Download data for group: ${groupName}`);
  };

  const handleUploadPhotos = (groupId: number) => {
    navigate(`/photoupload/${groupId}`);
  };

  const handleChooseDate = (groupId: number) => {
    navigate(`/choosedate/${groupId}`);
  };

  // Sorting helper function
  const sortGroups = (array: Group[], comparator: (a: Group, b: Group) => number) => {
    const stabilizedArray = array.map((el, index) => [el, index] as [Group, number]);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  };

  // Sorting comparator function
  const getComparator = (order: Order, orderBy: keyof Group) => {
    return order === 'desc'
      ? (a: Group, b: Group) => descendingComparator(a, b, orderBy)
      : (a: Group, b: Group) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a: Group, b: Group, orderBy: keyof Group) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const handleRequestSort = (property: keyof Group) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Grupės
        </Typography>
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Grupės
        </Typography>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Grupės
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'pavadinimas'}
                  direction={orderBy === 'pavadinimas' ? order : 'asc'}
                  onClick={() => handleRequestSort('pavadinimas')}
                >
                  Pavadinimas
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ilgasPavadinimas'}
                  direction={orderBy === 'ilgasPavadinimas' ? order : 'asc'}
                  onClick={() => handleRequestSort('ilgasPavadinimas')}
                >
                  Ilgas Pavadinimas
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'įstojimoMetai'}
                  direction={orderBy === 'įstojimoMetai' ? order : 'asc'}
                  onClick={() => handleRequestSort('įstojimoMetai')}
                >
                  Įstojimo/Baigimo Metai
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'studentuSkaicius'}
                  direction={orderBy === 'studentuSkaicius' ? order : 'asc'}
                  onClick={() => handleRequestSort('studentuSkaicius')}
                >
                  Studentų Skaičius
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'grupesSeniunas'}
                  direction={orderBy === 'grupesSeniunas' ? order : 'asc'}
                  onClick={() => handleRequestSort('grupesSeniunas')}
                >
                  Grupės Seniūnas
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fotografavimoDataVieta'}
                  direction={orderBy === 'fotografavimoDataVieta' ? order : 'asc'}
                  onClick={() => handleRequestSort('fotografavimoDataVieta')}
                >
                  Fotografavimo Data ir Vieta
                </TableSortLabel>
              </TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortGroups(groups, getComparator(order, orderBy)).map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.pavadinimas}</TableCell>
                <TableCell>{group.ilgasPavadinimas}</TableCell>
                <TableCell>
                  {group.įstojimoMetai} / {group.baigimoMetai}
                </TableCell>
                <TableCell>{group.studentuSkaicius}</TableCell>
                <TableCell>{group.grupesSeniunas}</TableCell>
                <TableCell>{group.fotografavimoDataVieta}</TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item>
                      <IconButton onClick={() => handleChooseDate(group.id)}>
                        <CalendarToday />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleUploadPhotos(group.id)}>
                        <PhotoCamera />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleDownload(group.pavadinimas)}>
                        <GetApp />
                      </IconButton>
                    </Grid>
                  </Grid>
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
