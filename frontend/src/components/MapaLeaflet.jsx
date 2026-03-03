import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import api from "../api/api";
import L from "leaflet";

// Componente para auto-ajustar la cámara a la ruta seleccionada
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
}

export default function MapaLeaflet({ rutaSeleccionada }) {
  const [puntos, setPuntos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const position = [5.0689, -75.5174];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paradasRes, zonasRes, rutasRes] = await Promise.all([
          api.get("/rutas/paradas"),
          api.get("/rutas/zonas"),
          api.get("/rutas"),
        ]);
        if (paradasRes.data.success) setPuntos(paradasRes.data.data);
        if (zonasRes.data.success) setZonas(zonasRes.data.data);
        if (rutasRes.data.success) setRutas(rutasRes.data.data);
      } catch (err) { console.error("Error:", err); }
    };
    fetchData();
  }, []);

  const getZonaStyle = (nivel) => {
    const n = nivel?.toLowerCase() || "";
    if (n === "bajo") return { color: "#22c55e", radius: 200 };
    if (n === "medio") return { color: "#facc15", radius: 350 };
    if (n === "alto") return { color: "#ef4444", radius: 500 };
    return { color: "#3b82f6", radius: 250 };
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        
        {/* 🗺️ ESTE ES EL MAPA ORIGINAL (OpenStreetMap) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {rutaSeleccionada && (
          <RecenterMap 
            coords={puntos
              .filter(p => p.ruta_id === rutaSeleccionada.id)
              .map(p => [p.latitud, p.longitud])} 
          />
        )}

        {rutas.map((ruta) => {
          const esSeleccionada = rutaSeleccionada?.id === ruta.id;
          const coordenadasRuta = puntos
            .filter((p) => p.ruta_id === ruta.id)
            .sort((a, b) => a.orden - b.orden)
            .map((p) => [p.latitud, p.longitud]);

          if (coordenadasRuta.length === 0) return null;

          return (
            <Polyline
              key={ruta.id}
              positions={coordenadasRuta}
              pathOptions={{
                color: ruta.color_hex || "#4318ff",
                weight: esSeleccionada ? 8 : 4,
                opacity: esSeleccionada ? 1 : 0.6,
                lineJoin: "round"
              }}
            >
              <Tooltip sticky><b>{ruta.nombre}</b></Tooltip>
            </Polyline>
          );
        })}

        {/* Zonas Críticas */}
        {zonas.map((zona) => {
          const { color, radius } = getZonaStyle(zona.nivel_congestion);
          return (
            <Circle
              key={zona.id}
              center={[zona.latitud, zona.longitud]}
              radius={radius}
              pathOptions={{ 
                color: color, 
                fillColor: color, 
                fillOpacity: 0.2, 
                weight: 2, 
                dashArray: "5, 10" 
              }}
            />
          );
        })}

        {/* Paradas */}
        {puntos.map((punto) => {
          if (rutaSeleccionada && punto.ruta_id !== rutaSeleccionada.id) return null;
          return (
            <Marker key={punto.id} position={[punto.latitud, punto.longitud]}>
              <Popup>🚏 {punto.nombre}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}