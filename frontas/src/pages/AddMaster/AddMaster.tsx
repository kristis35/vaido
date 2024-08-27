import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    IconButton,
    Grid,
    Typography,
    Paper,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface User {
    name: string;
    surname: string;
    email: string;
    telephone: string;
}

const AddMaster: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { name: '', surname: '', email: '', telephone: '' },
    ]);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const newUsers = [...users];
        newUsers[index] = { ...newUsers[index], [name]: value };
        setUsers(newUsers);
    };

    const handleAddUser = () => {
        setUsers([...users, { name: '', surname: '', email: '', telephone: '' }]);
    };

    const handleRemoveUser = (index: number) => {
        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
    };

    const handleSubmit = () => {
        // Implement your submit logic here
        console.log('Users:', users);
    };

    return (
        <Container maxWidth="md" style={{ padding: 16 }} >

            {users.map((user, index) => (
                <Paper key={index} elevation={3} style={{ padding: 16, marginBottom: 16 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={user.name}
                                onChange={(event) => handleInputChange(index, event)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Surname"
                                name="surname"
                                value={user.surname}
                                onChange={(event) => handleInputChange(index, event)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={user.email}
                                onChange={(event) => handleInputChange(index, event)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telephone"
                                name="telephone"
                                value={user.telephone}
                                onChange={(event) => handleInputChange(index, event)}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                            {users.length > 1 && (
                                <IconButton
                                    onClick={() => handleRemoveUser(index)}
                                    color="secondary"
                                    aria-label="remove user"
                                >
                                    <RemoveCircleOutline />
                                </IconButton>
                            )}
                            {index === users.length - 1 && (
                                <IconButton
                                    onClick={handleAddUser}
                                    color="primary"
                                    aria-label="add user"
                                >
                                    <AddCircleOutline />
                                </IconButton>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            ))}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
            >
                Submit
            </Button>
        </Container>
    );
};

export default AddMaster;
