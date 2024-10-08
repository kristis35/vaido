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
import { getData, postData } from '../../services/api/Axios';
import { University, Faculty, Useris } from '../../interfaces'; // Import interfaces from the new file

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
    const [user, setUser] = useState<Useris>({
        id: 0,
        prisijungimoVardas: '',
        vardas: '',
        pavarde: '',
        telefonas: '',
        fakultetasId: 0,
        universitetasId: 0,
        vartotojoRole: 'studentas',
    });
    const [universities, setUniversities] = useState<University[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const universityList = await getData<University[]>('/UniversityCrud/all');
                setUniversities(universityList);
            } catch (error) {
                console.error('Failed to fetch universities:', error);
            }
        };

        const fetchFaculties = async () => {
            try {
                const facultyList = await getData<Faculty[]>('/Fakultetas/all');
                setFaculties(facultyList);
            } catch (error) {
                console.error('Failed to fetch faculties:', error);
            }
        };

        fetchUniversities();
        fetchFaculties();
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number | string>
    ) => {
        const { name, value } = event.target;

        if (name === 'universitetasId') {
            const universityId = parseInt(value as string);
            setFilteredFaculties(faculties.filter(faculty => faculty.universitetasId === universityId));
            setUser({ ...user, fakultetasId: 0, [name]: universityId });
        } else if (name === 'fakultetasId' || name === 'universitetasId') {
            setUser({ ...user, [name]: parseInt(value as string) });
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const validateFields = () => {
        const validationErrors: { [key: string]: boolean } = {};
        validationErrors.vardas = !user.vardas;
        validationErrors.pavarde = !user.pavarde;
        validationErrors.prisijungimoVardas = !user.prisijungimoVardas || !emailRegex.test(user.prisijungimoVardas);
        validationErrors.telefonas = !user.telefonas;
        validationErrors.vartotojoRole = !user.vartotojoRole;

        setErrors(validationErrors);
        return Object.values(validationErrors).every(isValid => !isValid);
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            alert('Prašome užpildyti visus privalomus laukus.');
            return;
        }

        const userData: Partial<Useris> = {
            prisijungimoVardas: user.prisijungimoVardas,
            vardas: user.vardas,
            pavarde: user.pavarde,
            telefonas: user.telefonas,
            vartotojoRole: user.vartotojoRole,
        };
        if (user.universitetasId) {
            userData.universitetasId = user.universitetasId;
        }
        if (user.fakultetasId) {
            userData.fakultetasId = user.fakultetasId;
        }

        setLoading(true);
        try {
            await postData('/User/create', userData); 
            setLoading(false);
            setSuccessMessage('Vartotojas sėkmingai pridėtas!');
            setUser({
                id: 0,
                prisijungimoVardas: '',
                vardas: '',
                pavarde: '',
                telefonas: '',
                fakultetasId: 0,
                universitetasId: 0,
                vartotojoRole: 'studentas',
            });
            setFilteredFaculties([]);
        } catch (error) {
            console.error('Failed to create user:', error);
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
                            name="vardas"
                            value={user.vardas}
                            onChange={handleInputChange}
                            error={!!errors.vardas}
                            helperText={errors.vardas ? 'Privalomas laukas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>Pavardė<RedAsterisk>*</RedAsterisk></>}
                            name="pavarde"
                            value={user.pavarde}
                            onChange={handleInputChange}
                            error={!!errors.pavarde}
                            helperText={errors.pavarde ? 'Privalomas laukas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>El. paštas<RedAsterisk>*</RedAsterisk></>}
                            name="prisijungimoVardas"
                            value={user.prisijungimoVardas}
                            onChange={handleInputChange}
                            error={!!errors.prisijungimoVardas}
                            helperText={errors.prisijungimoVardas ? 'Privalomas laukas arba neteisingas formatas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={<>Telefonas<RedAsterisk>*</RedAsterisk></>}
                            name="telefonas"
                            value={user.telefonas}
                            onChange={handleInputChange}
                            error={!!errors.telefonas}
                            helperText={errors.telefonas ? 'Privalomas laukas' : ''}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.universitetasid}>
                            <InputLabel shrink>
                                Universitetas
                            </InputLabel>
                            <Select
                                name="universitetasid"
                                value={user.universitetasId.toString()}
                                onChange={(event) => handleInputChange(event as SelectChangeEvent<number>)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {universities.map((university) => (
                                    <MenuItem key={university.id} value={university.id}>
                                        {university.pavadinimas}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.fakultetasid}>
                            <InputLabel shrink>
                                Fakultetas
                            </InputLabel>
                            <Select
                                name="fakultetasid"
                                value={user.fakultetasId.toString()}
                                onChange={(event) => handleInputChange(event as SelectChangeEvent<number>)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {filteredFaculties.map((faculty) => (
                                    <MenuItem key={faculty.id} value={faculty.id}>
                                        {faculty.pavadinimas}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.vartotojoRole}>
                            <InputLabel shrink>
                                Rolė<RedAsterisk>*</RedAsterisk>
                            </InputLabel>
                            <Select
                                name="vartotojoRole"
                                value={user.vartotojoRole}
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
