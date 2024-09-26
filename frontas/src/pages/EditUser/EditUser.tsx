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
import { useParams, useNavigate } from 'react-router-dom';
import { getData, putData } from '../../services/api/Axios';
import { University, Faculty, Useris } from '../../interfaces';

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

const EditUser: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<Useris>({
        id: 0,
        vardas: '',
        pavarde: '',
        prisijungimoVardas: '',
        telefonas: '',
        universitetasId: 0,
        fakultetasId: 0,
        vartotojoRole: 'studentas',
    });
    const [universities, setUniversities] = useState<University[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const universityList = await getData<University[]>('/UniversityCrud/all');
                setUniversities(universityList);
            } catch (error) {
            }
        };

        const fetchFaculties = async () => {
            try {
                const facultyList = await getData<Faculty[]>('/Fakultetas/all');
                setFaculties(facultyList);
            } catch (error) {
            }
        };

        const fetchUser = async () => {
            if (!userId) return;
            try {
                const userData = await getData<Useris>(`/User/get-user/${userId}`);
                setUser({
                    id: userData.id,
                    vardas: userData.vardas,
                    pavarde: userData.pavarde,
                    prisijungimoVardas: userData.prisijungimoVardas,
                    telefonas: userData.telefonas,
                    universitetasId: userData.universitetasId || 0,
                    fakultetasId: userData.fakultetasId || 0,
                    vartotojoRole: userData.vartotojoRole,
                });
            } catch (error) {
            }
        };

        fetchUniversities();
        fetchFaculties();
        fetchUser();
    }, [userId]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
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

        const userData: any = {
            prisijungimoVardas: user.prisijungimoVardas,
            vardas: user.vardas,
            pavarde: user.pavarde,
            telefonas: user.telefonas,
            vartotojoRole: user.vartotojoRole,
        };

        // Only add universitetasId if a university is selected
        if (user.universitetasId) {
            userData.universitetasId = user.universitetasId;
        }

        // Only add fakultetasId if a faculty is selected
        if (user.fakultetasId) {
            userData.fakultetasId = user.fakultetasId;
        }

        setLoading(true);
        try {
            await putData(`/User/edit-user/${userId}`, userData);
            setLoading(false);
            setSuccessMessage('Vartotojo informacija sėkmingai atnaujinta!');
            setTimeout(() => navigate('/userlist'), 2000);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleReturn = () => {
        navigate('/userlist');
    };

    return (
        <Container maxWidth="md" style={{ padding: 16 }}>
            {successMessage && (
                <Box marginBottom={2}>
                    <Alert severity="success">{successMessage}</Alert>
                </Box>
            )}
            <Grid item xs={6}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReturn}
                    fullWidth
                >
                    Grįžti į sąrašą
                </Button>
            </Grid>
            <Paper elevation={3} style={{ padding: 16, marginBottom: 16, marginTop: 16  }}>
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
                        <FormControl fullWidth error={!!errors.universitetas}>
                            <InputLabel shrink>
                                Universitetas
                            </InputLabel>
                            <Select
                                name="universitetas"
                                value={user.universitetasId}
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
                        <FormControl fullWidth error={!!errors.fakultetas}>
                            <InputLabel shrink>
                                Fakultetas
                            </InputLabel>
                            <Select
                                name="fakultetas"
                                value={user.fakultetasId}
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

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Kraunasi...' : 'Atnaujinti'}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default EditUser;
