import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Alert,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { UploadFile, Download, Edit, Delete } from '@mui/icons-material';
import { Group, Useris } from '../../interfaces';
import { postData, getData, putData } from '../../services/api/Axios';
import { useAuth } from '../../services/api/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
interface UserRequest {
  Vardas: string;
  Pavarde: string;
  ElPastas: string;
  Telefonas: string;
}

const AddUserList: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<Useris[]>([]);
  const [users, setUsers] = useState<UserRequest[]>([
    { Vardas: '', Pavarde: '', ElPastas: '', Telefonas: '' },
  ]);
  const [editUser, setEditUser] = useState<Useris | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const isGroupConfirmed = group?.patvirtintasSarasas === true;

  useEffect(() => {
    if (userId) {
      fetchGroupData();
    }
  }, [userId]);

  const fetchGroupData = async () => {
    try {
      const response = await getData<Group>(`/Group/get-by-user/${userId}`);
      setGroup(response);
      fetchGroupUsers(response.id);
    } catch (error) {
      console.log(axios.isAxiosError(error) && error.response?.status)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        navigate('/addgroup', { state: { message: 'Jūs turite sukurti grupę.' } });
      } else {
        setError('Nepavyko gauti grupės duomenų.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const fetchGroupUsers = async (groupId: number) => {
    try {
      const response = await getData<Useris[]>(`/User/get-users-by-group/${groupId}`);
      setGroupUsers(response);
    } catch (error) {
      setError('Nepavyko gauti grupės narių.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [name]: value };
    setUsers(newUsers);
  };

  const handleUploadExcel = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = (event.type === 'drop')
      ? (event as React.DragEvent<HTMLDivElement>).dataTransfer.files[0]
      : (event.target as HTMLInputElement).files?.[0];

    if (file) {
      setExcelFile(file);
      await handleSave(file); // Automatically trigger the save process when the file is uploaded
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleSave = async (file?: File) => {
    if (!group) {
      setError('Grupės duomenys dar nėra įkelti.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('GroupId', group.id.toString());

    if (file || excelFile) {
      formData.append('ExcelFile', file || excelFile!);
    } else if (users.length > 0) {
      users.forEach((user, index) => {
        formData.append(`Users[${index}].Vardas`, user.Vardas);
        formData.append(`Users[${index}].Pavarde`, user.Pavarde);
        formData.append(`Users[${index}].ElPastas`, user.ElPastas);
        formData.append(`Users[${index}].Telefonas`, user.Telefonas);
      });
    } else {
      setError('Prašome pridėti bent vieną vartotoją arba įkelti Excel failą.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await postData<{ message: string }>('/Group/add-user-to-group', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Sėkmingai pridėti vartotojai');

      // Reset the form
      setUsers([{ Vardas: '', Pavarde: '', ElPastas: '', Telefonas: '' }]);
      setExcelFile(null);

      // Refetch users in the group
      fetchGroupUsers(group.id);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Nepavyko pridėti vartotojų.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await putData<{ message: string }>(`/User/remove-user-from-group/${userId}`, null);
      setSuccessMessage('Vartotojas ištrintas');
      if (group) fetchGroupUsers(group.id);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Nepavyko ištrinti vartotojo.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEditUser = (user: Useris) => {
    setEditUser(user);
  };

  const handleSaveEditUser = async () => {
    if (editUser) {
      try {
        const updatedUser = {
          id: editUser.id,
          vardas: editUser.vardas,
          pavarde: editUser.pavarde,
          prisijungimoVardas: editUser.prisijungimoVardas,
          telefonas: editUser.telefonas,
          vartotojoRole: editUser.vartotojoRole,
          universitetas: editUser.universitetasId,
          fakultetas: editUser.fakultetasId,
        };

        const response = await putData<{ message: string }>(`/User/edit-user/${editUser.id}`, updatedUser);
        setSuccessMessage('Pakeitimai išsaugoti vartotojo.');
        if (group) fetchGroupUsers(group.id);
        setEditUser(null);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError('Nepavyko redaguoti vartotojo.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleFakeSave = () => {
    setSuccessMessage('Grupes informacija sekmingai išsaugota');
    setTimeout(() => setError(null), 3000);
  };

  const handleConfirmGroup = () => {
    if (!group) return;

    const updatedGroup = {
      ...group,
      patvirtintasSarasas: true,
    };

    putData<{ message: string }>(`/Group/edit/${group.id}`, updatedGroup)
      .then((response) => {
        setSuccessMessage('Grupė patvirtinta sėkmingai.');
        setTimeout(() => setError(null), 3000);
        fetchGroupData(); // Refresh the group data
      })
      .catch((error) => {
        setError('Nepavyko patvirtinti grupės.');
        setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setConfirmDialogOpen(false);
      });
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      {isGroupConfirmed && (
        <Alert severity="info" style={{ marginBottom: '16px' }}>
          Grupė yra patvirtinta. Redagavimas negalimas.
        </Alert>
      )}

      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" style={{ marginBottom: '16px' }}>
          {successMessage}
        </Alert>
      )}

      {groupUsers.length > 0 && (
        <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Grupės nariai</Typography>
            {!isGroupConfirmed && (
              <Button variant="contained" color="success" onClick={() => setConfirmDialogOpen(true)}>
                Patvirtinti grupę
              </Button>
            )}
          </Box>
          <List>
            {groupUsers.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem>
                  <ListItemText
                    primary={`${user.vardas} ${user.pavarde}`}
                    secondary={`El. paštas: ${user.prisijungimoVardas} | Telefonas: ${user.telefonas}`}
                  />
                  {!isGroupConfirmed && user.vartotojoRole !== 'seniunas' && (
                    <>
                      <IconButton edge="end" color="primary" onClick={() => handleEditUser(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" color="secondary" onClick={() => handleDeleteUser(user.id)}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          {!isGroupConfirmed && (
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleUploadExcel}
              sx={{
                border: isDragActive ? '2px dashed #1976d2' : 'none',
                borderRadius: '4px',
                padding: isDragActive ? '20px' : '0',
                backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
                textAlign: 'center',
              }}
            >
              <Button variant="contained" component="label" startIcon={<UploadFile />} fullWidth>
                Įkelti Excel
                <input type="file" accept=".xlsx, .xls" hidden onChange={handleUploadExcel} />
              </Button>
              {isDragActive && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Numeskite failą čia
                </Typography>
              )}
            </Box>
          )}
          {excelFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {`Įkeltas failas: ${excelFile.name}`}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {!isGroupConfirmed && (
            <Button variant="contained" color="secondary" startIcon={<Download />} fullWidth href="/Sarasas.xlsx" download="Vartotojų_Šablonas.xlsx">
              Atsisiųsti šabloną
            </Button>
          )}
        </Grid>
      </Grid>

      {users.map((user, index) => (
        <Paper key={index} elevation={3} style={{ padding: 16, marginTop: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Vardas"
                name="Vardas"
                value={user.Vardas}
                onChange={(event) => handleInputChange(index, event)}
                required
                disabled={isGroupConfirmed}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Pavardė"
                name="Pavarde"
                value={user.Pavarde}
                onChange={(event) => handleInputChange(index, event)}
                required
                disabled={isGroupConfirmed}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="El. paštas"
                name="ElPastas"
                value={user.ElPastas}
                onChange={(event) => handleInputChange(index, event)}
                required
                disabled={isGroupConfirmed}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Telefonas"
                name="Telefonas"
                value={user.Telefonas}
                onChange={(event) => handleInputChange(index, event)}
                required
                disabled={isGroupConfirmed}
              />
            </Grid>
            {index === users.length - 1 && !isGroupConfirmed && (
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => handleSave()} fullWidth>
                  Pridėti grupioką
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

      {editUser && (
        <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
          <DialogTitle>Redaguoti vartotoją</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Vardas"
              fullWidth
              value={editUser.vardas}
              onChange={(e) => setEditUser({ ...editUser, vardas: e.target.value })}
              disabled={isGroupConfirmed}
            />
            <TextField
              margin="dense"
              label="Pavardė"
              fullWidth
              value={editUser.pavarde}
              onChange={(e) => setEditUser({ ...editUser, pavarde: e.target.value })}
              disabled={isGroupConfirmed}
            />
            <TextField
              margin="dense"
              label="El. paštas"
              fullWidth
              value={editUser.prisijungimoVardas}
              onChange={(e) => setEditUser({ ...editUser, prisijungimoVardas: e.target.value })}
              disabled={isGroupConfirmed}
            />
            <TextField
              margin="dense"
              label="Telefonas"
              fullWidth
              value={editUser.telefonas}
              onChange={(e) => setEditUser({ ...editUser, telefonas: e.target.value })}
              disabled={isGroupConfirmed}
            />
          </DialogContent>
          <DialogActions>
            {!isGroupConfirmed && (
              <>
                <Button onClick={() => setEditUser(null)} color="secondary">
                  Atšaukti
                </Button>
                <Button onClick={handleSaveEditUser} color="primary">
                  Išsaugoti
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* <Grid container style={{ marginTop: '16px' }}>
        <Grid item xs={6}>
          {!isGroupConfirmed && (
            <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={() => handleFakeSave()}>
              Išsaugoti
            </Button>
          )}
          {!isGroupConfirmed && (
            <Button variant="contained" color="success" onClick={() => setConfirmDialogOpen(true)}>
              Patvirtinti grupę
            </Button>
          )}
        </Grid>
      </Grid> */}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Patvirtinti grupę</DialogTitle>
        <DialogContent>
          <Typography>
            Ar tikrai norite patvirtinti grupę? Jei ji bus patvirtinta, jos redaguoti nebegalėsite.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary">
            Atšaukti
          </Button>
          <Button onClick={handleConfirmGroup} color="primary">
            Patvirtinti
          </Button>
        </DialogActions>
      </Dialog>
    </Container >
  );
};

export default AddUserList;
