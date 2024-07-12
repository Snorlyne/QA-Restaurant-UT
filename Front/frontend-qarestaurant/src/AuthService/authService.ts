import axios from 'axios';
import { get } from 'http';


// Función para establecer una cookie segura
const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
};

// Función para obtener el valor de una cookie
const getCookie = (name: string): string | null  => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2 && parts[1]) {
      const cookieValue = parts.pop();
      if (cookieValue) {
        return cookieValue.split(';').shift()!;
      }
    }
    return null;
};
// Función para eliminar una cookie
const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
};

const authService = {

    login: (email: string, password: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('https://localhost:44314/APIAuth/Login', {
                email: email,
                password: password
            })
            .then(function (response) {
                // Almacenar token en una cookie segura
                const token = response.data.result.jwTtoken;
                const usuario = response.data.result.nombre;
                const rol = response.data.result.rol;
                const email = response.data.result.email;

                setCookie('token', token, 1); // Expira en 1 día
                setCookie('usuario', usuario, 1);
                setCookie('role', rol, 1);
                setCookie('email', email, 1);
                resolve(rol);
            })
            .catch(function (error) {
                console.error(error);
                reject('error');
            });
        });
    },
    logout: () => {
        // Eliminar las cookies de sesión
        deleteCookie('token');
        deleteCookie('usuario');
        deleteCookie('role');
        deleteCookie('email');

        // Redirigir al usuario a la página de inicio de sesión o la página de inicio
        window.location.href = '/'; // Ajusta la ruta según tu aplicación
    },
    getToken: (): string | null => {
        return getCookie('token');
    },
    getUser: (): string | null => {
        return getCookie('usuario');
    },
    getRole: (): string | null => {
        return getCookie('role');
    },
    getEmail: (): string | null => {
        return getCookie('email');
    }
};

export default authService;
