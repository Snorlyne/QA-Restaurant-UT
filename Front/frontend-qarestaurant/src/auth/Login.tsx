import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthServices";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";
import Logo from "../assets/img/Logo.png";
import agua from "../assets/img/agua.jpg";
import LoadingButton from "@mui/lab/LoadingButton";
import ReCAPTCHA from "react-google-recaptcha";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const key = process.env.REACT_APP_APIKEY_RECAPTCHA || "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setError("Por favor, completa el ReCAPTCHA");
      return;
    }
    try {
      setLoading(true);
      const login = await authService.login(email, password);
      switch (login) {
        case "Root":
          navigate("/dashboard");
          break;
        case "Admin":
          navigate("/dashboard");
          break;
        case "Chef":
          navigate("/unauthorized");
          break;
        case "Waiter":
          navigate("/meseros2");
          break;
        case "Cashier":
          navigate("/cajeros");
          break;
        default:
          setError("Correo o contraseña incorrecta");
          break;
      }
    } catch (err) {
      setError("Correo o contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ImageContainer>
        <img src={agua} alt="Fondo de agua" />
      </ImageContainer>
      <LoginContainer>
        <FormContainer>
          <LogoImage src={Logo} alt="QA Restaurant" />
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            QA Restaurant
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
              <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdMEQ8qAAAAAET4u4iihg9iBzHH0eLnITzULTG9" 
                  onChange={() => setError("")}
                  theme="light"
                />
              </Grid>
              <Grid item xs={12}>
              <LoadingButton
                    fullWidth
                    variant="contained"
                    type="submit"
                    style={{ backgroundColor: "#486F99", borderRadius: "10px" }}
                    loading={loading}
                    loadingIndicator={
                      <CircularProgress
                        size={18}
                        sx={{
                          color: "white",
                        }}
                      />
                    }
                  >
                    Iniciar sesión
                  </LoadingButton>
              </Grid>
            </Grid>
          </form>
          {error && (
            <Typography color="error" align="center" className="error">
              {error}
            </Typography>
          )}
        </FormContainer>
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
  width: 250px;
  margin-bottom: -3rem;
  height: auto;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100vh;
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
  background-color: #fff6ed;
  height: 100vh;
  max-height: 100vh;
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 1rem; 
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  height: auto; 
  overflow: hidden; 
`;
