import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    IconButton,
    Grid,
    Paper,
    Box,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { styled } from '@mui/system';
import { getData, postData } from '../../services/api/Axios'; // Import the axios helper functions
import { University, Faculty, User } from '../../interfaces'; // Import interfaces from the new file

// Custom styles for the red asterisk
const RedAsterisk = styled('span')({
    color: 'red',
    marginLeft: 2,
});

const roles = [
    { value: 'seniunas', label: 'Seniūnas' },
    { value: 'studentas', label: 'Studentas' },
    { value: 'fotolaboratorija', label: 'Fotolaboratorija' },
    { value: 'maketuotojas', label: 'Maketuotojas' },
    { value: 'fotografas', label: 'Fotografas' },
    { value: 'administratoriust', label: 'Administratorius' },
    { value: 'super administratorius', label: 'Super Administratorius' },
];

const AddMaster: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { name: '', surname: '', email: '', telephone: '', university: '', faculty: '', entryYear: '', graduationYear: '', numberOfPeople: '', role: 'studentas' },
    ]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<boolean[]>([]);

    useEffect(() => {
        // Fetch universities and faculties when the component mounts
        const fetchUniversities = async () => {
            try {
                const universityList = await getData<University[]>('/UniversityCrud/all');
                setUniversities(universityList);
            } catch (error) {
                console.error('Nepavyko gauti universitetų sąrašo:', error);
            }
        };

        const fetchFaculties = async () => {
            try {
                const facultyList = await getData<Faculty[]>('/Fakultetas/all');
                setFaculties(facultyList);
            } catch (error) {
                console.error('Nepavyko gauti fakultetų sąrašo:', error);
            }
        };

        fetchUniversities();
        fetchFaculties();
    }, []);

    const handleInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target;
        const newUsers = [...users];
        newUsers[index] = { ...newUsers[index], [name!]: value };
        setUsers(newUsers);
    };

    const handleAddUser = () => {
        setUsers([...users, { name: '', surname: '', email: '', telephone: '', university: '', faculty: '', entryYear: '', graduationYear: '', numberOfPeople: '', role: 'studentas' }]);
    };

    const handleRemoveUser = (index: number) => {
        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
    };

    const validateFields = () => {
        const validationErrors = users.map(user =>
            !user.name ||
            !user.surname ||
            !user.email ||
            !user.telephone ||
            !user.university ||
            !user.faculty ||
            !user.entryYear ||
            !user.graduationYear ||
            !user.numberOfPeople ||
            !user.role
        );
        setErrors(validationErrors);
        return validationErrors.every(isValid => !isValid);
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            alert('Prašome užpildyti visus laukus.');
            return;
        }

        // Prepare data to send to the API
        const userData = users.map(user => ({
            prisijungimoVardas: user.email,
            vardas: user.name,
            pavarde: user.surname,
            telefonas: user.telephone,
            vartotojoRole: user.role,
            universitetasId: parseInt(user.university),
            fakultetasId: parseInt(user.faculty),
        }));

        setLoading(true);
        try {
            await postData('/User/create', userData);
            setLoading(false);
            setSuccessMessage('Asmuo sėkmingai pridėtas!');
            setUsers([
                { name: '', surname: '', email: '', telephone: '', university: '', faculty: '', entryYear: '', graduationYear: '', numberOfPeople: '', role: 'studentas' },
            ]);
        } catch (error) {
            console.error('Klaida pridedant asmenį:', error);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" style={{ padding: 16 }}>
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
                                label={<>Vardas<RedAsterisk>*</RedAsterisk></>}
                                name="name"
                                value={user.name}
                                onChange={(event) => handleInputChange(index, event)}
                                error={errors[index] && !user.name}
                                helperText={errors[index] && !user.name ? 'Privalomas laukas' : ''}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<>Pavardė<RedAsterisk>*</RedAsterisk></>}
                                name="surname"
                                value={user.surname}
                                onChange={(event) => handleInputChange(index, event)}
                                error={errors[index] && !user.surname}
                                helperText={errors[index] && !user.surname ? 'Privalomas laukas' : ''}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<>El. paštas<RedAsterisk>*</RedAsterisk></>}
                                name="email"
                                value={user.email}
                                onChange={(event) => handleInputChange(index, event)}
                                error={errors[index] && !user.email}
                                helperText={errors[index] && !user.email ? 'Privalomas laukas' : ''}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<>Telefonas<RedAsterisk>*</RedAsterisk></>}
                                name="telephone"
                                value={user.telephone}
                                onChange={(event) => handleInputChange(index, event)}
                                error={errors[index] && !user.telephone}
                                helperText={errors[index] && !user.telephone ? 'Privalomas laukas' : ''}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={errors[index] && !user.university}>
                                <InputLabel shrink>
                                    Universitetas<RedAsterisk>*</RedAsterisk>
                                </InputLabel>
                                <Select
                                    name="university"
                                    value={user.university}
                                    onChange={(event) => handleInputChange(index, event as SelectChangeEvent<string>)}
                                >
                                    {universities.map((university) => (
                                        <MenuItem key={university.id} value={university.id.toString()}>
                                            {university.pavadinimas}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={errors[index] && !user.faculty}>
                                <InputLabel shrink>
                                    Fakultetas<RedAsterisk>*</RedAsterisk>
                                </InputLabel>
                                <Select
                                    name="faculty"
                                    value={user.faculty}
                                    onChange={(event) => handleInputChange(index, event as SelectChangeEvent<string>)}
                                >
                                    {faculties.map((faculty) => (
                                        <MenuItem key={faculty.id} value={faculty.id.toString()}>
                                            {faculty.pavadinimas}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={errors[index] && !user.role}>
                                <InputLabel shrink>
                                    Rolė<RedAsterisk>*</RedAsterisk>
                                </InputLabel>
                                <Select
                                    name="role"
                                    value={user.role}
                                    onChange={(event) => handleInputChange(index, event as SelectChangeEvent<string>)}
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<>Įstojimo metai<RedAsterisk>*</RedAsterisk></>}
                                name="entryYear"
                                value={user.entryYear}
                                onChange={(event) => handleInputChange(index, event)}
                                error={errors[index] && !user.entryYear}
                                helperText={errors[index] && !user.entryYear ? 'Privalomas laukas' : ''}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<>Baigimo metai<RedAsterisk>*</RedAsterisk></>}
                                name="graduationYear"
                                value={user.graduationYear}
                                onChange={(event) => handleInputChange(index, event)}
                                error={errors[index] && !user.graduationYear}
                                helperText={errors[index] && !user.graduationYear ? 'Privalomas laukas' : ''}
                                InputLabelProps={{ shrink: true }}
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
                disabled={loading}
            >
                {loading ? 'Kraunasi...' : 'Pridėti'}
            </Button>
        </Container>
    );
};

export default AddMaster;
