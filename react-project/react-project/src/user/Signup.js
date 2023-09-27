import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GeneralContext } from '../App';
import Switch from '@mui/material/Switch';
import { FormControlLabel } from '@mui/material';
import Joi from 'joi';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { JOI_HEBREW } from './joi-hebrew';

const defaultTheme = createTheme();

export default function Signup() {
    const { setLoader } = useContext(GeneralContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formObject, setFormObject] = useState({});
    const navigate = useNavigate();

    const structure = [
        { name: 'firstName', type: 'text', label: 'שם פרטי', required: true, block: false },
        { name: 'middleName', type: 'text', label: 'שם אמצעי', required: false, block: false },
        { name: 'lastName', type: 'text', label: 'שם משפחה', required: true, block: false },
        { name: 'phone', type: 'tel', label: 'טלפון', required: true, block: false },
        { name: 'email', type: 'email', label: 'אימייל', required: true, block: false },
        { name: 'password', type: 'password', label: 'סיסמה', required: true, block: false },
        { name: 'imgUrl', type: 'text', label: 'קישור לתמונה', required: false, block: true },
        { name: 'imgAlt', type: 'text', label: 'תיאור תמונה', required: false, block: false },
        { name: 'state', type: 'text', label: 'מחוז', required: false, block: false },
        { name: 'country', type: 'text', label: 'מדינה', required: true, block: false },
        { name: 'city', type: 'text', label: 'עיר', required: true, block: false },
        { name: 'street', type: 'text', label: 'רחוב', required: true, block: false },
        { name: 'houseNumber', type: 'number', label: 'מספר בית', required: true, block: false },
        { name: 'zip', type: 'number', label: 'מיקוד', required: false, block: false },
        { name: 'business', type: 'boolean', label: 'לקוח עסקי', required: false, block: false },
    ];

    const schema = Joi.object({
        firstName: Joi.string().required().error(() => new Error(JOI_HEBREW['string.base'])),
        lastName: Joi.string().required().error(() => new Error(JOI_HEBREW['string.base'])),
        phone: Joi.string().required().error(() => new Error(JOI_HEBREW['string.base'])),
        email: Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(JOI_HEBREW['string.email'])),
        password: Joi.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d)[A-Za-z\d!@%$#^&*_\-]{8,}$/)
            .required()
            .error(() => new Error('Password does not meet the requirements.')),
        country: Joi.string().required().error(() => new Error(JOI_HEBREW['string.base'])),
        city: Joi.string().required().error(() => new Error(JOI_HEBREW['string.base'])),
        street: Joi.string().required().error(() => new Error(JOI_HEBREW['string.base'])),
        houseNumber: Joi.number().required().error(() => new Error(JOI_HEBREW['number.base'])),
    });

    const isPasswordValid = (password) => {
        return schema.validate({ password }).error === undefined;
    };

    // Validate the entire form
    const validateForm = () => {
        const { error } = schema.validate(formObject);
        return error === undefined;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setIsLoading(true);

        // Check if the entire form is valid before submitting
        if (!validateForm()) {
            setError(' . הסיסמא צריכה להכיל 8 תווים לפחות. אנא שים לב כי הסיסמא אמורה להכיל אות גדולה, אות קטנה, לפחות 4 מספרים ואחד מהסימנים(!@%$#^&*) ');
            setIsLoading(false);
            return;
        }

        const enteredPassword = formObject.password;

        if (!isPasswordValid(enteredPassword)) {
            setError('Password does not meet the requirements.');
            setIsLoading(false);
            return;
        }
        console.log(isPasswordValid(enteredPassword));

        setLoader(true);

        fetch(`https://api.shipap.co.il/clients/signup?token=d2960c7d-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formObject),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.text().then((x) => {
                        throw new Error(x);
                    });
                }
            })
            .then(() => {
                navigate('/login');
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
                setLoader(false);
            });
    };

    const handleFieldChange = (ev, fieldName) => {
        // Update the formObject with the field change
        const updatedFormObject = { ...formObject };
        updatedFormObject[fieldName] = ev.target.value;
        setFormObject(updatedFormObject);
    };

    // Check if all required fields are filled in and enable/disable the button accordingly
    const allRequiredFieldsFilled = structure.every((field) => {
        return !field.required || (field.required && formObject[field.name]);
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        הרשמה
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {structure.map((s) => (
                                <Grid key={s.name} item xs={12} sm={s.block ? 12 : 6}>
                                    {s.type === 'boolean' ? (
                                        <FormControlLabel
                                            name={s.name}
                                            control={<Switch color="primary" />}
                                            label={s.label}
                                            labelPlacement="start"
                                        />
                                    ) : (
                                        <TextField
                                            name={s.name}
                                            required={s.required}
                                            fullWidth
                                            id={s.name}
                                            label={s.label}
                                            type={s.type}
                                            onChange={(ev) => handleFieldChange(ev, s.name)}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                        {error && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                        {isLoading ? (
                            <CircularProgress size={24} sx={{ ml: 2, mt: 2 }} />
                        ) : (
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2 }}
                                disabled={!allRequiredFieldsFilled}
                            >
                                הרשם
                            </Button>
                        )}
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link to="/login">להתחברות לחץ כאן</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
