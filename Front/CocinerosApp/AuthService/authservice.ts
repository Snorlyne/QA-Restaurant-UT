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

// Usa la dirección IP de tu máquina local
const API_URL = 'https://localhost:7047/Auth/Login'; 

const authService = {
    login: async (email: string, password: string): Promise<string> => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Error en la solicitud de inicio de sesión: ${response.status} - ${errorDetails}`);
            }

            const data = await response.json();

            // Almacenar token en AsyncStorage
            const token = data.result.jwTtoken;
            const usuario = data.result.nombre;
            const rol = data.result.rol;
            const empresa = data.result.empresa;

            await setStorageItem('token', token);
            await setStorageItem('usuario', usuario);
            await setStorageItem('role', rol);
            await setStorageItem('empresa', empresa);

            return rol;
        } catch (error) {
            console.error('Unexpected error:', (error as Error).message);
            throw new Error('Error en la solicitud de inicio de sesión');
        }
    },
    logout: async (navigation: any) => {
        // Eliminar las cookies de sesión
        await removeStorageItem('token');
        await removeStorageItem('usuario');
        await removeStorageItem('role');
        await removeStorageItem('empresa');

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
    },
    getCompany: async (): Promise<number | null> => {
        const empresaCookie = await getStorageItem('empresa');
        if (empresaCookie !== null) {
            return parseInt(empresaCookie);
        }
        return null;
    },
};

export default authService;
