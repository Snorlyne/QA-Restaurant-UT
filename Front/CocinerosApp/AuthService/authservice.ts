import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para establecer un valor en AsyncStorage
const setStorageItem = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('Error setting item in AsyncStorage', error);
    }
};

// Función para obtener un valor de AsyncStorage
const getStorageItem = async (key: string): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.error('Error getting item from AsyncStorage', error);
        return null;
    }
};

// Función para eliminar un valor de AsyncStorage
const removeStorageItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from AsyncStorage', error);
    }
};

const authService = {
    login: async (email: string, password: string): Promise<string> => {
        try {
            const response = await axios.post('https://localhost:7047/APIAuth/Login', {
                email: email,
                password: password
            });

            // Almacenar token en AsyncStorage
            const token = response.data.result.jwTtoken;
            const usuario = response.data.result.nombre;
            const rol = response.data.result.rol;

            await setStorageItem('token', token);
            await setStorageItem('usuario', usuario);
            await setStorageItem('role', rol);

            return rol;
        } catch (error) {
            console.error(error);
            throw new Error('error');
        }
    },
    logout: async (navigation: any) => {
        // Eliminar las cookies de sesión
        await removeStorageItem('token');
        await removeStorageItem('usuario');
        await removeStorageItem('role');

        // Redirigir al usuario a la página de inicio de sesión o la página de inicio
        navigation.navigate('Login'); // Ajusta la ruta según tu aplicación
    },
    getToken: async (): Promise<string | null> => {
        return await getStorageItem('token');
    },
    getUser: async (): Promise<string | null> => {
        return await getStorageItem('usuario');
    },
    getRole: async (): Promise<string | null> => {
        return await getStorageItem('role');
    }
};

export default authService;
