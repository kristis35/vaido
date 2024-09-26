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
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { getData, deleteData } from '../../services/api/Axios'; // Import deleteData function
import { useNavigate } from 'react-router-dom';
import { Group, University } from '../../interfaces';

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getData<Group[]>('/Group/get-all');
        setGroups(response);
      } catch (error) {
      }
    };

    const fetchUniversities = async () => {
      try {
        const universityList = await getData<University[]>('/UniversityCrud/all');
        setUniversities(universityList);
      } catch (error) {
      }
    };

    fetchGroups();
    fetchUniversities();
  }, []);

  const handleAddGroup = () => {
    navigate('/addgroup'); // Navigate to the AddGroup page
  };

  const handleEditGroup = (groupId: number) => {
    navigate(`/editgroup/${groupId}`); // Navigate to the EditGroup page with the group ID
  };

  const handleDeleteGroup = async () => {
    if (groupToDelete !== null) {
      try {
        await deleteData(`/Group/delete/${groupToDelete}`);
        setGroups((prevGroups) => prevGroups.filter(group => group.id !== groupToDelete));
        setDeleteDialogOpen(false);
      } catch (error) {
      }
    }
  };

  const openDeleteDialog = (groupId: number) => {
    setGroupToDelete(groupId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Grupės Sąrašas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddGroup}
          style={{ marginBottom: '20px' }}
        >
          Pridėti Grupę
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Grupė</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell>Įstojimo Metai</TableCell>
              <TableCell>Baigimo Metai</TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.pavadinimas}</TableCell>
                <TableCell>{group.ilgasPavadinimas}</TableCell>
                <TableCell>
                  {universities.find(
                    (university) => university.id === group.universitetasId
                  )?.pavadinimas}
                </TableCell>
                <TableCell>{group.įstojimoMetai}</TableCell>
                <TableCell>{group.baigimoMetai}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditGroup(group.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteDialog(group.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Patvirtinti Ištrynimą</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ar tikrai norite ištrinti šią grupę? Šis veiksmas negali būti atšauktas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Atšaukti
          </Button>
          <Button onClick={handleDeleteGroup} color="primary">
            Ištrinti
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GroupList;
