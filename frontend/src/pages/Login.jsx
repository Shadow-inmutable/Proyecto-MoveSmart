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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('¡Bienvenido, Gestor!');
      navigate('/');
    } catch (err) {
      alert('Error en el acceso: ' + (err.response?.data?.error || 'Credenciales inválidas'));
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundImage:
      "url('https://i.pinimg.com/736x/33/2d/e4/332de40e17a6e78476f96226073c0adf.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(2px)',
  };

  const cardStyle = {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '18px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.35)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
  };

  const titleStyle = {
    marginBottom: '1.5rem',
    color: '#1e3c72',
    fontSize: '1.8rem',
  };

  const subtitleStyle = {
    marginBottom: '1.5rem',
    color: '#555',
    fontSize: '0.95rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={cardStyle}>
        <h1 style={titleStyle}>🚌 Move Smart Manizales</h1>
        <p style={subtitleStyle}>Acceso para Gestores del Sistema de Transporte</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}