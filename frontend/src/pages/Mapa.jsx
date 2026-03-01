import MapaLeaflet from "../components/MapaLeaflet";

export default function Mapa() {
  return (
    <div style={{ height: "100vh" }}>
      {/* <h1 style={{ padding: "10px" }}>📍 Mapa Interactivo de Rutas</h1>*/}
      <div style={{ height: "90%" }}>
        <MapaLeaflet />
      </div>
    </div>
  );
}