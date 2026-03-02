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

export default function GraficaEficiencia({ data }) {
  return (
    <div style={{ width: "100%", height: 220, marginTop: "20px" }}>
      <h4 style={{ marginBottom: "10px" }}>⚡ Eficiencia por Ruta (%)</h4>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ruta" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="eficiencia" fill="#22c55e" name="Eficiencia (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}