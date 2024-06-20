import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";

const fakeData = [
  {
    id: 1,
    nombre: "Mesa 1",
    personas: 4,
    precio: 750,
    imagen: "https://via.placeholder.com/150",
    pedidos: [
      { nombre: "Pizza", precio: 200 },
      { nombre: "Ensalada", precio: 150 },
      { nombre: "Pizza", precio: 200 },
      { nombre: "Ensalada", precio: 150 },
      { nombre: "Pizza", precio: 200 },
      { nombre: "Ensalada", precio: 150 },
      { nombre: "Pizza", precio: 200 },
      { nombre: "Ensalada", precio: 150 },
      { nombre: "Pizza", precio: 200 },
      { nombre: "Ensalada", precio: 150 },
      { nombre: "Pizza", precio: 200 },
      { nombre: "Ensalada", precio: 150 },
    ],
  },
  {
    id: 2,
    nombre: "Mesa 2",
    personas: 6,
    precio: 1200,
    imagen: "https://via.placeholder.com/150",
    pedidos: [
      { nombre: "Hamburguesa", precio: 300 },
      { nombre: "Refresco", precio: 100 },
    ],
  },
  {
    id: 3,
    nombre: "Mesa 3",
    personas: 2,
    precio: 500,
    imagen: "https://via.placeholder.com/150",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
  {
    id: 4,
    nombre: "Mesa 3",
    personas: 2,
    precio: 500,
    imagen: "https://via.placeholder.com/150",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
  {
    id: 5,
    nombre: "Mesa 3",
    personas: 2,
    precio: 500,
    imagen: "https://via.placeholder.com/150",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
  {
    id: 6,
    nombre: "Mesa 3",
    personas: 2,
    precio: 500,
    imagen: "https://via.placeholder.com/150",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
];
export default function DashboardCajero() {
  const [mesas, setMesas] = useState<any>([]);
  const [selectedMesa, setSelectedMesa] = useState<any>(null);
  const handleSelectMesa = (mesa: any) => {
    setSelectedMesa(mesa);
  };

  const handleClose = () => {
    setSelectedMesa(null);
  };

  const handleEliminar = () => {
    setMesas(mesas.filter((m: any) => m.id !== selectedMesa.id));
    handleClose();
  };

  const handleFacturar = () => {
    alert(
      `Facturando la mesa ${selectedMesa.nombre} con un total de $${selectedMesa.precio}`
    );
    handleClose();
  };
  // Cargar los datos del archivo JSON
  useEffect(() => {
    setMesas(fakeData);
  }, []);
  return (
    <>
      <Box sx={{ flexGrow: 1, height: "100%" }}>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "white",
            color: "primary.contrastText",
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="default"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              color={"black"}
            >
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container>
        <Box
          sx={{
            display: "flex",
          }}
          mt={5}
        >
          <Grid
            container
            spacing={10}
            direction="row"
            wrap="wrap"
            sx={{
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <Grid item xs={7}>
              <Grid
                container
                spacing={4}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                alignContent="stretch"
                wrap="wrap"
              >
                <Grid item xs={12}>
                  <Typography
                    variant="h3"
                    color="initial"
                    sx={{ color: "rgba(72, 111, 153, 1)" }}
                  >
                    Ordenes Realizadas
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    height: "calc(78vh - 5rem)",
                    paddingX: ".3rem",
                    paddingY: "0px !important",
                    marginTop: "10vh"
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    wrap="wrap"
                  >
                    {mesas.map((mesa: any) => (
                      <Grid item xs={6}>
                        <Card
                          key={mesa.id}
                          sx={{
                            display: "flex",
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: 0,
                            bgcolor: "#f9f9f9",
                            marginBottom: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              width: "40%",
                            }}
                          >
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ fontWeight: "bold", mb: 1 }}
                              >
                                {mesa.nombre}
                              </Typography>
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontWeight: "bold", mb: 2 }}
                              >
                                ${mesa.precio}
                              </Typography>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSelectMesa(mesa)}
                              >
                                +
                              </Button>
                            </CardContent>
                          </Box>
                          <CardMedia
                            component="img"
                            image={mesa.imagen}
                            alt={mesa.nombre}
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: "50%",
                              objectFit: "cover",
                              alignSelf: "center",
                              margin: "auto",
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              {selectedMesa ? (
                <Card
                  sx={{
                    maxWidth: 600,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: "#f1f1f1",
                  }}
                >
                  <CardContent sx={{
                    height: "100%",
                  }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {selectedMesa.nombre}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Personas: {selectedMesa.personas}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Precio Total: ${selectedMesa.precio}
                    </Typography>
                    <CardMedia
                      component="img"
                      image={selectedMesa.imagen}
                      alt={selectedMesa.nombre}
                      sx={{
                        width: "100%",
                        height: 200,
                        borderRadius: 2,
                        objectFit: "cover",
                        mb: 2,
                      }}
                    />
                    <Divider />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Pedidos:
                    </Typography>
                    <List sx={{
                      width: "100%",
                      height: "calc(15vw - 1.5rem)",
                      overflowY: "scroll",
                      scrollbarWidth: "thin",
                      paddingX: ".3rem",
                      paddingY: "0px!important",
                      display: "flex",
                      flexWrap: "wrap",
                    }}>
                      {selectedMesa.pedidos.map((pedido: any, index: any) => (
                        <ListItem key={index} sx={{
                          width: "50%",
                        }}>
                          <ListItemText
                            primary={pedido.nombre}
                            secondary={`$${pedido.precio}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignSelf: "self-end"
                      }}
                      mt={2}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleEliminar}
                      >
                        Eliminar Mesa
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFacturar}
                      >
                        Facturar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="h6" color="text.secondary">
                  Seleccione una mesa para ver los detalles.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
