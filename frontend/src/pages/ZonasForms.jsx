import { useEffect, useState } from "react";
import api from "../api/api";

export default function ZonasForm() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    nivel_congestion: "media",
    latitud: "",
    longitud: "",
    descripcion_impacto: ""
  });

  const [editandoId, setEditandoId] = useState(null);

  // 🔹 Cargar zonas
  const fetchZonas = async () => {
    try {
      const res = await api.get("/rutas/zonas");
      setZonas(res.data?.data || []);
    } catch (error) {
      console.error("Error cargando zonas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZonas();
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
        await api.put(`/rutas/zonas/${editandoId}`, form);
      } else {
        await api.post("/rutas/zonas", form);
      }

      setForm({
        nombre: "",
        nivel_congestion: "media",
        latitud: "",
        longitud: "",
        descripcion_impacto: ""
      });

      setEditandoId(null);
      fetchZonas();
    } catch (error) {
      console.error("Error guardando zona:", error);
    }
  };

  // 🔹 Editar
  const handleEditar = (zona) => {
    setForm({
      nombre: zona.nombre,
      nivel_congestion: zona.nivel_congestion,
      latitud: zona.latitud,
      longitud: zona.longitud,
      descripcion_impacto: zona.descripcion_impacto
    });
    setEditandoId(zona.id);
  };

  // 🔹 Eliminar
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta zona crítica?")) return;

    try {
      await api.delete(`/rutas/zonas/${id}`);
      fetchZonas();
    } catch (error) {
      console.error("Error eliminando zona:", error);
    }
  };

  if (loading) return <p>Cargando zonas críticas...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ color: "#2b3674", marginBottom: "20px" }}>
        🚨 Gestión de Zonas Críticas ⚠️
      </h2>

      {/* ================= FORMULARIO OPTIMIZADO ================= */}
      <form onSubmit={handleSubmit} style={formCard}>
        <h4 style={formTitle}>
          {editandoId ? "✏️ Editar Zona Crítica" : "➕ Nueva Zona Crítica"}
        </h4>

        <div style={formGrid}>
          {/* Nombre */}
          <div style={fieldGroup}>
            <label style={label}>Nombre de la zona</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Glorieta de la Autónoma"
              value={form.nombre}
              onChange={handleChange}
              required
              style={input}
            />
          </div>

          {/* Nivel */}
          <div style={fieldGroup}>
            <label style={label}>Nivel de congestión</label>
            <select
              name="nivel_congestion"
              value={form.nivel_congestion}
              onChange={handleChange}
              style={input}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Latitud */}
          <div style={fieldGroup}>
            <label style={label}>Latitud</label>
            <input
              type="number"
              step="any"
              name="latitud"
              placeholder="5.0689"
              value={form.latitud}
              onChange={handleChange}
              required
              style={inputSmall}
            />
          </div>

          {/* Longitud */}
          <div style={fieldGroup}>
            <label style={label}>Longitud</label>
            <input
              type="number"
              step="any"
              name="longitud"
              placeholder="-75.5039"
              value={form.longitud}
              onChange={handleChange}
              required
              style={inputSmall}
            />
          </div>

          {/* Descripción */}
          <div style={{ ...fieldGroup, gridColumn: "1 / -1" }}>
            <label style={label}>Descripción del impacto</label>
            <textarea
              name="descripcion_impacto"
              placeholder="Describe cómo afecta esta zona al tráfico..."
              value={form.descripcion_impacto}
              onChange={handleChange}
              rows={3}
              style={textarea}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div style={actions}>
          <button type="submit" style={btnPrimary}>
            {editandoId ? "Actualizar Zona" : "Registrar Zona"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  nombre: "",
                  nivel_congestion: "media",
                  latitud: "",
                  longitud: "",
                  descripcion_impacto: ""
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

      {/* ================= TABLA ================= */}
      <div style={tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f3f5" }}>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Nombre</th>
              <th style={th}>Congestión</th>
              <th style={th}>Latitud</th>
              <th style={th}>Longitud</th>
              <th style={th}>Descripción</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {zonas.map((zona) => (
              <tr key={zona.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                <td style={td}>{zona.id}</td>
                <td style={td}>{zona.nombre}</td>
                <td style={td}>{zona.nivel_congestion}</td>
                <td style={td}>{zona.latitud}</td>
                <td style={td}>{zona.longitud}</td>
                <td style={td}>{zona.descripcion_impacto}</td>
                <td style={td}>
                  <button onClick={() => handleEditar(zona)} style={btnEdit}>
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(zona.id)}
                    style={btnDelete}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {zonas.length === 0 && (
          <p style={{ padding: "15px", color: "#a3aed0" }}>
            No hay zonas críticas registradas
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const formCard = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #eef2f7",
  boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
  marginBottom: "30px"
};

const formTitle = {
  marginBottom: "20px",
  color: "#2b3674",
  fontWeight: "600"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const fieldGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const label = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#2b3674"
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  width: "100%"
};

const inputSmall = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  width: "100%",
  maxWidth: "220px"
};

const textarea = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  resize: "none",
  width: "100%"
};

const actions = {
  marginTop: "25px",
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px"
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
  cursor: "pointer"
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