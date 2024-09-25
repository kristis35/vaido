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
import { postData, getData , putData } from '../../services/api/Axios';
import { useAuth } from '../../services/api/Context';

interface UserRequest {
  Vardas: string;
  Pavarde: string;
  ElPastas: string;
  Telefonas: string;
}

const AddUserList: React.FC = () => {
  const { userId } = useAuth(); // Get userId from auth context
  const [group, setGroup] = useState<Group | null>(null); // State to store group data
  const [groupUsers, setGroupUsers] = useState<Useris[]>([]); // State to store users in the group
  const [users, setUsers] = useState<UserRequest[]>([
    { Vardas: '', Pavarde: '', ElPastas: '', Telefonas: '' },
  ]);
  const [editUser, setEditUser] = useState<Useris | null>(null); // State for user being edited
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  useEffect(() => {
    if (userId) {
      fetchGroupData();
    }
  }, [userId]);

  const fetchGroupData = async () => {
    try {
      const response = await getData<Group>(`/Group/get-by-user/${userId}`);
      setGroup(response); // Store the fetched group data
      console.log('Group data:', response);
      fetchGroupUsers(response.id); // Fetch users in the group
    } catch (error) {
      console.error('Failed to fetch group data:', error);
      setError('Failed to fetch group data.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const fetchGroupUsers = async (groupId: number) => {
    try {
      const response = await getData<Useris[]>(`/User/get-users-by-group/${groupId}`);
      setGroupUsers(response); // Store the fetched users in the group
      console.log('Group users:', response);
    } catch (error) {
      console.error('Failed to fetch group users:', error);
      setError('Failed to fetch group users.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [name]: value };
    setUsers(newUsers);
  };

  const handleUploadExcel = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = (event.type === 'drop')
      ? (event as React.DragEvent<HTMLDivElement>).dataTransfer.files[0]
      : (event.target as HTMLInputElement).files?.[0];

    if (file) {
      setExcelFile(file);
      console.log('Excel file uploaded:', file.name);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleSave = async () => {
    if (!group) {
      setError('Group data is not loaded yet.');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append('GroupId', group.id.toString()); // Use the actual Group ID

    if (excelFile) {
      formData.append('ExcelFile', excelFile);
    } else if (users.length > 0) {
      users.forEach((user, index) => {
        formData.append(`Users[${index}].Vardas`, user.Vardas);
        formData.append(`Users[${index}].Pavarde`, user.Pavarde);
        formData.append(`Users[${index}].ElPastas`, user.ElPastas);
        formData.append(`Users[${index}].Telefonas`, user.Telefonas);
      });
    } else {
      setError('Please add at least one user or upload an Excel file.');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    try {
      const response = await postData<{ message: string }>('/Group/add-user-to-group', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.message);
      console.log('Users added:', response.message);

      // Reset the form
      setUsers([{ Vardas: '', Pavarde: '', ElPastas: '', Telefonas: '' }]);
      setExcelFile(null);

      // Refetch users in the group
      fetchGroupUsers(group.id);

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Failed to add users:', error);
      setError('Failed to add users.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await putData<{ message: string }>(`/User/remove-user-from-group/${userId}`, null);
      setSuccessMessage(response.message);

      // Refetch users in the group
      if (group) fetchGroupUsers(group.id);

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user.');
      setTimeout(() => {
        setError(null);
      }, 3000);
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
          universitetas: editUser.universitetas,
          fakultetas: editUser.fakultetas 
        };

        const response = await putData<{ message: string }>(`/User/edit-user/${editUser.id}`, updatedUser);
        setSuccessMessage(response.message);
        if (group) fetchGroupUsers(group.id);
        setEditUser(null);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (error) {
        console.error('Failed to edit user:', error);
        setError('Failed to edit user.');
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      {groupUsers.length > 0 && (
        <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
          <Typography variant="h6">Users in this Group</Typography>
          <List>
            {groupUsers.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem>
                  <ListItemText
                    primary={`${user.vardas} ${user.pavarde}`}
                    secondary={`Email: ${user.prisijungimoVardas} | Phone: ${user.telefonas}`}
                  />
                  {/* Hide Edit and Delete buttons for users with role 'seniunas' */}
                  {user.vartotojoRole !== 'seniunas' && (
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
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
              fullWidth
            >
              Įkelti Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={handleUploadExcel}
              />
            </Button>
            {isDragActive && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Numeskite failą čia
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Download />}
            fullWidth
            href="/Sarasas.xlsx"
            download="Vartotojų_Šablonas.xlsx"
          >
            Atsisiųsti šabloną
          </Button>
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
              />
            </Grid>
            {index === users.length - 1 && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                >
                  Pridėti grupioką
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

      {error && (
        <Alert severity="error" style={{ marginTop: '16px' }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" style={{ marginTop: '16px' }}>
          {successMessage}
        </Alert>
      )}

      {/* Dialog for editing user */}
      {editUser && (
        <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Vardas"
              fullWidth
              value={editUser.vardas}
              onChange={(e) => setEditUser({ ...editUser, vardas: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Pavardė"
              fullWidth
              value={editUser.pavarde}
              onChange={(e) => setEditUser({ ...editUser, pavarde: e.target.value })}
            />
            <TextField
              margin="dense"
              label="El. paštas"
              fullWidth
              value={editUser.prisijungimoVardas}
              onChange={(e) => setEditUser({ ...editUser, prisijungimoVardas: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Telefonas"
              fullWidth
              value={editUser.telefonas}
              onChange={(e) => setEditUser({ ...editUser, telefonas: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEditUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AddUserList;
