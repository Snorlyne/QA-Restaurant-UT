import axios from 'axios';
import { Alert } from 'react-native';
import authService from './authservice';

// Crear una instancia de Axios
const apiClient = axios.create({
    baseURL: 'https://localhost:7047', // Base URL para todas las solicitudes
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de solicitud
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await authService.getToken(); // Obtener el token desde el authService de manera asíncrona
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        // Manejo de errores en la solicitud
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
apiClient.interceptors.response.use(
    (response) => {
        // Devuelve la respuesta directamente si es exitosa
        return response;
    },
    (error) => {
        // Manejo de errores en la respuesta
        if (error.response) {
            // Si la respuesta del servidor está fuera del rango 2xx
            if (error.response.status === 401) {
                // Si es un error de autenticación
                Alert.alert(
                    'Sesión expirada',
                    'Por favor, inicia sesión de nuevo.',
                    [
                        { text: 'Aceptar', onPress: () => authService.logout({}) }
                    ],
                    { cancelable: false }
                );
            } else if (error.response.status === 403) {
                // Si es un error de autorización
                Alert.alert(
                    'No autorizado',
                    'No tienes permiso para realizar esta acción.',
                    [{ text: 'Aceptar' }],
                    { cancelable: false }
                );
            } else {
                // Otros errores
                Alert.alert(
                    'Error',
                    'Se produjo un error. Por favor, inténtelo de nuevo más tarde.',
                    [{ text: 'Aceptar' }],
                    { cancelable: false }
                );
            }
        } else {
            // Si no hay respuesta del servidor
            Alert.alert(
                'Error',
                'No se pudo conectar con el servidor.',
                [{ text: 'Aceptar' }],
                { cancelable: false }
            );
        }
        return Promise.reject(error);
    }
);

export default apiClient;
