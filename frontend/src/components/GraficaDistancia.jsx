import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function GraficaDistancia({ data }) {
  return (
    <div style={{ width: "100%", height: 220, marginTop: "20px" }}>
      <h4 style={{ marginBottom: "10px" }}>📏 Distancia por Ruta (km)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ruta" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="distancia" fill="#3b82f6" name="Distancia (km)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}