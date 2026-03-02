import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Este interceptor pega el token en cada llamada al backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRutas = async () => {
  const res = await fetch(`${api.defaults.baseURL}/rutas`);
  return res.json();
};

export const getZonasCriticas = async () => {
  const res = await fetch(`${api.defaults.baseURL}/zonas`);
  return res.json();
};

export const getParadas = async () => {
  const res = await fetch(`${api.defaults.baseURL}/paradas`);
  return res.json();
};

export default api;