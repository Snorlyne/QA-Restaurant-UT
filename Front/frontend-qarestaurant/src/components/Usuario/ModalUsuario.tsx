import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Avatar, Grid, Divider } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import authService from '../../services/AuthServices';
import { useNavigate } from 'react-router-dom';

interface ModalUsuarioProps {
  open: boolean;
  handleClose: () => void;
  userNombre: string | null;
}

interface UserData {
  usuario: string | null;
  rol: string | null;
  email: string | null;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ open, handleClose, userNombre }) => {
  const [userData, setUserData] = useState<UserData>({
    usuario: null,
    rol: null,
    email: null,
  });
  const navigate = useNavigate();

  const handlePasswordChange = () => { 
    handleClose();
    navigate('/dashboard/Password'); 
  };

  useEffect(() => {
    if (open && userNombre) {
      const role = authService.getRole();
      const email = authService.getEmail();

      setUserData({
        usuario: userNombre,
        rol: role,
        email: email,
      });
    }
  }, [open, userNombre]);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
  };

  return (
    <>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Información del Usuario
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Usuario: {userData.usuario}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Rol: {userData.rol}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Email: {userData.email}
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" color="success" onClick={handlePasswordChange} >
            Cambiar Contraseña
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalUsuario;
