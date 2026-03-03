import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MapaLeaflet from "../components/MapaLeaflet";
import MetricasOptimizacion from "../components/MetricasOptimizacion";
import GraficaEficiencia from "../components/GraficaEficiencia";
import GraficaDistancia from "../components/GraficaDistancia";
import GraficaComparacion from "../components/GraficaComparacion";
import ParadasGestor from "../components/ParadasGestor";
import UsuariosForm from "../components/UsuariosForm"; 
import api from "../api/api";

export default function Dashboard() {
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const res = await api.get("/rutas");
        setRutas(res.data?.data || []);
      } catch (error) {
        console.error("Error cargando rutas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRutas();
  }, []);

  const rutasBase = rutaSeleccionada ? [rutaSeleccionada] : rutas;
  const dataGraficas = rutasBase.map((ruta) => ({
    ruta: ruta?.nombre || "Sin nombre",
    tiempo_actual: ruta?.tiempo_estimado_min || 0,
    tiempo_opt: Math.round((ruta?.tiempo_estimado_min || 0) * 0.8),
    eficiencia: ruta?.eficiencia_porcentaje || 0,
    distancia: ruta?.distancia_km || 0,
  }));

  if (loading) return <div style={loadingStyle}>🚀 Sincronizando Sistema Central...</div>;

  return (
    <div style={layoutStyle}>
      {/* 1. BARRA LATERAL */}
      <Sidebar onRutaSelect={setRutaSeleccionada} />

        {/* 2. CONTENIDO PRINCIPAL */}
      <div style={mainContentStyle}>
        
        
        <header style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Move Smart <span style={{fontWeight: 300}}>| Gestión Estratégica</span></h1>
            <p style={subtitleStyle}>Panel de control de movilidad urbana Manizales</p>
          </div>
        </header>

        
        <div style={gridTop}>
          {/* Bloque del Mapa */}
          <div style={{ ...cardStyle, padding: 0, overflow: "hidden", position: "relative" }}>
            <MapaLeaflet rutaSeleccionada={rutaSeleccionada} />
            <div style={mapOverlay}>
                <MetricasOptimizacion rutaSeleccionada={rutaSeleccionada} />
            </div>
          </div>

          {/* Tablero de Paradas Registradas Mejorado */}
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, overflowY: "auto" }}>
              <ParadasGestor rutaId={rutaSeleccionada?.id} />
            </div>
          </div>
        </div>

        {/* --- NIVEL 2: ADMINISTRACIÓN Y ANALÍTICA --- */}
        <div style={gridBottom}>
          <div style={cardStyle}>
            <UsuariosForm />
          </div>

          <div style={cardStyle}>
            <h3 style={sectionTitleSmall}>📉 Rendimiento y Eficiencia</h3>
            <div style={chartGridCompact}>
              <div style={chartBox}><GraficaEficiencia data={dataGraficas} /></div>
              <div style={chartBox}><GraficaComparacion data={dataGraficas} /></div>
              <div style={chartBox}><GraficaDistancia data={dataGraficas} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS ACTUALIZADOS */
const layoutStyle = { display: "flex", height: "100vh", backgroundColor: "#F4F7FE", overflow: "hidden" };
const mainContentStyle = { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "25px", gap: "20px" };
const headerStyle = { display: "flex", justifyContent: "flex-start", marginBottom: "10px" };
const titleStyle = { color: "#2B3674", fontSize: "24px", fontWeight: "800", margin: 0 };
const subtitleStyle = { color: "#A3AED0", fontSize: "13px", margin: 0 };

const cardStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(112, 144, 176, 0.08)",
  border: "1px solid #E0E5F2",
};

const gridTop = { display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "20px", minHeight: "60vh" };
const gridBottom = { display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "20px" };

const mapOverlay = { position: "absolute", top: "20px", right: "20px", zIndex: 1000, width: "220px" };
const sectionTitleSmall = { color: "#2B3674", fontSize: "16px", fontWeight: "700", marginBottom: "15px" };

const chartGridCompact = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" };
const chartBox = { background: "#F8FAFD", borderRadius: "12px", padding: "10px", height: "220px" };
const loadingStyle = { display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#2B3674" };