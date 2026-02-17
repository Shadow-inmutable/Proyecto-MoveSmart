import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const position = [5.0689, -75.5174]; // Coordenadas de Manizales

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1>📍 Mapa Interactivo de Manizales</h1>
      <MapContainer center={position} zoom={13} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    </div>
  );
}