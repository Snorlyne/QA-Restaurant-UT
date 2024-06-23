import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderScreen = () => {
    const navigation = useNavigation();
    const [orderStatus, setOrderStatus] = useState({
        soup: 'pending',
        steak: 'pending'
    });
    const [modalVisible, setModalVisible] = useState(false);

    const handlePreparation = (item: string) => {
        setOrderStatus({ ...orderStatus, [item]: 'inPreparation' });
    };

    const handleCompletion = (item: string) => {
        setOrderStatus({ ...orderStatus, [item]: 'completed' });
        setModalVisible(true); // Mostrar el modal
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Ordenes pedidas:</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Salir</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.orderCard}>
                    <Image
                        source={{ uri: 'https://www.deliciosi.com/images/300/393/sopa-de-zanahoria-665.webp' }}
                        style={styles.image}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Sopa de Zanahoria</Text>
                        <Text style={styles.table}>Mesa N: #2</Text>
                    </View>
                    <Text style={styles.note}>Nota: sin cebolla</Text>
                    <View style={styles.buttonContainer}>
                        {orderStatus.soup === 'inPreparation' && (
                            <View style={styles.inPreparationContainer}>
                                <Text style={styles.inPreparation}>Orden en preparación...</Text>
                                <TouchableOpacity style={styles.completedButton} onPress={() => handleCompletion('soup')}>
                                    <Text style={styles.completedButtonText}>Completada</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {orderStatus.soup === 'pending' && (
                            <TouchableOpacity style={styles.preparationButton} onPress={() => handlePreparation('soup')}>
                                <Text style={styles.buttonText}>En preparación</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={styles.orderCard}>
                    <Image
                        source={{ uri: 'https://assets.farmison.com/images/module-image--large/66489-wagyu-sirloin-beef-28757-2-.jpg' }}
                        style={styles.image}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Wagyu Sirloin</Text>
                        <Text style={styles.table}>Mesa N: #3</Text>
                    </View>
                    <Text style={styles.note}>Nota: Termino medio</Text>
                    <View style={styles.buttonContainer}>
                        {orderStatus.steak === 'inPreparation' && (
                            <View style={styles.inPreparationContainer}>
                                <Text style={styles.inPreparation}>Orden en preparación...</Text>
                                <TouchableOpacity style={styles.completedButton} onPress={() => handleCompletion('steak')}>
                                    <Text style={styles.completedButtonText}>Completada</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {orderStatus.steak === 'pending' && (
                            <TouchableOpacity style={styles.preparationButton} onPress={() => handlePreparation('steak')}>
                                <Text style={styles.buttonText}>En preparación</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Modal para la alerta personalizada */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Icon name="check-circle" size={50} color="green" style={styles.modalIcon} />
                            <Text style={styles.modalText}>Pedido completado</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                                <Text style={styles.modalButtonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF6ED',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingBottom: 16,
    },
    orderCard: {
        backgroundColor: 'transparent',
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    table: {
        fontSize: 14,
        backgroundColor: '#d3d3d3',
        borderRadius: 8,
        padding: 6,
        textAlign: 'center',
        alignSelf: 'flex-end',
        overflow: 'hidden'
    },
    note: {
        fontSize: 14,
        marginVertical: 8,
        backgroundColor: '#d3d3d3',
        padding: 10,
        borderRadius: 8,
        textAlign: 'center',
        overflow: 'hidden',
    },
    inPreparationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inPreparation: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
        marginRight: 35,
    },
    buttonContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
    preparationButton: {
        backgroundColor: '#add8e6',
        paddingVertical: 5, 
        paddingHorizontal: 20, 
        borderRadius: 8,
    },
    completedButton: {
        backgroundColor: '#4682b4',
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#505050',
        fontWeight: 'bold',
        padding: 10,
    },
    completedButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#CFCFCF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalIcon: {
        marginBottom: 20,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#4682b4',
        padding: 10,
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default OrderScreen;
