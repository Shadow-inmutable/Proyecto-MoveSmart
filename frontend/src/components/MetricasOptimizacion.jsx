import { useEffect, useState } from "react";
import api from "../api/api";

export default function MetricasOptimizacion({ rutaSeleccionada }) {
  const [metricas, setMetricas] = useState(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const rutasRes = await api.get("/rutas");
        const zonasRes = await api.get("/rutas/zonas");

        let rutas = rutasRes.data.data || [];
        const zonas = zonasRes.data.data || [];

        // 🔎 Filtrar si hay ruta seleccionada
        if (rutaSeleccionada) {
          rutas = rutas.filter(r => r.id === rutaSeleccionada.id);
        }

        const tiempoTotal = rutas.reduce(
          (acc, r) => acc + (r.tiempo_estimado_min || 0),
          0
        );

        const costoTotal = rutas.reduce(
          (acc, r) => acc + (r.distancia_km || 0) * 1200,
          0
        );

        const congestionProm =
          zonas.length > 0
            ? zonas.reduce((acc, z) => acc + 60, 0) / zonas.length
            : 0;

        setMetricas({
          tiempo: tiempoTotal,
          costo: costoTotal,
          congestion: congestionProm.toFixed(1),
        });
      } catch (error) {
        console.error("Error cargando métricas:", error);
      }
    };

    fetchMetricas();
  }, [rutaSeleccionada]);

  if (!metricas) return <p>Cargando métricas...</p>;

  return (
    <div>
      <h3>📈 Métricas de Optimización</h3>
      {rutaSeleccionada && (
        <p>Ruta analizada: <strong>{rutaSeleccionada.nombre}</strong></p>
      )}

      <p>⏱ Tiempo estimado: <strong>{metricas.tiempo} min</strong></p>
      <p>💰 Costo operativo: <strong>${metricas.costo.toLocaleString()}</strong></p>
      <p>🚦 Congestión promedio: <strong>{metricas.congestion}%</strong></p>
    </div>
  );
}