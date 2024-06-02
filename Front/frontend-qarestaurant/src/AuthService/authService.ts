import Login from "../Desktop/login";

const authService = {
    login: (email: string, password: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'prueba@gmail.com' && password === '12345') {
            resolve();
          } else {
            reject('error');
          }
        }, 1000);
      });
    }
  };
  
  export default authService;
  