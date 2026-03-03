import { useEffect, useState } from "react";
import api from "../api/api";

export default function ParadasForm() {
  const [paradas, setParadas] = useState([]);
  const [rutas, setRutas] = useState([]); // Para el selector de rutas
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const estadoInicial = {
    ruta_id: "",
    nombre: "",
    latitud: "",
    longitud: "",
    orden: "",
  };

  const [form, setForm] = useState(estadoInicial);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const [resParadas, resRutas] = await Promise.all([
        api.get("/rutas/paradas"),
        api.get("/rutas")
      ]);
      setParadas(resParadas.data?.data || []);
      setRutas(resRutas.data?.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(estadoInicial);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aseguramos que los números se envíen como tales
      const payload = {
        ...form,
        ruta_id: parseInt(form.ruta_id),
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        orden: parseInt(form.orden)
      };

      if (editId) {
        await api.put(`/rutas/paradas/${editId}`, payload);
      } else {
        await api.post("/rutas/paradas", payload);
      }

      resetForm();
      fetchDatos();
    } catch (error) {
      console.error("Error guardando parada:", error);
      alert("Error al guardar los datos");
    }
  };

  const handleEdit = (parada) => {
    setEditId(parada.id);
    setForm({
      ruta_id: parada.ruta_id || "",
      nombre: parada.nombre || "",
      latitud: parada.latitud || "",
      longitud: parada.longitud || "",
      orden: parada.orden || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta parada?")) return;
    try {
      await api.delete(`/rutas/paradas/${id}`);
      fetchDatos();
    } catch (error) {
      console.error("Error eliminando parada:", error);
    }
  };

  if (loading) return <div style={{padding: "50px", textAlign: "center"}}>Cargando infraestructura de transporte...</div>;

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: "30px" }}>
        <h2 style={styles.title}>🚌 Gestión de Paradas</h2>
        <p style={{ color: "#707EAE" }}>Organiza los puntos de ascenso y descenso por cada ruta de Manizales</p>
      </header>

      {/* CARD FORMULARIO */}
      <div style={styles.card}>
        <h3 style={styles.subtitle}>
          {editId ? "✏️ Editar Parada Existente" : "➕ Agregar Nueva Parada al Sistema"}
        </h3>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Seleccionar Ruta</label>
            <select
              style={styles.input}
              name="ruta_id"
              value={form.ruta_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione una ruta --</option>
              {rutas.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre de la Parada</label>
            <input
              style={styles.input}
              name="nombre"
              placeholder="Ej: Estación El Cable"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Latitud</label>
            <input
              style={styles.input}
              type="number"
              step="any"
              name="latitud"
              placeholder="5.0689"
              value={form.latitud}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Longitud</label>
            <input
              style={styles.input}
              type="number"
              step="any"
              name="longitud"
              placeholder="-75.5039"
              value={form.longitud}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Orden</label>
            <input
              style={styles.input}
              type="number"
              name="orden"
              placeholder="1, 2, 3..."
              value={form.orden}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryBtn}>
              {editId ? "Actualizar Cambios" : "Guardar Parada"}
            </button>

            {editId && (
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div style={styles.tableCard}>
        <h3 style={styles.subtitle}>Registros en Base de Datos</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Ruta Vinculada</th>
              <th style={styles.th}>Parada</th>
              <th style={styles.th}>Coordenadas</th>
              <th style={styles.th}>Posición</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paradas.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>#{p.id}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>Ruta {p.ruta_id}</span>
                </td>
                <td style={{...styles.td, fontWeight: "600"}}>{p.nombre}</td>
                <td style={{...styles.td, fontSize: "12px", color: "#707EAE"}}>
                  {p.latitud}, {p.longitud}
                </td>
                <td style={styles.td}>{p.orden}°</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(p)} style={styles.editBtn}>Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paradas.length === 0 && (
          <p style={styles.empty}>No hay paradas configuradas para el transporte público.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#F8FAFD",
    minHeight: "100vh",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  title: {
    color: "#2B3674",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "5px",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0px 10px 30px rgba(112, 144, 176, 0.1)",
    marginBottom: "35px",
  },
  subtitle: {
    color: "#2B3674",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2B3674",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #E0E5F2",
    backgroundColor: "#F4F7FE",
    outline: "none",
    fontSize: "14px",
    color: "#2B3674",
  },
  buttonGroup: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },
  primaryBtn: {
    background: "#4318FF",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)",
  },
  cancelBtn: {
    background: "#E2E8F0",
    color: "#2B3674",
    border: "none",
    padding: "12px 24px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  tableCard: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0px 10px 30px rgba(112, 144, 176, 0.08)",
    padding: "25px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    color: "#A3AED0",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    borderBottom: "1px solid #F4F7FE",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #F4F7FE",
    fontSize: "14px",
    color: "#2B3674",
  },
  badge: {
    background: "#E3F2FD",
    color: "#1976D2",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
  },
  editBtn: {
    background: "#FFEB3B",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "8px",
    fontWeight: "600",
  },
  deleteBtn: {
    background: "#FF5252",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#A3AED0",
  },
};