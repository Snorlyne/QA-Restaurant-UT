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
          resolve(response.data.result.role);
          console.log();

        })
        .catch(function (error) {
          console.error(error);
          reject('error');
        });
      });
    }
};

export default authService;