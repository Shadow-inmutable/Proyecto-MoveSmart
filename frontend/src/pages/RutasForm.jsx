import { useEffect, useState } from "react";
import api from "../api/api";

export default function RutasForm() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  // 1. Estado inicial limpio
  const estadoInicial = {
    nombre: "",
    tipo: "actual",
    color_hex: "#3498db",
    distancia_km: "",
    tiempo_estimado_min: ""
  };

  const [form, setForm] = useState(estadoInicial);

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

      setForm(estadoInicial);
      setEditandoId(null);
      fetchRutas();
    } catch (error) {
      console.error("Error guardando ruta:", error);
      alert("Hubo un error al procesar la solicitud");
    }
  };

  // 🔹 EDITAR (Corregido para asegurar que los datos se muestren)
  const handleEditar = (ruta) => {
    setEditandoId(ruta.id);
    setForm({
      nombre: ruta.nombre || "",
      tipo: ruta.tipo || "actual",
      color_hex: ruta.color_hex || "#3498db",
      distancia_km: ruta.distancia_km || "",
      tiempo_estimado_min: ruta.tiempo_estimado_min || ""
    });
    // Scroll suave hacia el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 Eliminar
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta ruta?")) return;
    try {
      await api.delete(`/rutas/${id}`);
      fetchRutas();
    } catch (error) {
      console.error("Error eliminando ruta:", error);
    }
  };

  if (loading) return <div style={{padding: "50px", textAlign: "center"}}>Cargando panel de gestión...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#F8FAFD", minHeight: "100vh" }}>
      <header style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2b3674", fontSize: "28px", fontWeight: "700" }}>🚍 Gestión de Rutas</h2>
        <p style={{ color: "#707EAE" }}>Administra y optimiza las trayectorias del transporte en Manizales</p>
      </header>

      {/* FORMULARIO PROFESIONAL */}
      <div style={formCard}>
        <div style={{ borderBottom: "1px solid #F4F7FE", marginBottom: "20px", paddingBottom: "10px" }}>
            <h4 style={{ color: "#2B3674", margin: 0 }}>
                {editandoId ? "✏️ Editando Ruta" : "➕ Registrar Nueva Ruta"}
            </h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={grid}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Nombre de la Ruta</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Circular Av. Santander"
                value={form.nombre}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} style={inputStyle}>
                <option value="actual">Ruta Actual</option>
                <option value="alternativa">Ruta Optimizada</option>
              </select>
            </div>

            <div style={{ textAlign: "center" }}>
              <label style={labelStyle}>Color</label>
              <input
                type="color"
                name="color_hex"
                value={form.color_hex}
                onChange={handleChange}
                style={colorPicker}
              />
            </div>

            <div>
              <label style={labelStyle}>Distancia (km)</label>
              <input
                type="number"
                step="0.1"
                name="distancia_km"
                value={form.distancia_km}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Tiempo (min)</label>
              <input
                type="number"
                name="tiempo_estimado_min"
                value={form.tiempo_estimado_min}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "25px", display: "flex", gap: "12px" }}>
            <button type="submit" style={btnPrimary}>
              {editandoId ? "Actualizar Cambios" : "Guardar Ruta"}
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

      {/* TABLA MODERNA */}
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F4F7FE" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Ruta</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Distancia</th>
              <th style={thStyle}>Tiempo</th>
              <th style={thStyle}>Eficiencia</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((ruta) => (
              <tr key={ruta.id} style={trStyle}>
                <td style={tdStyle}>#{ruta.id}</td>
                <td style={tdStyle}>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <div style={{width: "12px", height: "12px", borderRadius: "50%", backgroundColor: ruta.color_hex}}></div>
                        <span style={{fontWeight: "600"}}>{ruta.nombre}</span>
                    </div>
                </td>
                <td style={tdStyle}>
                    <span style={{
                        padding: "4px 10px", 
                        borderRadius: "20px", 
                        fontSize: "12px",
                        backgroundColor: ruta.tipo === 'actual' ? '#E2E8F0' : '#E3F2FD',
                        color: ruta.tipo === 'actual' ? '#4A5568' : '#1976D2'
                    }}>
                        {ruta.tipo}
                    </span>
                </td>
                <td style={tdStyle}>{ruta.distancia_km} km</td>
                <td style={tdStyle}>{ruta.tiempo_estimado_min} min</td>
                <td style={{...tdStyle, color: "#05CD99", fontWeight: "bold"}}>{ruta.eficiencia_porcentaje}%</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEditar(ruta)} style={btnIconEdit}>Editar</button>
                  <button onClick={() => handleEliminar(ruta.id)} style={btnIconDelete}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 SISTEMA DE DISEÑO (ESTILOS) */
const formCard = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0px 10px 30px rgba(112, 144, 176, 0.1)",
  marginBottom: "35px",
  border: "none"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  alignItems: "end"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#2B3674",
  fontSize: "14px",
  fontWeight: "600"
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #E0E5F2",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "#F4F7FE"
};

const colorPicker = {
  width: "100%",
  height: "45px",
  borderRadius: "14px",
  border: "1px solid #E0E5F2",
  cursor: "pointer",
  backgroundColor: "#F4F7FE",
  padding: "5px"
};

const tableContainer = {
  borderRadius: "20px",
  overflow: "hidden",
  background: "#ffffff",
  boxShadow: "0px 10px 30px rgba(112, 144, 176, 0.08)"
};

const thStyle = { padding: "16px", textAlign: "left", color: "#A3AED0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" };
const tdStyle = { padding: "16px", color: "#2B3674", fontSize: "14px" };
const trStyle = { borderBottom: "1px solid #F4F7FE", transition: "0.2s" };

const btnPrimary = {
  padding: "12px 24px",
  background: "#4318FF",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)"
};

const btnSecondary = {
  padding: "12px 24px",
  background: "#E2E8F0",
  color: "#2B3674",
  border: "none",
  borderRadius: "14px",
  fontWeight: "700",
  cursor: "pointer"
};

const btnIconEdit = {
  marginRight: "10px",
  background: "#FFEB3B",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600"
};

const btnIconDelete = {
  background: "#FF5252",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600"
};