import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import authService from "../AuthService/authservice";
import apiClient from "../AuthService/authInterceptor";
import { useParams } from "react-router-dom";
import commandHub from "../AuthService/CommandHub";

interface Status {
  id: number;
  nombre: string;
}

interface Inventario {
  id: number;
  imagenInventario: string;
  nombre: string;
  descripcion: string;
  precio: number;
  preparado: boolean;
}

interface Order {
  id: number;
  mesa: number;
  adicional: string;
  status: Status;
  inventario: Inventario;
}

const initialOrderData: Order = {
  id: 0,
  mesa: 0,
  adicional: "",
  status: {
    id: 0,
    nombre: "",
  },
  inventario: {
    id: 0,
    imagenInventario: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    preparado: false,
  },
};

const OrderScreen: React.FC = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<number | null>(null);
  const token = authService.getToken();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ result: Order[] }>(
        "/Cocineros/ObtenerOrdenes"
      );
      const data = response.data;
      console.log("API Response:", data);
      const filteredOrders = data.result.filter(
        (order) => order.status.nombre !== "Pedido listo"
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (id: number, nombre: string) => {
    try {
      const token = await authService.getToken();
      if (!token) {
        console.error("No se ha encontrado el token de autorización.");
        return;
      }

      const response = await fetch(
        `https://localhost:7047/Cocineros/ActualizarEstadoOrden/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nuevoEstado: nombre }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(
          `Error al actualizar el estado de la orden: ${response.status} - ${errorDetails}`
        );
      }

      const result = await response.json();
      console.log("Response from server:", result);

      if (result.isSuccess) {
        if (nombre === "Pedido listo") {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== id)
          );
          setCompletedOrder(id);
          setModalVisible(true);
        } else {
          fetchOrders();
        }
      } else {
        console.error(
          "Error al actualizar el estado de la orden:",
          result.message
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePreparation = (id: number) => {
    updateOrderStatus(id, "En preparación");
  };

  const handleCompletion = (id: number) => {
    updateOrderStatus(id, "Pedido listo");
  };

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    let isConnected = false;
    const fetchData = async () => {
      try {
        const connection = await commandHub();
        await connection.start();
        isConnected = true;
        console.log("Conexión establecida correctamente.");

        connection.on("OnCommandCreated", (command) => {
          // Actualizar estado de comandas
          fetchOrders();
        });
        connection.on("OnCommandDeleted", (command) => {
          // Actualizar estado de comandas
          fetchOrders();
        });
        connection.on("OnOrderDeleted", (command) => {
          // Actualizar estado de comandas
          fetchOrders();
        });

        connectionRef.current = connection;
      } catch (error) {
        console.error("Error al iniciar la conexión:", error);
      }
    };

    fetchData();
    return () => {
      if (isConnected) {
        connectionRef.current?.stop();
        console.log("Conexión detenida.");
      }
    };
  }, []);

  return (
    <div style={{ maxHeight: "100vh", overflowY: "scroll" }}>
      <SafeAreaView style={styles.container}>
        <>
          <div style={{ height: "100vh" }}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Ordenes pedidas:</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Salir</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {orders.length === 0 ? (
                <Text style={styles.waitingText}>
                  No hay órdenes pendientes
                </Text>
              ) : (
                orders.map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <Image
                      source={{ uri: `${order.inventario.imagenInventario}` }}
                      style={styles.image}
                    />
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>
                        {order.inventario.nombre}
                      </Text>
                      <Text style={styles.table}>Mesa N: #{order.mesa}</Text>
                    </View>
                    {/* <Text style={styles.note}>Nota: {order.adicional}</Text> */}
                    <View style={styles.buttonContainer}>
                      {order.status.nombre === "En preparación" ? (
                        <View style={styles.inPreparationContainer}>
                          <Text style={styles.inPreparation}>
                            Orden en preparación...
                          </Text>
                          <TouchableOpacity
                            style={styles.completedButton}
                            onPress={() => handleCompletion(order.id)}
                          >
                            <Text style={styles.completedButtonText}>
                              Completada
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.preparationButton}
                          onPress={() => handlePreparation(order.id)}
                        >
                          <Text style={styles.buttonText}>En preparación</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}

              {/* Modal para la alerta personalizada */}
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Icon
                      name="check-circle"
                      size={50}
                      color="green"
                      style={styles.modalIcon}
                    />
                    <Text style={styles.modalText}>Pedido completado</Text>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.modalButtonText}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </ScrollView>
          </div>
        </>
      </SafeAreaView>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF6ED",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    marginTop: 10,
  },
  waitingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#999",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: "transparent",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  table: {
    fontSize: 14,
    backgroundColor: "#d3d3d3",
    borderRadius: 8,
    padding: 6,
    textAlign: "center",
    alignSelf: "flex-end",
    overflow: "hidden",
  },
  note: {
    fontSize: 14,
    marginVertical: 8,
    backgroundColor: "#d3d3d3",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    overflow: "hidden",
  },
  inPreparationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inPreparation: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    marginRight: 35,
  },
  buttonContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  preparationButton: {
    backgroundColor: "#add8e6",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completedButton: {
    backgroundColor: "#4682b4",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#505050",
    fontWeight: "bold",
    padding: 10,
  },
  completedButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#CFCFCF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4682b4",
    padding: 10,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrderScreen;
