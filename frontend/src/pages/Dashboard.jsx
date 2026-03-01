import React from "react";
import MapaLeaflet from "../components/MapaLeaflet";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR IZQUIERDO */}
      <div style={{ width: "20%", background: "#f4f6f8", padding: "20px" }}>
        <h3>🛣 Rutas Activas</h3>
        <ul>
          <li>Ruta Centro-Norte</li>
          <li>Ruta Este-Oeste</li>
          <li>Ruta Circular</li>
          <li>Ruta Sur-Centro</li>
        </ul>

        <h3>⚠ Zonas Críticas</h3>
        <ul>
          <li>Zona Centro - Alta congestión</li>
          <li>Av. Principal - Media congestión</li>
          <li>Zona Industrial - Moderada</li>
        </ul>
      </div>

      {/* CONTENIDO CENTRAL */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>📊 Panel de Optimización de Rutas</h1>
        <p>Aquí irá el mapa + simulación + análisis.</p>
        <div style={{ height: "60%" }}>
        <MapaLeaflet />
        </div>

        <div style={{ 
          background: "#e9ecef", 
          height: "60%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <h2>🗺 Mapa de simulación (Leaflet aquí)</h2>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div style={{ width: "25%", background: "#f8f9fa", padding: "20px" }}>
        <h3>📈 Métricas de Optimización</h3>
        <p>Tiempo estimado: 42 min</p>
        <p>Costo operativo: $285/día</p>
        <p>Congestión: 78%</p>

        <h3>📉 Comparación de Tiempos</h3>
        <div style={{ height: "200px", background: "#dee2e6" }}>
          (Gráfica aquí con Recharts)
        </div>
      </div>
    </div>
  );
}