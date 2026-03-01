import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import api from "../api/api";

export default function MapaLeaflet() {
  const [puntos, setPuntos] = useState([]);
  const position = [5.0689, -75.5174];

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const { data } = await api.get('/rutas/paradas');
        if (data.success) setPuntos(data.data);
      } catch (err) {
        console.error("Error cargando puntos:", err);
      }
    };
    fetchPuntos();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1>📍 Mapa Interactivo de Manizales</h1>
      <MapContainer center={position} zoom={13} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {puntos.map(punto => (
          <Marker key={punto.id} position={[punto.latitud, punto.longitud]}>
            <Popup>
              <strong>{punto.nombre}</strong> <br />
              Orden: {punto.orden}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}