import MapaLeaflet from "../components/MapaLeaflet";
import ParadasPublicas from "../components/ParadasPublicas";

export default function Mapa() {
  return (
    <div style={{ height: "100vh", display: "flex" }}>
      
      {/* MAPA (igual que antes) */}
      <div style={{ flex: 1 }}>
        <MapaLeaflet />
      </div>

      {/* PANEL LATERAL DERECHO */}
      <ParadasPublicas />
      
    </div>
  );
}