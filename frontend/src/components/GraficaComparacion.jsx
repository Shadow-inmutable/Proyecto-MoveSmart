import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function GraficaTiempo({ data }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <h4 style={{ marginBottom: "10px" }}>⏱ Comparación de Tiempos (min)</h4>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ruta" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tiempo" fill="#1e3c72" name="Tiempo (min)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}