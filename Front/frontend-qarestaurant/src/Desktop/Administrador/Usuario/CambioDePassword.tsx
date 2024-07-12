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
import axios from 'axios';
import authService from "../../../AuthService/authService";

const CambioDePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const token = authService.getToken();


    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
        
            const headers = {
                Authorization: `Bearer ${token}`
            };
        
            const response = await axios.put('https://localhost:7047/APIAuth/change-password', {
                oldPassword,
                newPassword
            }, { headers });
        
            setLoading(false);
        
            if (response.status === 200 && response.data === 'Contraseña cambiada con éxito.') {
                Swal.fire({
                    title: '¡Contraseña cambiada!',
                    text: response.data,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'custom-swal-container'
                    }
                }).then(() => {
                    // redireccionar al login o lo que sea
                });
        
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setErrorMessage('');
            } else {
                throw new Error('Hubo un problema al intentar cambiar la contraseña.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error al cambiar la contraseña:', error);
        
            const message = (error as Error).message || 'Hubo un problema al intentar cambiar la contraseña.';
        
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
                customClass: {
                    container: 'custom-swal-container'
                }
            });
        }
    };

    return (
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
    );
};

export default CambioDePassword;
