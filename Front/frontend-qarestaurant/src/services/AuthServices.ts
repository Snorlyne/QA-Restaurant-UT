import apiClient from '../auth/AuthInterceptor';
import IResponse from '../interfaces/IResponse.';


// Función para establecer una cookie segura
const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
};

// Función para obtener el valor de una cookie
const getCookie = (name: string): string | null => {
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

    login: async (email: string, password: string): Promise<string> => {
        try {
            const response = await apiClient.post('Auth/Login', { email, password });
            const { jwTtoken: token, nombre: usuario, rol, empresa, email: emailResponse } = response.data.result;
    
            setCookie('token', token, 1); // Expira en 1 día
            setCookie('usuario', usuario, 1);
            setCookie('role', rol, 1);
            setCookie('empresa', empresa, 1);
            setCookie('email', emailResponse, 1);
    
            return rol;
        } catch (error) {
            return "error"
        }
    },
    
    logout: () => {
        // Eliminar las cookies de sesión
        deleteCookie('token');
        deleteCookie('usuario');
        deleteCookie('role');
        deleteCookie('empresa');
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
    getCompany: (): number | null => {
        const empresaCookie = getCookie('empresa');
        if (empresaCookie !== null) {
            return parseInt(empresaCookie);
        }
        return null;
    },
    getEmail: (): string | null => {
        return getCookie('email');
    },
    async changePassword(oldPassword: string, newPassword: string): Promise<IResponse> {
        try {
            const response = await apiClient.put("Auth/change-password",
                {
                    oldPassword,
                    newPassword
                },
            )
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
};

export default authService;
