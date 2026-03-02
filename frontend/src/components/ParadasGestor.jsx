import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ParadasGestor() {
  const [paradas, setParadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 navegación

  useEffect(() => {
    const fetchParadas = async () => {
      try {
        const res = await api.get("/rutas/paradas");
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
        🚌 Paradas registradas
      </h4>

      {/* BOTÓN NUEVO */}
      <button
        onClick={() => navigate("/paradas")}
        style={{
          marginBottom: "10px",
          padding: "8px 14px",
          background: "#2b3674",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Ver / Gestionar Paradas
      </button>

      <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #e9ecef", borderRadius: "8px" }}>
        <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f3f5" }}>
            <tr>
              <th>ID</th>
              <th>Ruta ID</th>
              <th>Nombre</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Orden</th>
            </tr>
          </thead>
          <tbody>
            {paradas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.ruta_id}</td>
                <td>{p.nombre}</td>
                <td>{p.latitud}</td>
                <td>{p.longitud}</td>
                <td>{p.orden}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}