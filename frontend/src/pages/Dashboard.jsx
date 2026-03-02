import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MapaLeaflet from "../components/MapaLeaflet";
import MetricasOptimizacion from "../components/MetricasOptimizacion";
import GraficaEficiencia from "../components/GraficaEficiencia";
import GraficaDistancia from "../components/GraficaDistancia";
import GraficaComparacion from "../components/GraficaComparacion";
import api from "../api/api";

export default function Dashboard() {
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📡 Cargar rutas desde backend */
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const res = await api.get("/rutas");
        const data = res.data?.data || [];
        setRutas(data);
      } catch (error) {
        console.error("Error cargando rutas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRutas();
  }, []);

  /* 📊 Dataset seguro para gráficas */
  const rutasBase = rutaSeleccionada ? [rutaSeleccionada] : rutas;

  const dataGraficas = rutasBase.map((ruta) => ({
    ruta: ruta?.nombre || "Sin nombre",
    tiempo_actual: ruta?.tiempo_estimado_min || 0,
    tiempo_opt: Math.round((ruta?.tiempo_estimado_min || 0) * 0.8),
    eficiencia: ruta?.eficiencia_porcentaje || 0,
    distancia: ruta?.distancia_km || 0,
  }));

  if (loading) {
    return <div style={{ padding: 40 }}>Cargando rutas...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f4f7fe" }}>
      
      {/* 1. SIDEBAR IZQUIERDO (Fijo) */}
      <Sidebar onRutaSelect={setRutaSeleccionada} />

      {/* 2. ÁREA DE CONTENIDO (Todo lo demás va aquí dentro con Scroll) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "20px" }}>
        
        {/* FILA SUPERIOR: MAPA Y MÉTRICAS (Lado a lado) */}
        <div style={{ display: "flex", gap: "20px", minHeight: "60vh", marginBottom: "20px" }}>
          
          {/* Bloque del Mapa */}
          <div style={{ flex: 7, background: "white", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <MapaLeaflet rutaSeleccionada={rutaSeleccionada} />
          </div>

          {/* Bloque de Métricas (Lo que antes era tu panel derecho) */}
          <div style={{ flex: 3, background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflowY: "auto" }}>
            <MetricasOptimizacion rutaSeleccionada={rutaSeleccionada} />
            <div style={{ marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "10px", textAlign: "center" }}>
               {rutaSeleccionada ? (
                <h4 style={{ margin: 0, color: "#422afb" }}>🧪 Simulación: {rutaSeleccionada.nombre}</h4>
              ) : (
                <h4 style={{ margin: 0, color: "#a3aed0" }}>🧪 Seleccione una ruta</h4>
              )}
            </div>
          </div>
        </div>

        {/* FILA INFERIOR: GRÁFICAS (Debajo del mapa, ocupando todo el ancho) */}
        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginBottom: "25px", color: "#2b3674", fontWeight: "bold" }}>📉 Análisis Comparativo de Movilidad</h3>
          
          {/* Esta rejilla pone las 3 gráficas una al lado de la otra */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px" }}>
            {dataGraficas.length > 0 ? (
              <>
                <div style={{ minHeight: "300px" }}><GraficaComparacion data={dataGraficas} /></div>
                <div style={{ minHeight: "300px" }}><GraficaEficiencia data={dataGraficas} /></div>
                <div style={{ minHeight: "300px" }}><GraficaDistancia data={dataGraficas} /></div>
              </>
            ) : (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "50px" }}>No hay datos disponibles</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}