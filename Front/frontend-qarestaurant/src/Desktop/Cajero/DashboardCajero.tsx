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
  Drawer,
  Avatar,
  ListItemIcon,
  Slide,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "../../AuthService/authInterceptor";
import mesaIMG from "../../img/vinos.jpg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Swal from "sweetalert2";
import authService from "../../AuthService/authService";
import LazyLoad from "react-lazyload";
import deepOrange from "@mui/material/colors/deepOrange";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

interface Comandas {
  id: number;
  meseroCargo: string;
  cobrador: string;
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
  const [open, setOpen] = useState(false);
  const [openCommanda, setOpenCommanda] = useState(false);
  const name = authService.getUser();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará la sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cerrar sesión",
      customClass: {
        container: "custom-swal-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        authService.logout();
      }
    });
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const filteredMesas = useMemo(() => {
    if (comandas) {
      if (tabIndex === 0) {
        return comandas.filter(
          (mesa) =>
            mesa.mesa.toString().includes(numeroMesa) &&
            mesa.estado !== "Pagado"
        );
      }
      const estado =
        tabIndex === 1
          ? "Activo"
          : tabIndex === 2
          ? "Por cobrar"
          : tabIndex === 3
          ? "Pagando"
          : "Pagado";
      return comandas.filter(
        (mesa) =>
          mesa.estado === estado && mesa.mesa.toString().includes(numeroMesa)
      );
    }
    return [];
  }, [comandas, tabIndex, numeroMesa]);

  const handleSelectMesa = (comanda: Comandas) => {
    setTimeout(() => {
      setOpenCommanda(true);
      setSelectedMesa(comanda);
    }, 250);
    setOpenCommanda(false);
  };

  const handleClose = () => {
    setOpenCommanda(false);
  };

  const handleEliminar = async (id: number) => {
    try {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Se eliminará la comanda",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        customClass: {
          container: "custom-swal-container",
        },
      }).then(async (resul) => {
        if (resul.isConfirmed) {
          const response = await apiClient.delete(
            `/APICajero/Comanda/id?id=${id}`
          );
          if (!response.data.isSuccess) {
            Swal.fire({
              title: "Error al eliminar la comanda",
              text: response.data.message,
              icon: "error",
              confirmButtonText: "Aceptar",
              customClass: {
                container: "custom-swal-container",
              },
            });
            return
          }
          Swal.fire({
            title: "Comanda eliminada",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              container: "custom-swal-container",
            },
          });
        }
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: "Error al eliminar la comanda",
        text: err.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          container: "custom-swal-container",
        },
      });
    }
  };
  const handleEliminarOrden = async (id: number) => {
    try {
      let message: string = "Se eliminará la orden";
      let title: string = "Orden eliminada";
      if (selectedMesa?.ordenes.length === 1) {
        message = "Se eliminará la comanda y la única orden";
        title = "Comanda eliminada y la única orden";
      }
      Swal.fire({
        title: "¿Estás seguro?",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        customClass: {
          container: "custom-swal-container",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await apiClient.delete(
            `/APICajero/Orden/id?id=${id}`
          );
          if (!response.data.isSuccess) {
            throw new Error("No se pudo eliminar la orden");
          }
          if (selectedMesa?.ordenes.length === 1) {
            setOpenCommanda(false);
            setSelectedMesa(null);
            Swal.fire({
              title: title,
              text: response.data.message,
              icon: "success",
              confirmButtonText: "Aceptar",
              customClass: {
                container: "custom-swal-container",
              },
            });
            return;
          }
          const newOrdenes = selectedMesa!.ordenes.filter(
            (orden: Ordenes) => orden.id !== id
          );
          setSelectedMesa({
            ...selectedMesa!,
            ordenes: newOrdenes,
          });
          Swal.fire({
            title: title,
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              container: "custom-swal-container",
            },
          });
        }
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: "Error al eliminar la orden",
        text: err.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          container: "custom-swal-container",
        },
      });
    }
  };

  const handleGenerarTicket = (comanda: Comandas) => {
    const newWindow = window.open("", "", "width=800,height=600");
    if (newWindow) {
      newWindow.document.write(`
<html>
      <head>
        <title>Ticket</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .ticket-container {
            width: 300px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #ffffff;
            margin: 20px auto;
            text-align: left;
          }
          .ticket-header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            color: #333;
          }
          .ticket-item {
            margin-bottom: 10px;
            color: #555;
          }
          .ticket-footer {
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            color: #333;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 100px;
            border-radius: 50%;
          }
          .item-title {
            font-weight: bold;
          }
          .item-price {
            float: right;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="ticket-header">Ticket de Venta</div>
          <div class="ticket-item"><span class="item-title">ID:</span> ${
            comanda.id
          }</div>
          <div class="ticket-item"><span class="item-title">Mesa:</span> ${
            comanda.mesa
          }</div>
          <div class="ticket-item"><span class="item-title">Mesero:</span> ${
            comanda.meseroCargo
          }</div>
          <div class="ticket-item"><span class="item-title">Cobrador:</span> ${
            comanda.cobrador
          }</div>
          <div class="ticket-item"><strong>Ordenes:</strong></div>
          ${comanda.ordenes
            .map(
              (orden) => `
            <div class="ticket-item">
              <span class="item-title">${
                orden.producto.nombre
              }</span><span class="item-price">$${orden.producto.precio.toFixed(
                2
              )}</span>
            </div>
          `
            )
            .join("")}
          <div class="ticket-footer">
            Total: $${comanda.total.toFixed(2)}
          </div>
        </div>
      </body>
      </html>
      `);
      newWindow.document.close();
      newWindow.focus();
    }
  };

  const handleFacturar = async (id: number) => {
    try {
      const response = await apiClient.post(`/APICajero/Ticket/:id?id=${id}`);
      if (response.data.isSuccess === true) {
        Swal.fire({
          title: "Generado",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            container: "custom-swal-container",
          },
        }).then(() => {
          handleGenerarTicket(response.data.result);
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (e: any) {
      console.error("Error:", e);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          container: "custom-swal-container",
        },
      });
    } finally {
      fetchData();
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/APICajero/Comandas");
      const data = response.data.result;
      setComandas(data);
      if (selectedMesa !== null) {
        setSelectedMesa(
          data.filter((m: Comandas) => m.id === selectedMesa.id).length > 0
            ? data.filter((m: Comandas) => m.id === selectedMesa.id)[0]
            : null
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }, [selectedMesa]);

  useEffect(() => {
    if (selectedMesa == null) {
      fetchData();
    }
  }, [fetchData, selectedMesa]);

  useEffect(() => {
    const idEmpresa = authService.getCompany();
    let conectado: boolean = false;
    const connection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7047/commandHub?idEmpresa=${idEmpresa}`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Conexión establecida correctamente.");
        conectado = true;
      } catch (error) {
        console.error("Error al iniciar la conexión:", error);
      }
    };

    startConnection();

    connection.on("OnCommandCreated", (command) => {
      if (comandas != null) {
        setComandas((prevCommands) => [...prevCommands!, command]);
      } else {
        setComandas([command]);
      }
    });

    connection.on("OnCommandUpdated", (command) => {
      if (comandas != null) {
        setComandas((prevCommands) =>
          prevCommands!.map((c) =>
            c.id === command.id ? { ...c, ...command } : c
          )
        );
      }
    });
    connection.on("OnCommandDeleted", (deletedCommandId) => {
      console.log("Eliminando");
      if (comandas != null) {
        setComandas((prevCommands) =>
          prevCommands!.filter((c) => c.id !== deletedCommandId)
        );
        setSelectedMesa(null);
      }
    });

    return () => {
      if (conectado) {
        connection.stop();
        console.log("Conexión detenida.");
      }
    };
  }, [comandas]);

  return (
    <>
      <Box sx={{ flexGrow: 1, height: "100%" }}>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <div role="presentation" style={{ width: 250 }}>
            <div style={{ display: "flex", alignItems: "center", padding: 16 }}>
              <Avatar
                style={{ marginRight: 16 }}
                sx={{ bgcolor: deepOrange[500] }}
              >
                {name?.charAt(0)}
              </Avatar>
              <div>
                <Typography variant="h6">{name}</Typography>
              </div>
            </div>
            <List>
              <ListItem button style={{ color: "red" }} onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon style={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </ListItem>
            </List>
          </div>
        </Drawer>
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
              onClick={toggleDrawer(true)}
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
            <Button onClick={fetchData}>fecth</Button>
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
                  <Tabs value={tabIndex} onChange={handleChangeTab} centered>
                    <Tab label={`Todos`} />
                    <Tab
                      label={
                        <Badge color="error" variant="dot">
                          Activo
                        </Badge>
                      }
                    />
                    <Tab
                      label={
                        <Badge color="error" variant="dot">
                          Por Cobrar
                        </Badge>
                      }
                    />
                    <Tab
                      label={
                        <Badge color="error" variant="dot">
                          Pagando
                        </Badge>
                      }
                    />
                    <Tab
                      label={
                        <Badge color="error" variant="dot">
                          Pagado
                        </Badge>
                      }
                    />
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
                    scrollbarWidth: "none",
                    scrollbarColor: "transparent",
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
                        ...(comandas !== null &&
                          comandas!.length > 0 && {
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
                    {filteredMesas.map((mesa: Comandas) => (
                      <Grid item xs={6} key={mesa.id}>
                        <LazyLoad
                          style={{
                            display: "grid",
                          }}
                        >
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
                            <Typography
                              variant="body2"
                              sx={{ mb: 0.1, mr: 1 }}
                              alignSelf={"flex-end"}
                            >
                              ID: {mesa.id}
                            </Typography>
                          </Card>
                        </LazyLoad>
                      </Grid>
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
                <Slide direction="up" in={openCommanda}>
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
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Total: ${selectedMesa.total}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          ID: {selectedMesa.id}
                        </Typography>
                      </Box>
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
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              color="error"
                              onClick={() => handleEliminarOrden(orden.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
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
                        {selectedMesa.estado !== "Pagado" ? (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={async () =>
                              handleEliminar(selectedMesa.id)
                            }
                          >
                            Eliminar Mesa
                          </Button>
                        ) : null}
                        {selectedMesa.estado === "Por cobrar" ? (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={async () => {
                              await handleFacturar(selectedMesa.id);
                            }}
                          >
                            Generar Ticket
                          </Button>
                        ) : selectedMesa.estado === "Pagando" ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              handleGenerarTicket(selectedMesa);
                            }}
                          >
                            Ver Ticket
                          </Button>
                        ) : null}
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
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
