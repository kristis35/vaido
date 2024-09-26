import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getData, deleteData } from '../../services/api/Axios';
import { Useris, University, Faculty } from '../../interfaces';
import { Edit, Delete } from '@mui/icons-material';

type Order = 'asc' | 'desc';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Useris[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean, userId: number | null }>({ open: false, userId: null });
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Useris>('vardas');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getData<Useris[]>('/user/get-all-users');
        const filteredUsers = userList.filter(user => user.vartotojoRole !== 'studentas');
        setUsers(filteredUsers);
      } catch (error) {
        setError('Nepavyko gauti vartotojų sąrašo. Bandykite dar kartą.');
        setTimeout(() => setError(null), 3000);
      }
    };

    const fetchUniversities = async () => {
      try {
        const universityList = await getData<University[]>('/UniversityCrud/all');
        setUniversities(universityList);
      } catch (error) {
        setError('Nepavyko gauti universitetų sąrašo. Bandykite dar kartą.');
        setTimeout(() => setError(null), 3000);
      }
    };

    const fetchFaculties = async () => {
      try {
        const facultyList = await getData<Faculty[]>('/Fakultetas/all');
        setFaculties(facultyList);
      } catch (error) {
        setError('Nepavyko gauti fakultetų sąrašo. Bandykite dar kartą.');
        setTimeout(() => setError(null), 3000);
      }
    };

    fetchUsers();
    fetchUniversities();
    fetchFaculties();
  }, []);

  const handleAddUserClick = () => {
    navigate('/addmaster');
  };

  const handleEditUserClick = (userId: number) => {
    navigate(`/edituser/${userId}`);
  };

  const handleDeleteUserClick = (userId: number) => {
    setConfirmDeleteDialog({ open: true, userId });
  };

  const confirmDeleteUser = async () => {
    if (confirmDeleteDialog.userId !== null) {
      try {
        await deleteData(`/user/delete-user/${confirmDeleteDialog.userId}`);
        setUsers(users.filter(user => user.id !== confirmDeleteDialog.userId));
        setConfirmDeleteDialog({ open: false, userId: null });
      } catch (error) {
        setError('Nepavyko ištrinti vartotojo. Bandykite dar kartą.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const getUniversityName = (universityId: number | null) => {
    const university = universities.find(u => u.id === universityId);
    return university ? university.pavadinimas : 'Nėra';
  };

  const getFacultyName = (facultyId: number | null) => {
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty ? faculty.pavadinimas : 'Nėra';
  };

  const handleRequestSort = (property: keyof Useris) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = users.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
  
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      return 0; // In case of different types, no sorting is done
    }
  });  

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Vartotojų Sąrašas
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddUserClick}>
          Pridėti Vartotoją
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'id' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'prisijungimoVardas' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'prisijungimoVardas'}
                  direction={orderBy === 'prisijungimoVardas' ? order : 'asc'}
                  onClick={() => handleRequestSort('prisijungimoVardas')}
                >
                  Prisijungimo Vardas
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'vardas' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'vardas'}
                  direction={orderBy === 'vardas' ? order : 'asc'}
                  onClick={() => handleRequestSort('vardas')}
                >
                  Vardas
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'pavarde' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'pavarde'}
                  direction={orderBy === 'pavarde' ? order : 'asc'}
                  onClick={() => handleRequestSort('pavarde')}
                >
                  Pavardė
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'telefonas' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'telefonas'}
                  direction={orderBy === 'telefonas' ? order : 'asc'}
                  onClick={() => handleRequestSort('telefonas')}
                >
                  Telefonas
                </TableSortLabel>
              </TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell sortDirection={orderBy === 'vartotojoRole' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'vartotojoRole'}
                  direction={orderBy === 'vartotojoRole' ? order : 'asc'}
                  onClick={() => handleRequestSort('vartotojoRole')}
                >
                  Vartotojo Rolė
                </TableSortLabel>
              </TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.prisijungimoVardas}</TableCell>
                <TableCell>{user.vardas}</TableCell>
                <TableCell>{user.pavarde}</TableCell>
                <TableCell>{user.telefonas}</TableCell>
                <TableCell>{getFacultyName(user.fakultetasId)}</TableCell>
                <TableCell>{getUniversityName(user.universitetasId)}</TableCell>
                <TableCell>{user.vartotojoRole}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditUserClick(user.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUserClick(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmDeleteDialog.open}
        onClose={() => setConfirmDeleteDialog({ open: false, userId: null })}
      >
        <DialogTitle>Patvirtinti Trinti</DialogTitle>
        <DialogContent>
          Ar tikrai norite ištrinti šį vartotoją?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog({ open: false, userId: null })} color="secondary">
            Atšaukti
          </Button>
          <Button onClick={confirmDeleteUser} color="primary">
            Ištrinti
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserList;
