import axios from 'axios';
import Swal from 'sweetalert2';
import authService from '../services/AuthServices';

// Crear una instancia de Axios
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Base URL para todas las solicitudes
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de solicitud
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken(); // Obtener el token desde el authService
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
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
                Swal.fire({
                    title: 'Sesión expirada',
                    text: 'Por favor, inicia sesión de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        container: "custom-swal-container",
                        popup: 'popup-class'
                    },
                    didClose: () => {
                        authService.logout(); // Cerrar sesión y limpiar cookies
                    }
                });
            } else if (error.response.status === 403) {
                // Si es un error de autorización
                Swal.fire({
                    title: 'Sin Autorización',
                    text: 'No tienes los permisos requeridos para operar esta acción.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        container: "custom-swal-container",
                        popup: 'popup-class'
                    },
                    didClose: () => {
                        authService.logout(); // Cerrar sesión y limpiar cookies
                    }
                });
            } else {
                // Otros errores
                Swal.fire({
                    title: 'Error',
                    text: 'Se produjo un error. Por favor, inténtelo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        container: "custom-swal-container",
                    }
                });
            }
        } else {
            // Si no hay respuesta del servidor
            Swal.fire({
                title: 'Error',
                text: 'No se pudo conectar con el servidor.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                customClass: {
                    container: "custom-swal-container",
                }
            });
        }
        return Promise.reject(error);
    }
);

export default apiClient;
