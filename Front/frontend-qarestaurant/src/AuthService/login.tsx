import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../AuthService/authService";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styled from "styled-components";
import Logo from "../img/Logo.png";
import agua from "../img/agua.jpg";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      debugger;
      const login = await authService.login(email, password);
      switch (login) {
        case "Root":
          navigate("/dashboard");
          break;
        case "Admin":
          navigate("/dashboard");
          break;
        case "Chef":
          navigate("/dashboard");
          break;
        case "Waiter":
          navigate("/dashboard");
          break;
        case "Cashier":
          navigate("/dashboard");
          break;
        default:
          setError("Error: Correo o contraseña incorrecta");
          break;
      }
    } catch (err) {
      setError("Error: Correo o contraseña incorrecta");
    }
  };

  return (
    <Container>
      <ImageContainer>
        <img src={agua} alt="Fondo de agua" />
      </ImageContainer>
      <LoginContainer>
        <FormOtroContainer>
          <FormContainer>
            <LogoImage src={Logo} alt="QA Restaurant" />
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              QA Restaurant
            </Typography>
            <form onSubmit={handleLogin}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Mantener sesión abierta"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    style={{ backgroundColor: "#486F99", borderRadius: "10px" }}
                  >
                    Iniciar sesión
                  </Button>
                </Grid>
              </Grid>
            </form>
            {error && (
              <Typography color="error" align="center" className="error">
                {error}
              </Typography>
            )}
          </FormContainer>
        </FormOtroContainer>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #fff6ed;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const LogoImage = styled.img`
  width: 300px;
  height: auto;
`;
const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #fff6ed;
`;
const FormOtroContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
`;
