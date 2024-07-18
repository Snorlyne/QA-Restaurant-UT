import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  ListItemText,
  List,
  ListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import commandHub from "../services/CommandHubService";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { ApiResponse, ViewComandasMeseroVM } from "./Orders"; // Ajusta la ruta de importación según tu estructura de proyecto
import authService from "../services/AuthServices";
import apiClient from "../auth/AuthInterceptor";

interface ITool {
  title: string;
  description: string;
  pedido: string;
  pedidos: Pedido[];
  commandId: number;
  mesa: number;
}
interface Pedido {
  id: number;
  estado: string;
  producto: {
    nombre: string;
  };
}

const cardButtons = ["Nueva orden", "Pagar", "Cobrar"];

const DashboardMeseros: React.FC = () => {
  const [tools, setTools] = useState<ITool[]>([]);
  const [checkedState, setCheckedState] = useState<boolean[][]>([]);
  const token = authService.getToken();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      // Get the authentication token from where you're storing it

      const response = await axios.get<ApiResponse>(
        "https://localhost:7047/Mesero/Comandas",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adjust the authentication type if necessary
          },
        }
      );

      if (response.data.isSuccess) {
        const orders = response.data.result.map(
          (order: ViewComandasMeseroVM) => ({
            title: `Mesa ${order.mesa}`,
            description: order.estado,
            pedido:
              order.ordenes.length > 0
                ? new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A",
            pedidos: order.ordenes,
            commandId: order.id,
            mesa: order.mesa,
          })
        );
        setTools(orders);
        setCheckedState(orders.map((tool) => tool.pedidos.map(() => false)));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token]);

  const handleCheckboxChange = (toolIndex: number, pedidoIndex: number) => {
    const newCheckedState = [...checkedState];
    newCheckedState[toolIndex] = [...newCheckedState[toolIndex]];
    newCheckedState[toolIndex][pedidoIndex] =
      !newCheckedState[toolIndex][pedidoIndex];
    setCheckedState(newCheckedState);
  };

  const countChecked = (toolIndex: number): number => {
    return checkedState[toolIndex].filter(Boolean).length;
  };

  const areAllChecked = (toolIndex: number): boolean => {
    return checkedState[toolIndex].every(Boolean);
  };
  const handleCobrar = async (mesa: number) => {
    const response = await apiClient.put<ApiResponse>(
      "https://localhost:7047/Mesero/PedirTicket/" + mesa,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adjust the authentication type if necessary
        },
      }
    );
    fetchOrders();
  };
  const handlePagar = async (mesa: number) => {
    const response = await apiClient.put<ApiResponse>(
      "https://localhost:7047/Mesero/CobrarComanda/" + mesa,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adjust the authentication type if necessary
        },
      }
    );
    fetchOrders();
  };
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
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

    connection.on("OnCommandDeleted", (deletedCommandId) => {
      console.log("Eliminando");
      // setComandas((prevCommands) =>
      //   prevCommands!.filter((c) => c.id !== deletedCommandId)
      // );
      // setSelectedMesa(null);
      fetchOrders();
    });
    connection.on("OnOrderUpdated", (deletedCommandId) => {
      console.log("Actualizado");
      // setComandas((prevCommands) =>
      //   prevCommands!.filter((c) => c.id !== deletedCommandId)
      // );
      // setSelectedMesa(null);
      fetchOrders();
    });
    connection.on("OnCommandUpdated", (data) => {
      console.log("Actualizando", data);
      fetchOrders();
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
      fetchOrders();
    });

    return () => {
      if (conectado) {
        connection.stop();
        console.log("Conexión detenida.");
      }
    };
  }, [fetchOrders]);

  return (
    <Grid
      container
      spacing={3}
      sx={{
        padding: 5,
        backgroundColor: "#fff6ed",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {tools.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No hay órdenes
        </Typography>
      ) : (
        tools.map((tool, toolIndex) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            key={toolIndex}
            sx={{ position: "relative" }}
          >
            <Box
              sx={{
                width: "45px",
                height: "45px",
                color: "white",
                backgroundColor: "#00a507",
                borderRadius: "50px",
                position: "absolute",
                top: 10,
                right: -10,
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                {tool.pedidos.length - countChecked(toolIndex)}
              </Typography>
            </Box>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: 5,
                minHeight: "400px",
                position: "relative",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  sx={{
                    flexDirection: { sm: "column", md: "column", lg: "row" },
                  }}
                >
                  <Grid
                    item
                    sx={{
                      padding: 1,
                      flexDirection: "column",
                      width: { sm: "100%", md: "100%", lg: "50%" },
                      justifyContent: "start",
                    }}
                  >
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 600,
                        }}
                      >
                        {tool.title}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex", gap: 1 }}>
                      {/* <Typography variant="body2" fontWeight={600}>
                        Ultimo pedido a las: {tool.pedido}
                      </Typography> */}
                    </Grid>
                    <Grid item mt={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: areAllChecked(toolIndex)
                            ? "#00a507"
                            : "#00a507",
                        }}
                      >
                        {tool.description}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    sx={{
                      display: "flex",
                      justifyContent: { sm: "center", md: "center", lg: "end" },
                      alignItems: "center",
                      gap: 2,
                      width: { sm: "100%", md: "100%", lg: "50%" },
                    }}
                  >
                    <Button
                      onClick={() => navigate("/GuardarPedidos/" + tool.mesa)}
                      sx={{
                        textTransform: "none",
                        color: "black",
                        border: "1px solid",
                        borderColor: "#a0c9d7",
                        borderRadius: "8px",
                        minWidth: { sm: "60px", md: "60px", lg: "120px" },
                        maxHeight: "50px",
                        padding: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Nueva orden
                      </Typography>
                    </Button>
                    {tool.pedidos[0].estado !== "Pagando" && (
                    <Button
                      onClick={async () => {
                        await handleCobrar(tool.commandId);
                      }}
                      sx={{
                        textTransform: "none",
                        color: "black",
                        border: "1px solid",
                        borderColor: "#a0c9d7",
                        borderRadius: "8px",
                        minWidth: { sm: "60px", md: "60px", lg: "120px" },
                        maxHeight: "50px",
                        padding: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Ticket
                      </Typography>
                    </Button>
                                        )}
                    {tool.pedidos[0].estado === "Pagando" && (
                      <Button
                        onClick={async () => {
                          await handlePagar(tool.commandId);
                        }}
                        sx={{
                          textTransform: "none",
                          color: "black",
                          border: "1px solid",
                          borderColor: "#a0c9d7",
                          borderRadius: "8px",
                          minWidth: { sm: "60px", md: "60px", lg: "120px" },
                          maxHeight: "50px",
                          padding: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Pagar
                        </Typography>
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: 1, mt: 2 }}>
                  <Grid
                    item
                    sx={{
                      flexGrow: 1,
                      overflowY: {
                        xs: "scroll",
                        sm: "scroll",
                        md: "scroll",
                        lg: "hidden",
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Pedidos listos:
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-grid",
                        gridTemplateColumns: {
                          sm: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                          lg: "repeat(4, 1fr)",
                        },
                        maxHeight: "150px",
                        gap: 2,
                      }}
                    >
                      {tool.pedidos.map((pedido, pedidoIndex) => (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={4}
                          lg={3}
                          key={pedidoIndex}
                          sx={{
                            ...(pedido.estado !== "Pedido listo" &&
                              pedido.estado !== "Por cobrar" &&
                              pedido.estado !== "Pagando" && {
                                display: "none",
                              }),
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span
                              style={{ marginRight: "8px", fontSize: "large" }}
                            >
                              &#8226;
                            </span>{" "}
                            {/* Viñeta a la izquierda */}
                            <Typography variant="body2" noWrap>
                              {pedido.producto.nombre}
                            </Typography>
                          </div>
                        </Grid>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}

      <Grid
        item
        sx={{
          position: "fixed",
          left: "50%",
          bottom: "20px",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "0 !important",
        }}
        padding={0}
      >
        <Button
          onClick={() => navigate("/GuardarPedidos")}
          sx={{
            backgroundColor: "#00a507",
            color: "white",
            width: "250px",
            borderRadius: 15,
            padding: "12.5px",
          }}
        >
          <AddIcon />
        </Button>
      </Grid>
    </Grid>
  );
};

export default DashboardMeseros;
