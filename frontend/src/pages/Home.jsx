import { Link } from "react-router-dom";

export default function Home() {
  const container = {
    minHeight: "100vh",
    background: "#f4f6f8",
  };

  const hero = {
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
    padding: "80px 20px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  const title = {
    fontSize: "2.5rem",
    marginBottom: "10px",
  };

  const subtitle = {
    fontSize: "1.2rem",
    opacity: 0.9,
  };

  const buttonContainer = {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  };

  const button = {
    background: "white",
    color: "#1e3c72",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  const section = {
    padding: "60px 20px",
    textAlign: "center",
  };

  const sectionSubtitle = {
    color: "#6c757d",
    maxWidth: "600px",
    margin: "10px auto 0 auto",
  };

  const cardContainer = {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginTop: "40px",
  };

  const card = {
    background: "white",
    padding: "30px 20px",
    borderRadius: "16px",
    width: "270px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textAlign: "center",
    border: "1px solid rgba(0,0,0,0.04)",
  };

  const iconCircle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    margin: "0 auto 15px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
  };

  return (
    <div style={container}>
      {/* HERO PRINCIPAL */}
      <div style={hero}>
        <h1 style={title}>🚍 MoveSmart Manizales</h1>
        <p style={subtitle}>
          Sistema inteligente para el análisis y optimización de rutas de transporte público
        </p>

        <div style={buttonContainer}>
          <Link to="/mapa" style={button}>
            🗺 Ver Mapa Interactivo
          </Link>
          <Link to="/login" style={button}>
            🔐 Acceso Gestor
          </Link>
        </div>
      </div>

      {/* SECCIÓN FUNCIONALIDADES REDISEÑADA */}
      <div style={section}>
        <h2>¿Qué puedes hacer en la plataforma?</h2>
        <p style={sectionSubtitle}>
          Herramientas inteligentes para analizar, visualizar y optimizar la movilidad urbana en Manizales.
        </p>

        <div style={cardContainer}>
          {/* CARD 1 */}
          <div style={card} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            <div style={iconCircle}>🛣</div>
            <h3>Consultar Rutas</h3>
            <p>
              Visualiza rutas activas y sus paradas dentro de la ciudad para analizar su cobertura y eficiencia.
            </p>
          </div>

          {/* CARD 2 */}
          <div style={card} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            <div style={iconCircle}>📍</div>
            <h3>Mapa en Tiempo Real</h3>
            <p>
              Explora el mapa interactivo con las paradas del transporte público y su ubicación geográfica.
            </p>
          </div>

          {/* CARD 3 */}
          <div style={card} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            <div style={iconCircle}>⚠</div>
            <h3>Zonas Críticas</h3>
            <p>
              Identifica zonas con mayor congestión vehicular para mejorar la planificación del transporte.
            </p>
          </div>

          {/* CARD 4 */}
          <div style={card} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            <div style={iconCircle}>📊</div>
            <h3>Optimización de Rutas</h3>
            <p>
              Analiza métricas, simulaciones y comparaciones de escenarios para reducir tiempos y costos operativos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}