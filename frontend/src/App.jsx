import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importamos el Navbar
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Navbar /> {/* Se coloca aquí para que sea visible siempre */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;