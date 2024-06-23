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
  Tab,
  Tabs,
  TextField,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect, useCallback } from "react";
import apiClient from "../../AuthService/authInterceptor";
import Loader from "../../components/loader";
import mesaIMG from "../../img/vinos.jpg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

const fakeData = [
  {
    id: 1,
    nombre: "Mesa 1",
    personas: 4,
    precio: 750,
    imagen: "https://via.placeholder.com/150",
    estado: "activo",
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
    estado: "por cobrar",
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
    estado: "pagando",
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
    estado: "pagando",
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
    estado: "pagando",
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
    estado: "pagando",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
  {
    id: 7,
    nombre: "Mesa 3",
    personas: 2,
    precio: 500,
    imagen: "https://via.placeholder.com/150",
    estado: "pagando",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
  {
    id: 8,
    nombre: "Mesa 3",
    personas: 2,
    precio: 500,
    imagen: "https://via.placeholder.com/150",
    estado: "pagando",
    pedidos: [
      { nombre: "Sushi", precio: 250 },
      { nombre: "Té Verde", precio: 50 },
    ],
  },
];
interface Comandas {
  id: number;
  meseroCargo: string;
  total: number;
  mesa: number;
  estado: string;
  imagen: string;
  ordenes: Ordenes[];
}
interface Ordenes {
  id: number;
  estado: string;
  producto: Producto;
}
interface Producto {
  nombre: string;
  precio: number;
}
const dataURLToFile = (dataurl: any, filename: any) => {
  console.log(dataurl, filename);
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
export default function DashboardCajero() {
  const [comandas, setComandas] = useState<Comandas[] | null>(null);
  const [selectedMesa, setSelectedMesa] = useState<Comandas | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeTab = (_: any, newValue: any) => {
    setTabIndex(newValue);
  };

  const filterMesasByEstado = (estado: any) => {
    if (comandas) {
      if (estado === "todos") {
        const dataFilter = comandas.filter((mesa) =>
          mesa.mesa.toString().includes(numeroMesa)
        );
        return dataFilter;
      }
      const dataFilter = comandas.filter(
        (mesa) =>
          mesa.estado === estado && mesa.mesa.toString().includes(numeroMesa)
      );
      return dataFilter;
    }
    return [];
  };

  const handleSelectMesa = (comanda: Comandas) => {
    setSelectedMesa(comanda);
  };

  const handleClose = () => {
    setSelectedMesa(null);
  };

  const handleEliminar = () => {
    setComandas(comandas!.filter((m) => m.id !== selectedMesa!.id));
    setSelectedMesa(null);
  };

  const handleFacturar = () => {
    alert(
      `Facturando la mesa ${selectedMesa!.mesa} con un total de $${
        selectedMesa!.total
      }`
    );
    handleClose();
  };
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/APICajero/Comandas");
      const data = response.data.result;
      setComandas(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }, []);
  // Cargar los datos del archivo JSON
  useEffect(() => {
    fetchData();
  }, [fetchData]);
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
                <Grid item xs={12} mb={3}>
                  <Typography
                    variant="h3"
                    color="initial"
                    sx={{ color: "rgba(72, 111, 153, 1)" }}
                  >
                    Ordenes Realizadas
                  </Typography>
                </Grid>
                <Box
                  width={"100%"}
                  justifyContent={"center"}
                  display={"flex"}
                  flexWrap={"wrap"}
                >
                  <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    centered
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Tab label="Todos" />
                    <Tab label="Activo" />
                    <Tab label="Por Cobrar" />
                    <Tab label="Pagando" />
                  </Tabs>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Buscar mesa"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                    sx={{
                      width: "90%",
                    }}
                  />
                </Box>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    height: "calc(72vh - 5rem)",
                    paddingX: ".3rem",
                    paddingY: "0px !important",
                    marginTop: "2vh",
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
                    <Grid
                      item
                      xs={12}
                      sx={{
                        ...(comandas != null && {
                          display: "none",
                        }),
                      }}
                    >
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h5" color="initial">
                          No hay comandas por ahora
                        </Typography>
                      </Box>
                    </Grid>
                    {filterMesasByEstado(
                      tabIndex === 0
                        ? "todos"
                        : tabIndex === 1
                        ? "Activo"
                        : tabIndex === 2
                        ? "Por cobrar"
                        : "Pagando"
                    ).map((mesa: Comandas) => (
                      <>
                        <Grid item xs={6} key={mesa.id} display={"grid"}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor:
                                mesa.estado === "Activo"
                                  ? "green"
                                  : mesa.estado === "Por cobrar"
                                  ? "orange"
                                  : mesa.estado === "Pagando"
                                  ? "red"
                                  : "gray",
                              position: "absolute",
                              borderRadius: "5px",
                              alignSelf: "flex-start",
                              justifySelf: "flex-end",
                            }}
                          ></div>
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
                                  Mesa {mesa.mesa}
                                </Typography>
                                <Typography
                                  variant="h5"
                                  component="div"
                                  sx={{ fontWeight: "bold", mb: 2 }}
                                >
                                  ${mesa.total}
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSelectMesa(mesa)}
                                >
                                  <InfoOutlinedIcon />
                                </Button>
                              </CardContent>
                            </Box>
                            <CardMedia
                              component="img"
                              image={
                                mesa.imagen != null
                                  ? URL.createObjectURL(
                                      dataURLToFile(mesa.imagen, "photo.png")
                                    )
                                  : mesaIMG
                              }
                              alt={"mesa " + mesa.mesa}
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
                      </>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                ...(selectedMesa == null && {
                  display: "flex",
                }),
              }}
            >
              {selectedMesa ? (
                <ClickAwayListener onClickAway={handleClose}>
                  <Card
                    sx={{
                      maxWidth: 600,
                      borderRadius: 2,
                      boxShadow: 3,
                      bgcolor: "#f1f1f1",
                    }}
                  >
                    <CardContent>
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          Mesa {selectedMesa.mesa}
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: "regular", mb: 1 }}
                        >
                          Estado{" "}
                          <span
                            style={{
                              color:
                                selectedMesa.estado === "Activo"
                                  ? "green"
                                  : selectedMesa.estado === "Por cobrar"
                                  ? "orange"
                                  : selectedMesa.estado === "Pagando"
                                  ? "red"
                                  : "gray",
                              fontWeight: "bold",
                            }}
                          >
                            {selectedMesa.estado}
                          </span>
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Total: ${selectedMesa.total}
                      </Typography>
                      <CardMedia
                        component="img"
                        image={
                          selectedMesa.imagen != null
                            ? URL.createObjectURL(
                                dataURLToFile(selectedMesa.imagen, "photo.png")
                              )
                            : mesaIMG
                        }
                        alt={"Mesa " + selectedMesa.mesa}
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
                      <List
                        sx={{
                          width: "100%",
                          height: "calc(25vh - 10px)",
                          overflowY: "scroll",
                          scrollbarWidth: "thin",
                          paddingX: ".3rem",
                          paddingY: "0px !important",
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedMesa.ordenes.map((orden, index: any) => (
                          <ListItem
                            key={index}
                            sx={{
                              width: "50%",
                            }}
                          >
                            <ListItemText
                              primary={orden.producto.nombre}
                              secondary={`$${orden.producto.precio}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignSelf: "self-end",
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
                          disabled={selectedMesa.estado === "Activo"}
                          variant="contained"
                          color="primary"
                          onClick={handleFacturar}
                        >
                          Facturar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </ClickAwayListener>
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
