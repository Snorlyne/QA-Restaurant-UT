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
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import mesaIMG from "../../assets/img/vinos.jpg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Swal from "sweetalert2";
import authService from "../../services/AuthServices";
import LazyLoad from "react-lazyload";
import deepOrange from "@mui/material/colors/deepOrange";
import { dataURLToFile } from "../../assets/utils/DataURLToFile";
import cajeroServices from "../../services/CajeroServices";
import commandHub from "../../services/CommandHubService";
import IComanda from "../../interfaces/Cajero/IComanda";
import { useSnackbar } from "notistack";
import ReactAudioPlayer from "react-audio-player";
import ICommanda from "../../interfaces/CommandHub/IComanda";

const statusMap: { [key: number]: string } = {
  1: "Activo",
  2: "Activo",
  3: "Activo",
  4: "Por cobrar",
  5: "Pagando",
  6: "Pagado",
};
const audioUrl = "/audio/new-notification.mp3"; // Ruta del archivo de audio en la carpeta `public`
export default function DashboardCajero() {
  const [comandas, setComandas] = useState<IComanda[] | null>(null);
  const [selectedMesa, setSelectedMesa] = useState<IComanda | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCommanda, setOpenCommanda] = useState(false);
  // const [isMounted, setIsMounted] = useState(false);
  const [showBadgePorCobrar, setShowBadgePorCobrar] = useState(false);
  const [showBadgePagado, setShowBadgePagado] = useState(false);
  const [notifiedMesas, setNotifiedMesas] = useState<
    { id: number; estado: string }[]
  >([]);
  const { enqueueSnackbar } = useSnackbar();
  const name = authService.getUser();
  const audioPlayerRef = useRef<ReactAudioPlayer>(null);

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
  const getEstadoByTabIndex = (tabIndex: number) => {
    switch (tabIndex) {
      case 1:
        return "Activo";
      case 2:
        return "Por cobrar";
      case 3:
        return "Pagando";
      default:
        return "Pagado";
    }
  };

  const filteredMesas = useMemo(() => {
    if (!comandas) return { comandas: [], exist: false };
    const estado = getEstadoByTabIndex(tabIndex);
    const filtered = comandas.filter((mesa) => {
      const mesaMatches = mesa.mesa.toString().includes(numeroMesa);
      const estadoMatches = mesa.estado === estado;
      if (tabIndex === 0) {
        return mesaMatches && mesa.estado !== "Pagado";
      }
      return mesaMatches && estadoMatches;
    });
    return {
      comandas: filtered,
      exist: filtered.length > 0,
    };
  }, [comandas, tabIndex, numeroMesa]);

  const handleSelectMesa = (comanda: IComanda) => {
    setTimeout(() => {
      setOpenCommanda(true);
      setSelectedMesa(comanda);
    }, 250);
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
          const response = await cajeroServices.deleteCommand(id);
          if (!response.isSuccess) {
            Swal.fire({
              title: "Error al eliminar la comanda",
              text: response.message,
              icon: "error",
              confirmButtonText: "Aceptar",
              customClass: {
                container: "custom-swal-container",
              },
            });
            return;
          }
          Swal.fire({
            title: "Comanda eliminada",
            text: response.message,
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
          const response = await cajeroServices.deleteOrder(id);
          if (!response.isSuccess) {
            Swal.fire({
              title: "Error al eliminar",
              text: response.message,
              icon: "error",
              confirmButtonText: "Aceptar",
              customClass: {
                container: "custom-swal-container",
              },
            });
            return;
          }
          Swal.fire({
            title: "Eliminación con éxito",
            text: title,
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              container: "custom-swal-container",
            },
          });
        }
      });
    } catch (err: any) {
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

  const handleGenerarTicket = (comanda: IComanda) => {
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
              max-width: 800px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
              background-color: #ffffff;
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
           .orders-table {
              width: 100%;
              border-collapse: collapse;
            }
           .orders-table th,.orders-table td {
              border: 1px solid #ccc;
              padding: 5px;
              text-align: left;
            }
           .orders-table th {
              background-color: #f0f0f0;
            }
            @media only screen and (max-width: 600px) {
             .ticket-container {
                width: 90%;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-header">Comanda</div>
            <div class="ticket-item"><span class="item-title">ID:</span> ${
              comanda.id
            }</div>
            <div class="ticket-item"><span class="item-title">Mesa:</span> ${
              comanda.mesa
            }</div>
            <div class="ticket-item"><span class="item-title">Mesero:</span> ${
              comanda.meseroCargo
            }</div>
            <div class="ticket-item"><span class="item-title">Cajero:</span> ${
              comanda.cobrador
            }</div>
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                ${comanda.ordenes
                  .map(
                    (orden) => `
                  <tr>
                    <td>${orden.producto.nombre}</td>
                    <td>$${orden.producto.precio.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
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
      const response = await cajeroServices.facturar(id);
      if (response.isSuccess === true) {
        Swal.fire({
          title: "Generado",
          text: response.message,
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            container: "custom-swal-container",
          },
        }).then(() => {
          // handleGenerarTicket(response.result);
        });
      } else {
        throw new Error(response.message);
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
    // setLoading(true);
    try {
      const data = await cajeroServices.getComandas();
      setComandas(data);
    } catch (error) {
      console.error("Error:", error);
    }
    // setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Lógica para actualizar selectedMesa si es necesario
    if (selectedMesa !== null && comandas !== null) {
      const mesaActualizada = comandas.find(
        (m: IComanda) => m.id === selectedMesa.id
      );
      if (mesaActualizada) {
        // Si la mesa existe en las nuevas comandas, actualizarla
        setSelectedMesa(mesaActualizada);
      } else {
        // Si la mesa no está en las nuevas comandas, limpiar selectedMesa
        setSelectedMesa(null);
      }
    }
  }, [comandas, selectedMesa]);

  useEffect(() => {
    let conectado: boolean = false;
    const connection = commandHub();
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
    // Function to transform incoming command data
    const transformCommandData = (command: ICommanda) => {
      return {
        id: command.id,
        tipo: command.tipo,
        meseroCargo: command.propietario,
        cobrador: command.cobrador || "",
        total: command.total,
        mesa: command.ordenes.length > 0 ? command.ordenes[0].mesa : 0,
        estado:
          command.ordenes.length > 0
            ? statusMap[command.ordenes[0].status.id]
            : "",
        imagen:
          command.ordenes.length > 0
            ? command.ordenes[0].producto.imagenInventario
            : "",
        ordenes: command.ordenes.map((orden) => ({
          id: orden.id,
          estado: orden.status.nombre,
          producto: {
            nombre: orden.producto.nombre,
            precio: orden.producto.precio,
          },
        })),
      };
    };

    connection.on("OnCommandCreated", (command) => {
      const newCommand = transformCommandData(command);
      // setComandas((prevComandas) => {
      //   const existingComanda = prevComandas && prevComandas.find((c) => c.id === newCommand.id);
      //   if (existingComanda) {
      //     newCommand.ordenes.forEach((newOrder) => {
      //       const existingOrder = existingComanda.ordenes.find(
      //         (o) => o.id === newOrder.id
      //       );
      //       if (!existingOrder) {
      //         existingComanda.ordenes.push(newOrder);
      //         existingComanda.total = newCommand.total;
      //       }
      //     });
      //     return [...prevComandas];
      //   } else {
      //     if (audioPlayerRef.current && audioPlayerRef.current.audioEl.current) {
      //       const audioElement = audioPlayerRef.current.audioEl.current;
      //       audioElement.addEventListener("canplaythrough", () => {
      //         audioElement
      //           .play()
      //           .catch((error) =>
      //             console.error("Error al reproducir el audio:", error)
      //           );
      //       });
      //       enqueueSnackbar(`Mesa ${newCommand.mesa} ha sido agregada`, {
      //         variant: "success",
      //         autoHideDuration: 6000,
      //         anchorOrigin: {
      //           vertical: "top",
      //           horizontal: "right",
      //         },
      //       });
      //       audioElement.load();
      //     }
      //     return prevComandas !== null ? [...prevComandas, newCommand] : [newCommand];
      //   }
      // });
      if (newCommand.tipo === "newComanda") {
        if (audioPlayerRef.current && audioPlayerRef.current.audioEl.current) {
          const audioElement = audioPlayerRef.current.audioEl.current;
          audioElement.addEventListener("canplaythrough", () => {
            audioElement
              .play()
              .catch((error) =>
                console.error("Error al reproducir el audio:", error)
              );
          });
          enqueueSnackbar(`Mesa ${newCommand.mesa} ha sido agregada`, {
            variant: "success",
            autoHideDuration: 6000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
          audioElement.load();
        }
      }
      fetchData();
    });

    connection.on("OnCommandUpdated", (data) => {
      console.log("Actualizando", data);
      // setComandas((prevCommands) =>
      //   prevCommands!.map((c) => {
      //     if (c.id === data.commandId) {
      //       return { ...c, estado: statusMap[data.status] };
      //     }
      //     return c;
      //   })
      // );
      // if (selectedMesa !== null && selectedMesa.id === data.commandId) {
      //   setSelectedMesa((prevMesa) => ({
      //     ...prevMesa!,
      //     estado: statusMap[data.status],
      //   }));
      // }
      if (data.status === 4 || data.status === 6) {
        if (audioPlayerRef.current && audioPlayerRef.current.audioEl.current) {
          const audioElement = audioPlayerRef.current.audioEl.current;
          audioElement.addEventListener("canplaythrough", () => {
            audioElement
              .play()
              .catch((error) =>
                console.error("Error al reproducir el audio:", error)
              );
          });
          if (data.status === 4) {
            setShowBadgePorCobrar(true);
            enqueueSnackbar(`Mesa ${data.mesa} en espera de cobro`, {
              variant: "warning",
              autoHideDuration: 6000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
          }else {
            setShowBadgePagado(true);
            enqueueSnackbar(`Mesa ${data.mesa} ha sido pagada`, {
              variant: "success",
              autoHideDuration: 6000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
          }
          audioElement.load();
        }
      }
      fetchData();
    });

    connection.on("OnCommandDeleted", (deletedCommandId) => {
      console.log("Eliminando");
      // setComandas((prevCommands) =>
      //   prevCommands!.filter((c) => c.id !== deletedCommandId)
      // );
      // setSelectedMesa(null);
      fetchData();
    });

    connection.on("OnOrderDeleted", (data) => {
      console.log("Eliminando");
      // if (comandas != null) {
      //   const comandaIndex = comandas.findIndex((c) => c.id === data.commandId);
      //   if (comandaIndex !== -1) {
      //     const ordenIndex = comandas[comandaIndex].ordenes.findIndex(
      //       (o) => o.id === data.orderId
      //     );
      //     if (ordenIndex !== -1) {
      //       comandas[comandaIndex].ordenes.splice(ordenIndex, 1);
      //     }
      //   }
      //   setSelectedMesa(comandas[comandaIndex]);
      //   setComandas([...comandas]);
      // }
      fetchData();
    });

    return () => {
      if (conectado) {
        connection.stop();
        console.log("Conexión detenida.");
      }
    };
  }, [enqueueSnackbar, fetchData]);

  // useEffect(() => {
  //   if (comandas) {
  //     const tienePorCobrar = comandas.find((c) => c.estado === "Por cobrar");
  //     if (
  //       tienePorCobrar &&
  //       !notifiedMesas.some(
  //         (mesa) =>
  //           mesa.id === tienePorCobrar.id && mesa.estado === "Por cobrar"
  //       )
  //     ) {
  //       // Mostrar la notificación solo si la mesa no ha sido notificada previamente
  //       setShowBadgePorCobrar(true);
  //       enqueueSnackbar(`Mesa ${tienePorCobrar.mesa} en espera de cobro`, {
  //         variant: "warning",
  //         autoHideDuration: 6000,
  //         anchorOrigin: {
  //           vertical: "top",
  //           horizontal: "right",
  //         },
  //       });
  //       // Agregar la mesa a las mesas notificadas
  //       setNotifiedMesas((prevNotified) => [
  //         ...prevNotified,
  //         { id: tienePorCobrar.id, estado: "Por cobrar" },
  //       ]);
  //       // Reproducir sonido si necesario
  //       if (audioPlayerRef.current && audioPlayerRef.current.audioEl.current) {
  //         const audioElement = audioPlayerRef.current.audioEl.current;
  //         audioElement.addEventListener("canplaythrough", () => {
  //           audioElement
  //             .play()
  //             .catch((error) =>
  //               console.error("Error al reproducir el audio:", error)
  //             );
  //         });
  //         audioElement.load();
  //       }
  //     } else {
  //       setShowBadgePorCobrar(false);
  //     }
  //   }
  // }, [comandas, enqueueSnackbar, notifiedMesas]);

  // // Efecto para manejar las mesas "Pagado"
  // useEffect(() => {
  //   if (comandas) {
  //     const tienePagado = comandas.find((c) => c.estado === "Pagado");
  //     if (
  //       tienePagado &&
  //       !notifiedMesas.some(
  //         (mesa) => mesa.id === tienePagado.id && mesa.estado === "Pagado"
  //       )
  //     ) {
  //       // Mostrar la notificación solo si la mesa no ha sido notificada previamente
  //       setShowBadgePagado(true);
  //       enqueueSnackbar(`Mesa ${tienePagado.mesa} ha sido pagada`, {
  //         variant: "success",
  //         autoHideDuration: 6000,
  //         anchorOrigin: {
  //           vertical: "top",
  //           horizontal: "right",
  //         },
  //       });
  //       // Agregar la mesa a las mesas notificadas
  //       setNotifiedMesas((prevNotified) => [
  //         ...prevNotified,
  //         { id: tienePagado.id, estado: "Pagado" },
  //       ]);
  //       // Reproducir sonido si necesario
  //       if (audioPlayerRef.current && audioPlayerRef.current.audioEl.current) {
  //         const audioElement = audioPlayerRef.current.audioEl.current;
  //         audioElement.addEventListener("canplaythrough", () => {
  //           audioElement
  //             .play()
  //             .catch((error) =>
  //               console.error("Error al reproducir el audio:", error)
  //             );
  //         });
  //         audioElement.load();
  //       }
  //     } else {
  //       setShowBadgePagado(false);
  //     }
  //   }
  // }, [comandas, enqueueSnackbar, notifiedMesas]);

  useEffect(() => {
    if (showBadgePorCobrar && tabIndex !== 2) {
      setShowBadgePorCobrar(true);
    } else {
      setShowBadgePorCobrar(false);
    }
  }, [showBadgePorCobrar, tabIndex]);

  useEffect(() => {
    if (showBadgePagado && tabIndex !== 4) {
      setShowBadgePagado(true);
    } else {
      setShowBadgePagado(false);
    }
  }, [showBadgePagado, tabIndex]);

  return (
    <>
      <Box sx={{ flexGrow: 1, height: "100%" }}>
        <ReactAudioPlayer
          src={audioUrl}
          ref={audioPlayerRef}
          autoPlay={false} // No reproducir automáticamente al cargar la página
          style={{ display: "none" }} // Ocultar el reproductor
        />
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
                    <Tab label={`Activo`} />
                    <Tab
                      label={
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={!showBadgePorCobrar}
                        >
                          Por Cobrar
                        </Badge>
                      }
                    />
                    <Tab label={`Cobrando`} />
                    <Tab
                      label={
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={!showBadgePagado}
                        >
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
                        ...(filteredMesas?.exist && {
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
                    {filteredMesas?.comandas !== undefined &&
                      filteredMesas.comandas.map((mesa: IComanda) => (
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
                                borderRadius: "5px",
                                alignSelf: "flex-start",
                                justifySelf: "flex-end",
                                position: "relative",
                                top: "12px",
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
                            {selectedMesa.estado !== "Pagado" ? (
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                color="error"
                                onClick={() => handleEliminarOrden(orden.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            ) : null}
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
