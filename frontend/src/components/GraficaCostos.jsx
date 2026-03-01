import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function GraficaCostos({ data }) {
  return (
    <div style={{ width: "100%", height: 220, marginTop: "20px" }}>
      <h4 style={{ marginBottom: "10px" }}>💰 Costos Operativos por Ruta</h4>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ruta" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="costo" fill="#2a5298" name="Costo ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}