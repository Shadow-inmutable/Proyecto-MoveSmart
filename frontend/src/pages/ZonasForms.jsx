import { useEffect, useState } from "react";
import api from "../api/api";

export default function ZonasForm() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  const estadoInicial = {
    nombre: "",
    nivel_congestion: "medio", // Cambiado a 'medio' para coincidir con SQL
    latitud: "",
    longitud: "",
    descripcion_impacto: ""
  };

  const [form, setForm] = useState(estadoInicial);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosEnvio = {
        ...form,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud)
      };

      if (editandoId) {
        await api.put(`/rutas/zonas/${editandoId}`, datosEnvio);
      } else {
        await api.post("/rutas/zonas", datosEnvio);
      }

      setForm(estadoInicial);
      setEditandoId(null);
      fetchZonas();
    } catch (error) {
      console.error("Error guardando zona:", error);
      alert("Error al procesar la zona crítica");
    }
  };

  const handleEditar = (zona) => {
    setEditandoId(zona.id);
    setForm({
      nombre: zona.nombre || "",
      // Normalizamos el valor que viene de la DB para el select
      nivel_congestion: zona.nivel_congestion || "medio",
      latitud: zona.latitud || "",
      longitud: zona.longitud || "",
      descripcion_impacto: zona.descripcion_impacto || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta zona crítica?")) return;
    try {
      await api.delete(`/rutas/zonas/${id}`);
      fetchZonas();
    } catch (error) {
      console.error("Error eliminando zona:", error);
    }
  };

  if (loading) return <div style={{padding: "40px", textAlign: "center", color: "#2b3674"}}>Cargando inteligencia vial...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#F8FAFD", minHeight: "100vh" }}>
      <header style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2b3674", fontSize: "28px", fontWeight: "700" }}>🚨 Gestión de Zonas Críticas ⚠️</h2>
        <p style={{ color: "#707EAE" }}>Monitorea y define puntos de alta congestión en la red de transporte</p>
      </header>

      <div style={formCard}>
        <h4 style={formTitle}>
          {editandoId ? "✏️ Editar Punto de Congestión" : "➕ Registrar Nueva Alerta Vial"}
        </h4>

        <form onSubmit={handleSubmit}>
          <div style={formGrid}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Nombre de la zona</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Sector El Cable"
                value={form.nombre}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Nivel de congestión</label>
              <select
                name="nivel_congestion"
                value={form.nivel_congestion}
                onChange={handleChange}
                style={inputStyle}
              >
                {/* Valores corregidos para coincidir con el ENUM de la BD */}
                <option value="bajo">🟢 Bajo</option>
                <option value="medio">🟡 Medio</option>
                <option value="alto">🔴 Alto</option>
              </select>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Latitud</label>
              <input
                type="number"
                step="any"
                name="latitud"
                placeholder="5.0689"
                value={form.latitud}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Longitud</label>
              <input
                type="number"
                step="any"
                name="longitud"
                placeholder="-75.5039"
                value={form.longitud}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ ...fieldGroup, gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Análisis del impacto</label>
              <textarea
                name="descripcion_impacto"
                placeholder="Detalla cómo esta zona afecta la fluidez de las rutas..."
                value={form.descripcion_impacto}
                onChange={handleChange}
                rows={3}
                style={textareaStyle}
              />
            </div>
          </div>

          <div style={actions}>
            <button type="submit" style={btnPrimary}>
              {editandoId ? "Actualizar Alerta" : "Registrar Punto Crítico"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={() => { setForm(estadoInicial); setEditandoId(null); }}
                style={btnSecondary}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F4F7FE" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Zona</th>
              <th style={thStyle}>Nivel</th>
              <th style={thStyle}>Coordenadas</th>
              <th style={thStyle}>Impacto</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {zonas.map((zona) => (
              <tr key={zona.id} style={trStyle}>
                <td style={tdStyle}>#{zona.id}</td>
                <td style={{...tdStyle, fontWeight: "600"}}>{zona.nombre}</td>
                <td style={tdStyle}>
                  {/* Lógica de colores corregida para leer 'alto', 'medio', 'bajo' */}
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: 
                      zona.nivel_congestion === 'alto' ? '#FFEDED' : 
                      zona.nivel_congestion === 'medio' ? '#FFF9E6' : '#E6FFFA',
                    color: 
                      zona.nivel_congestion === 'alto' ? '#FF5252' : 
                      zona.nivel_congestion === 'medio' ? '#FFB300' : '#00BFA5'
                  }}>
                    {zona.nivel_congestion?.toUpperCase()}
                  </span>
                </td>
                <td style={{...tdStyle, fontSize: "12px", color: "#707EAE"}}>
                  {zona.latitud}, {zona.longitud}
                </td>
                <td style={{...tdStyle, fontSize: "13px", maxWidth: "250px"}}>{zona.descripcion_impacto}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEditar(zona)} style={btnIconEdit}>Editar</button>
                  <button onClick={() => handleEliminar(zona.id)} style={btnIconDelete}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {zonas.length === 0 && <p style={emptyText}>No hay alertas registradas en el sistema.</p>}
      </div>
    </div>
  );
}

// ... (estilos se mantienen igual)
const formCard = { background: "#ffffff", padding: "30px", borderRadius: "20px", boxShadow: "0px 10px 30px rgba(112, 144, 176, 0.1)", marginBottom: "35px", border: "none" };
const formTitle = { marginBottom: "20px", color: "#2B3674", fontWeight: "700" };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const fieldGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { color: "#2B3674", fontSize: "14px", fontWeight: "600" };
const inputStyle = { padding: "12px 16px", borderRadius: "14px", border: "1px solid #E0E5F2", width: "100%", boxSizing: "border-box", backgroundColor: "#F4F7FE", outline: "none" };
const textareaStyle = { ...inputStyle, resize: "none", fontFamily: "inherit" };
const actions = { marginTop: "25px", display: "flex", justifyContent: "flex-end", gap: "12px" };
const tableContainer = { borderRadius: "20px", overflow: "hidden", background: "#ffffff", boxShadow: "0px 10px 30px rgba(112, 144, 176, 0.08)" };
const thStyle = { padding: "16px", textAlign: "left", color: "#A3AED0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" };
const tdStyle = { padding: "16px", color: "#2B3674", fontSize: "14px" };
const trStyle = { borderBottom: "1px solid #F4F7FE" };
const btnPrimary = { padding: "12px 24px", background: "#2B3674", color: "white", border: "none", borderRadius: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0px 10px 20px rgba(43, 54, 116, 0.2)" };
const btnSecondary = { padding: "12px 24px", background: "#E2E8F0", color: "#2B3674", border: "none", borderRadius: "14px", fontWeight: "700", cursor: "pointer" };
const btnIconEdit = { marginRight: "10px", background: "#FFEB3B", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" };
const btnIconDelete = { background: "#FF5252", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" };
const emptyText = { padding: "30px", textAlign: "center", color: "#A3AED0" };