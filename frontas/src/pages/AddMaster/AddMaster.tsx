import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    IconButton,
    Grid,
    Typography,
    Paper,
    Box,
    Alert,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { styled } from '@mui/system';

// Custom styles for the red asterisk
const RedAsterisk = styled('span')({
    color: 'red',
    marginLeft: 2,
});

interface User {
    name: string;
    surname: string;
    email: string;
    telephone: string;
    university: string;
    faculty: string;
    entryYear: string;
    graduationYear: string;
    numberOfPeople: string;
}

const AddMaster: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { name: '', surname: '', email: '', telephone: '', university: '', faculty: '', entryYear: '', graduationYear: '', numberOfPeople: '' },
    ]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const newUsers = [...users];
        newUsers[index] = { ...newUsers[index], [name]: value };
        setUsers(newUsers);
    };

    const handleAddUser = () => {
        setUsers([...users, { name: '', surname: '', email: '', telephone: '', university: '', faculty: '', entryYear: '', graduationYear: '', numberOfPeople: '' }]);
    };

    const handleRemoveUser = (index: number) => {
        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
    };

    const handleSubmit = () => {
        // Check if all fields are filled
        const allFieldsFilled = users.every(user =>
            user.name &&
            user.surname &&
            user.email &&
            user.telephone &&
            user.university &&
            user.faculty &&
            user.entryYear &&
            user.graduationYear &&
            user.numberOfPeople
        );

        if (!allFieldsFilled) {
            alert('Prašome užpildyti visus laukus.');
            return;
        }

        // Simulate loading and then show success message
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage('Asmuo sėkmingai pridėtas!');
            // Optionally clear form after successful submission
            setUsers([
                { name: '', surname: '', email: '', telephone: '', university: '', faculty: '', entryYear: '', graduationYear: '', numberOfPeople: '' },
            ]);
        }, 1000);
    };

    return (
        <Container maxWidth="md" style={{ padding: 16 }}>
            {/* Success Message */}
            {successMessage && (
                <Box marginBottom={2}>
                    <Alert severity="success">{successMessage}</Alert>
                </Box>
            )}

            {users.map((user, index) => (
                <Paper key={index} elevation={3} style={{ padding: 16, marginBottom: 16 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Vardas<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="name"
                                value={user.name}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.name}
                                helperText={!user.name ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true, // Ensures label remains above input field when not focused
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Pavardė<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="surname"
                                value={user.surname}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.surname}
                                helperText={!user.surname ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        El. paštas<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="email"
                                value={user.email}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.email}
                                helperText={!user.email ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Telefonas<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="telephone"
                                value={user.telephone}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.telephone}
                                helperText={!user.telephone ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Universitetas<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="university"
                                value={user.university}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.university}
                                helperText={!user.university ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Fakultetas<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="faculty"
                                value={user.faculty}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.faculty}
                                helperText={!user.faculty ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Įstojimo metai<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="entryYear"
                                value={user.entryYear}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.entryYear}
                                helperText={!user.entryYear ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Baigimo metai<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="graduationYear"
                                value={user.graduationYear}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.graduationYear}
                                helperText={!user.graduationYear ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Žmonių skaičius<RedAsterisk>*</RedAsterisk>
                                    </>
                                }
                                name="numberOfPeople"
                                value={user.numberOfPeople}
                                onChange={(event) => handleInputChange(index, event)}
                                error={!user.numberOfPeople}
                                helperText={!user.numberOfPeople ? 'Privalomas laukas' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                            {users.length > 1 && (
                                <IconButton
                                    onClick={() => handleRemoveUser(index)}
                                    color="secondary"
                                    aria-label="pašalinti vartotoją"
                                >
                                    <RemoveCircleOutline />
                                </IconButton>
                            )}
                            {index === users.length - 1 && (
                                <IconButton
                                    onClick={handleAddUser}
                                    color="primary"
                                    aria-label="pridėti vartotoją"
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
                Pridėti
            </Button>
        </Container>
    );
};

export default AddMaster