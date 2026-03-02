import { useEffect, useState } from "react";
import api from "../api/api";

export default function RutasForm() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "actual",
    color_hex: "#3498db",
    distancia_km: "",
    tiempo_estimado_min: ""
  });

  const [editandoId, setEditandoId] = useState(null);

  // 🔹 Cargar rutas
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

  useEffect(() => {
    fetchRutas();
  }, []);

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await api.put(`/rutas/${editandoId}`, form);
      } else {
        await api.post("/rutas", form);
      }

      setForm({
        nombre: "",
        tipo: "actual",
        color_hex: "#3498db",
        distancia_km: "",
        tiempo_estimado_min: ""
      });

      setEditandoId(null);
      fetchRutas();
    } catch (error) {
      console.error("Error guardando ruta:", error);
    }
  };

  // 🔹 Editar
  const handleEditar = (ruta) => {
    setForm({
      nombre: ruta.nombre,
      tipo: ruta.tipo,
      color_hex: ruta.color_hex,
      distancia_km: ruta.distancia_km,
      tiempo_estimado_min: ruta.tiempo_estimado_min || ""
    });
    setEditandoId(ruta.id);
  };

  // 🔹 Eliminar
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta ruta?")) return;

    try {
      await api.delete(`/rutas/${id}`);
      fetchRutas();
    } catch (error) {
      console.error("Error eliminando ruta:", error);
    }
  };

  if (loading) return <p>Cargando rutas...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ color: "#2b3674", marginBottom: "20px" }}>
        🚍 Gestión de Rutas
      </h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={formCard}>
        <h4 style={{ marginBottom: "15px" }}>
          {editandoId ? "Editar Ruta" : "Nueva Ruta"}
        </h4>

        <div style={grid}>
          {/* Fila 1 */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la ruta"
            value={form.nombre}
            onChange={handleChange}
            required
            style={{ ...input, gridColumn: "span 2" }}
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            style={input}
          >
            <option value="actual">Actual</option>
            <option value="alternativa">Optimizada</option>
          </select>

          <input
            type="color"
            name="color_hex"
            value={form.color_hex}
            onChange={handleChange}
            style={{
              width: "60px",
              height: "45px",
              borderRadius: "10px",
              border: "1px solid #000000",
              cursor: "pointer",
              justifySelf: "center"
            }}
          />

          {/* Fila 2 centrada y compacta */}
          <input
            type="number"
            name="distancia_km"
            placeholder="Distancia (km)"
            value={form.distancia_km}
            onChange={handleChange}
            required
            style={{
              ...input,
              gridColumn: "2 / 3",
              maxWidth: "160px",
              justifySelf: "end"
            }}
          />

          <input
            type="number"
            name="tiempo_estimado_min"
            placeholder="Tiempo estimado (min)"
            value={form.tiempo_estimado_min}
            onChange={handleChange}
            required
            style={{
              ...input,
              gridColumn: "3 / 4",
              width: "160px",
              maxWidth: "160px",
              justifySelf: "start"
            }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <button type="submit" style={btnPrimary}>
            {editandoId ? "Actualizar" : "Crear"} Ruta
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  nombre: "",
                  tipo: "actual",
                  color_hex: "#3498db",
                  distancia_km: "",
                  tiempo_estimado_min: ""
                });
                setEditandoId(null);
              }}
              style={btnSecondary}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA */}
      <div style={tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f3f5" }}>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Nombre</th>
              <th style={th}>Tipo</th>
              <th style={th}>Distancia</th>
              <th style={th}>Tiempo Est.</th>
              <th style={th}>Eficiencia</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((ruta) => (
              <tr key={ruta.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                <td style={td}>{ruta.id}</td>
                <td style={td}>{ruta.nombre}</td>
                <td style={td}>{ruta.tipo}</td>
                <td style={td}>{ruta.distancia_km} km</td>
                <td style={td}>{ruta.tiempo_estimado_min} min</td>
                <td style={td}>{ruta.eficiencia_porcentaje}%</td>
                <td style={td}>
                  <button onClick={() => handleEditar(ruta)} style={btnEdit}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(ruta.id)} style={btnDelete}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rutas.length === 0 && (
          <p style={{ padding: "15px", color: "#a3aed0" }}>
            No hay rutas registradas
          </p>
        )}
      </div>
    </div>
  );
}

/* 🎨 ESTILOS MODERNOS */
const formCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #eef2f7",
  boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
  marginBottom: "25px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 0.5fr 1fr",
  gap: "20px",
  alignItems: "center"
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  width: "100%"
};

const tableCard = {
  borderRadius: "16px",
  border: "1px solid #eef2f7",
  overflow: "hidden",
  background: "#ffffff",
  boxShadow: "0 10px 25px rgba(0,0,0,0.03)"
};

const th = { padding: "12px", textAlign: "left", fontWeight: "600" };
const td = { padding: "10px" };

const btnPrimary = {
  padding: "10px 18px",
  background: "#2b3674",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px"
};

const btnSecondary = {
  padding: "10px 18px",
  background: "#e9ecef",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnEdit = {
  marginRight: "8px",
  padding: "6px 12px",
  background: "#ffc107",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnDelete = {
  padding: "6px 12px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};