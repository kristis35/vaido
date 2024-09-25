import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddMaster: React.FC = () => {
    const [user, setUser] = useState<User>({
        name: '',
        surname: '',
        email: '',
        telephone: '',
        university: '',
        faculty: '',
        role: 'studentas',
    });
    const [universities, setUniversities] = useState<University[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

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
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target;
        setUser({ ...user, [name!]: value });
    };

    const validateFields = () => {
        const validationErrors: { [key: string]: boolean } = {};
        validationErrors.name = !user.name;
        validationErrors.surname = !user.surname;
        validationErrors.email = !user.email || !emailRegex.test(user.email);
        validationErrors.telephone = !user.telephone;
        validationErrors.role = !user.role;

        setErrors(validationErrors);
        return Object.values(validationErrors).every(isValid => !isValid);
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            alert('Prašome užpildyti visus privalomus laukus.');
            return;
        }

        // Prepare data to send to the API, with universitetasId and fakultetasId as 0 if not provided
        const userData = {
            prisijungimoVardas: user.email,
            vardas: user.name,
            pavarde: user.surname,
            telefonas: user.telephone,
            vartotojoRole: user.role,
            universitetasId: user.university ? parseInt(user.university) : 0,
            fakultetasId: user.faculty ? parseInt(user.faculty) : 0,
        };

        setLoading(true);
        try {
            await postData('/User/create', userData); // Adjusted to send a single user object
            setLoading(false);
            setSuccessMessage('Vartotojas sėkmingai pridėtas!');
            setUser({
                name: '',
                surname: '',
                email: '',
                telephone: '',
                university: '',
                faculty: '',
                role: 'studentas',
            });
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

            <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>Vardas<RedAsterisk>*</RedAsterisk></>}
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                            error={!!errors.name}
                            helperText={errors.name ? 'Privalomas laukas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>Pavardė<RedAsterisk>*</RedAsterisk></>}
                            name="surname"
                            value={user.surname}
                            onChange={handleInputChange}
                            error={!!errors.surname}
                            helperText={errors.surname ? 'Privalomas laukas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>El. paštas<RedAsterisk>*</RedAsterisk></>}
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            error={!!errors.email}
                            helperText={errors.email ? 'Privalomas laukas arba neteisingas formatas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>Telefonas<RedAsterisk>*</RedAsterisk></>}
                            name="telephone"
                            value={user.telephone}
                            onChange={handleInputChange}
                            error={!!errors.telephone}
                            helperText={errors.telephone ? 'Privalomas laukas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.university}>
                            <InputLabel shrink>
                                Universitetas
                            </InputLabel>
                            <Select
                                name="university"
                                value={user.university}
                                onChange={(event) => handleInputChange(event as SelectChangeEvent<string>)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {universities.map((university) => (
                                    <MenuItem key={university.id} value={university.id.toString()}>
                                        {university.pavadinimas}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.faculty}>
                            <InputLabel shrink>
                                Fakultetas
                            </InputLabel>
                            <Select
                                name="faculty"
                                value={user.faculty}
                                onChange={(event) => handleInputChange(event as SelectChangeEvent<string>)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {faculties.map((faculty) => (
                                    <MenuItem key={faculty.id} value={faculty.id.toString()}>
                                        {faculty.pavadinimas}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel shrink>
                                Rolė<RedAsterisk>*</RedAsterisk>
                            </InputLabel>
                            <Select
                                name="role"
                                value={user.role}
                                onChange={(event) => handleInputChange(event as SelectChangeEvent<string>)}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

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
