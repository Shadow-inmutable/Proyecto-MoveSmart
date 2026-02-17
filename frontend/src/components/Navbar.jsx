import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '1rem', 
      background: '#2c3e50', 
      color: 'white' 
    }}>
      <h2 style={{ margin: 0 }}>Move Smart Manizales</h2>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Mapa</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Acceso Gestor</Link>
      </div>
    </nav>
  );
}