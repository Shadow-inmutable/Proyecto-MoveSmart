import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function MapaLeaflet() {
  const [puntos, setPuntos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const position = [5.0689, -75.5174];

  /* 📡 Cargar paradas y zonas críticas */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paradasRes, zonasRes] = await Promise.all([
          api.get("/rutas/paradas"),
          api.get("/rutas/zonas"),
        ]);

        if (paradasRes.data.success) setPuntos(paradasRes.data.data);
        if (zonasRes.data.success) setZonas(zonasRes.data.data);
      } catch (err) {
        console.error("Error cargando datos del mapa:", err);
      }
    };

    fetchData();
  }, []);

  /* 🔥 Conversión nivel → radio y color */
  const getZonaStyle = (nivel) => {
    if (!nivel) return { color: "green", radius: 100 };

    const n = nivel.toLowerCase();

    if (n === "bajo") return { color: "#22c55e", radius: 200 };
    if (n === "medio") return { color: "#facc15", radius: 350 };
    if (n === "alto") return { color: "#f97316", radius: 500 };
    if (n === "critico") return { color: "#ef4444", radius: 700 };

    return { color: "#3b82f6", radius: 250 };
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h2>🗺️ Mapa de Rutas y Zonas Críticas</h2>

      <MapContainer center={position} zoom={13} style={{ height: "90%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 🔥 ZONAS CRÍTICAS COMO HEATMAP (CÍRCULOS) */}
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
                fillOpacity: 0.35,
              }}
            >
              <Popup>
                <strong>{zona.nombre}</strong>
                <br />
                Nivel: {zona.nivel_congestion}
                <br />
                Impacto: {zona.descripcion_impacto}
              </Popup>
            </Circle>
          );
        })}

        {/* 📍 PARADAS */}
        {puntos.map((punto) => (
          <Marker key={punto.id} position={[punto.latitud, punto.longitud]}>
            <Popup>
              <strong>{punto.nombre}</strong>
              <br />
              Orden: {punto.orden}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}