import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://todo-mern-backend-3o4v.onrender.com',
  timeout: 20000,
});

export default instance;
