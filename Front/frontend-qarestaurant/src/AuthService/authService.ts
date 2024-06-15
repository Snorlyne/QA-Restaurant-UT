import axios from 'axios';


const authService = {
    login: (email: string, password: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        axios.post('https://localhost:7047/APIAuth/Login', {
          email: email,
          password: password
        })
        .then(function (response) {
          localStorage.setItem('token', response.data.result.jwTtoken);
          localStorage.setItem('usuario', response.data.result.nombre);
          resolve(response.data.result.role);
        })
        .catch(function (error) {
          console.error(error);
          reject('error');
        });
      });
    },
    logout: () => {
      // Borra todos los datos almacenados en localStorage
      localStorage.clear();
    
      // Redirige al usuario a la página de inicio de sesión o la página de inicio
      window.location.href = '/'; // Ajusta la ruta según tu aplicación
    }
};

export default authService;