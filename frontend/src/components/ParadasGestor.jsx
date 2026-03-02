import { useEffect, useState } from "react";
import api from "../api/api";

export default function ParadasGestor() {
  const [paradas, setParadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParadas = async () => {
      try {
        const res = await api.get("/rutas/paradas"); // endpoint del controlador getParada
        const data = res.data?.data || [];
        setParadas(data);
      } catch (error) {
        console.error("Error cargando paradas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParadas();
  }, []);

  if (loading) return <p>Cargando paradas...</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h4 style={{ color: "#2b3674", marginBottom: "10px" }}>
        🚌 Paradas registradas en BD
      </h4>

      <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #e9ecef", borderRadius: "8px" }}>
        <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f3f5" }}>
            <tr>
              <th style={{ padding: "8px" }}>ID</th>
              <th style={{ padding: "8px" }}>Ruta ID</th>
              <th style={{ padding: "8px" }}>Nombre</th>
              <th style={{ padding: "8px" }}>Latitud</th>
              <th style={{ padding: "8px" }}>Longitud</th>
              <th style={{ padding: "8px" }}>Orden</th>
            </tr>
          </thead>
          <tbody>
            {paradas.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                <td style={{ padding: "6px" }}>{p.id}</td>
                <td style={{ padding: "6px" }}>{p.ruta_id}</td>
                <td style={{ padding: "6px" }}>{p.nombre}</td>
                <td style={{ padding: "6px" }}>{p.latitud}</td>
                <td style={{ padding: "6px" }}>{p.longitud}</td>
                <td style={{ padding: "6px" }}>{p.orden}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {paradas.length === 0 && (
          <p style={{ padding: "10px", color: "#a3aed0" }}>
            No hay paradas registradas
          </p>
        )}
      </div>
    </div>
  );
}