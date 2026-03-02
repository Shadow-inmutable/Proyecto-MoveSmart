import { useEffect, useState } from "react";
import api from "../api/api";

export default function ParadasForm() {
  const [paradas, setParadas] = useState([]);
  const [form, setForm] = useState({
    ruta_id: "",
    nombre: "",
    latitud: "",
    longitud: "",
    orden: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchParadas();
  }, []);

  const fetchParadas = async () => {
    try {
      const res = await api.get("/rutas/paradas");
      setParadas(res.data?.data || []);
    } catch (error) {
      console.error("Error cargando paradas:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ ruta_id: "", nombre: "", latitud: "", longitud: "", orden: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/rutas/paradas/${editId}`, form);
      } else {
        await api.post("/rutas/paradas", form);
      }

      resetForm();
      fetchParadas();
    } catch (error) {
      console.error("Error guardando parada:", error);
    }
  };

  const handleEdit = (parada) => {
    setForm(parada);
    setEditId(parada.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta parada?")) return;

    try {
      await api.delete(`/rutas/paradas/${id}`);
      fetchParadas();
    } catch (error) {
      console.error("Error eliminando parada:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚌 Gestión de Paradas</h2>

      {/* CARD FORMULARIO */}
      <div style={styles.card}>
        <h3 style={styles.subtitle}>
          {editId ? "Editar Parada" : "Nueva Parada"}
        </h3>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <input
            style={styles.input}
            name="ruta_id"
            placeholder="Ruta ID"
            value={form.ruta_id}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="nombre"
            placeholder="Nombre de la parada"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="latitud"
            placeholder="Latitud"
            value={form.latitud}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="longitud"
            placeholder="Longitud"
            value={form.longitud}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="orden"
            placeholder="Orden en la ruta"
            value={form.orden}
            onChange={handleChange}
            required
          />

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryBtn}>
              {editId ? "Actualizar" : "Agregar"} Parada
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
        <h3 style={styles.subtitle}>Listado de Paradas</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Ruta</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Lat</th>
              <th style={styles.th}>Lng</th>
              <th style={styles.th}>Orden</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paradas.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>{p.ruta_id}</td>
                <td style={styles.td}>{p.nombre}</td>
                <td style={styles.td}>{p.latitud}</td>
                <td style={styles.td}>{p.longitud}</td>
                <td style={styles.td}>{p.orden}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(p)} style={styles.editBtn}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paradas.length === 0 && (
          <p style={styles.empty}>No hay paradas registradas</p>
        )}
      </div>
    </div>
  );
}

/* 🎨 ESTILOS MODERNOS */
const styles = {
  container: {
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh",
  },
  title: {
    color: "#2b3674",
    marginBottom: "20px",
  },
  subtitle: {
    color: "#2b3674",
    marginBottom: "15px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "25px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e0e6ed",
    outline: "none",
    fontSize: "14px",
  },
  buttonGroup: {
    gridColumn: "1 / -1",
    marginTop: "10px",
  },
  primaryBtn: {
    background: "#2b3674",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelBtn: {
    background: "#e4e7ec",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  tableCard: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f1f3f9",
    fontSize: "14px",
    color: "#2b3674",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #f1f3f9",
    fontSize: "14px",
  },
  tr: {
    transition: "background 0.2s",
  },
  editBtn: {
    background: "#ffc107",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  empty: {
    padding: "15px",
    color: "#a3aed0",
  },
};