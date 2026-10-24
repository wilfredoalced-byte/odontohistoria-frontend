import { useEffect, useState } from 'react';
import { obtenerPacientes } from './api';
import PacientesTabla from './components/PacientesTabla';
import './App.css';

// OPERACIÓN 11: componente principal del panel, con estado y efectos de React
function App() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Se ejecuta una vez al abrir la página: pide los pacientes al backend
  useEffect(() => {
    obtenerPacientes()
      .then(setPacientes)
      .catch(() =>
        setError('No se pudo conectar con el backend. Revisa que esté corriendo en el puerto 3000.')
      )
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>OdontoHistoria IA</h1>
        <p>Panel de gestión · Clínica Fassiara</p>
      </header>

      <main>
        <h2>Pacientes</h2>
        {cargando && <p className="aviso">Cargando pacientes...</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && !error && <PacientesTabla pacientes={pacientes} />}
      </main>
    </div>
  );
}

export default App;