import axios from 'axios';

// Creamos una instancia de axios para no repetir la URL en todo el proyecto
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // La URL de tu servidor Node.js
});

export default api;