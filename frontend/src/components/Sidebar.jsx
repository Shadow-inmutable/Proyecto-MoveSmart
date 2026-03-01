export default function Sidebar({ rutas, zonas }) {
  return (
    <div style={{ width: "20%", background: "#f4f6f8", padding: "20px" }}>
      <h3>🛣 Rutas Activas</h3>
      <ul>
        {rutas.map((ruta, index) => (
          <li key={index}>{ruta.nombre}</li>
        ))}
      </ul>

      <h3>⚠ Zonas Críticas</h3>
      <ul>
        {zonas.map((zona, index) => (
          <li key={index}>
            {zona.nombre} - {zona.nivel}
          </li>
        ))}
      </ul>
    </div>
  );
}