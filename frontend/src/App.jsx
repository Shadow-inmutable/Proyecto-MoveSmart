  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Navbar from './components/Navbar';
  import Home from './pages/Home';
  import Login from './pages/Login';
  import Mapa from './pages/Mapa';
  import Dashboard from './pages/Dashboard';
  import ParadasForm from './pages/ParadasForms';
  import RutasForm from './pages/RutasForm';
  import ZonasForm from './pages/ZonasForms';

  function App() {
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/paradas" element={<ParadasForm />} />
          <Route path="/rutas" element={<RutasForm />} />
          <Route path="/zonas" element={<ZonasForm />} />
        </Routes>
      </Router>
    );
  }

  export default App;