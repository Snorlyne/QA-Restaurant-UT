import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import logo from '../img/LogoBien.jpg';
import vino from '../img/vinos.jpg';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const GlobalStyle = createGlobalStyle`
  body {
    background-color: #FFF6ED; 
  }
`;

const Background = styled.div`
  background-image: url(${vino});
  background-size: cover;
  background-position: center;
  height: 50vh; 
  width: 100%;
  position: relative; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
  position: absolute; 
  z-index: 1;
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  border-radius: 20%;
`;

const Titulo = styled.h1`
  font-size: 24px;
  margin-top: 120px;
  justify-content: center;
  display: flex;
  

  @media (min-width: 768px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const Subtitulo = styled.p`
  font-size: 16px;
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
  left: 5px;
  position: relative;


  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

const Boton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #486F99; 
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%; // Hacemos que el botón tenga el ancho completo
  margin: 0; // Eliminamos los márgenes laterales
  hoover: pointer;

  &:hover {
    background-color: #486F99;
  }

  &:active {
    background-color: gray;
  }

  @media (max-width: 768px) { 
    width: 100%; 
    margin: 0; 
    margin-top: 5px; 
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 12px 24px;
    font-size: 18px;
    width: 80%; 
  }

  @media (min-width: 1025px) {
    padding: 14px 28px;
    font-size: 20px;
    width: 120%;
    position: relative;
    right: 35px;
  }
`;

const ContenedorCentrado = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%; // Aseguramos que el contenedor tenga el ancho completo
`;

const App = () => {
  const navigate = useNavigate();

  const handleBienvenido = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      navigate('/dashboard');
    } catch (err) {
      console.error('Error: ', err);}
  };
  
  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <GlobalStyle />
        <Background />
        <Logo src={logo} alt="Logo" />
        <ContenedorCentrado>
          <form onSubmit={handleBienvenido}>
            <Titulo>Bienvenido Cocinero</Titulo>
            <Subtitulo>Aquí podrás visualizar los pedidos realizados.</Subtitulo>
            <Boton type="submit">Continuar</Boton>
          </form>
        </ContenedorCentrado>
      </Grid>
    </>
  );
};
export default App;