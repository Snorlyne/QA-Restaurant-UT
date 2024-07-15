import React, { useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Container,
    Alert,
    Box
} from '@mui/material';
import Swal from 'sweetalert2';
import authService from "../../services/AuthServices";
import Loader from "../loader";

const CambioDePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            const response = await authService.changePassword(oldPassword, newPassword);
            if (response.isSuccess) {
                Swal.fire({
                    title: '¡Contraseña cambiada!',
                    text: "Se cerrará la sesión a continuación",
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'custom-swal-container'
                    }
                }).then(() => {
                    authService.logout();
                });
        
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setErrorMessage('');
            } else {
                Swal.fire({
                    title: 'Ocurrió un error',
                    text: response.message,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'custom-swal-container'
                    }
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
                customClass: {
                    container: 'custom-swal-container'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading && <Loader />}
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Cambio de Contraseña
                </Typography>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <form onSubmit={handlePasswordChange}>
                    <TextField
                        label="Contraseña actual"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <TextField
                        label="Nueva contraseña"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirmar contraseña"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" color="success" fullWidth disabled={loading}>
                            {loading ? 'Cargando...' : 'Cambiar contraseña'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
        </>
    );
};

export default CambioDePassword;
