
const authService = {
    login: (email: string, password: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === '' && password === '') {
            resolve();
          } else {
            reject('error');
          }
        }, 1000);
      });
    }
  };
  
  export default authService;
  