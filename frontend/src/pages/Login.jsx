import { useState } from 'react';
import api from "../api/api";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/usuarios/login', { email, password });
      localStorage.setItem('token', data.token); // Guardamos el token
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('¡Bienvenido, Gestor!');
      navigate('/'); // Volvemos al mapa
    } catch (err) {
      alert('Error en el acceso: ' + (err.response?.data?.error || 'Credenciales inválidas'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Acceso para Gestores</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <br /><br />
        <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />
        <br /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}