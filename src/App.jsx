import { useEffect, useState } from 'react';
import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from './api';
import PacientesTabla from './components/PacientesTabla';
import PacienteForm from './components/PacienteForm';
import './App.css';

// OPERACIÓN 11: componente principal del panel, con estado y efectos de React
function App() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [errorAccion, setErrorAccion] = useState('');
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Al abrir la página: pide los pacientes al backend
  useEffect(() => {
    obtenerPacientes()
      .then(setPacientes)
      .catch(() =>
        setError('No se pudo conectar con el backend. Revisa que esté corriendo en el puerto 3000.')
      )
      .finally(() => setCargando(false));
  }, []);

  // OPERACIÓN 11: dato derivado del estado, la lista filtrada por la búsqueda
  const pacientesFiltrados = pacientes.filter((p) =>
    (p.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  // CREATE o UPDATE, según haya un paciente en edición
  async function guardar(datos) {
    if (editando) {
      const actualizado = await actualizarPaciente(editando.id, datos);
      setPacientes(pacientes.map((p) => (p.id === actualizado.id ? actualizado : p)));
      setEditando(null);
    } else {
      const nuevo = await crearPaciente(datos);
      setPacientes([...pacientes, nuevo]);
    }
    setErrorAccion('');
  }

  // DELETE, con confirmación
  async function borrar(paciente) {
    if (!window.confirm(`¿Eliminar a ${paciente.nombre}?`)) return;
    try {
      await eliminarPaciente(paciente.id);
      setPacientes(pacientes.filter((p) => p.id !== paciente.id));
      if (editando && editando.id === paciente.id) setEditando(null);
      setErrorAccion('');
    } catch (e) {
      setErrorAccion(e.message);
    }
  }

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
        {errorAccion && <p className="error">{errorAccion}</p>}

        {!cargando && !error && (
          <>
            <div className="barra">
              <input
                className="buscador"
                type="search"
                placeholder="Buscar paciente por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="contador">
                Mostrando {pacientesFiltrados.length} de {pacientes.length} pacientes
              </span>
            </div>

            {busqueda && pacientesFiltrados.length === 0 ? (
              <p className="vacio">Ningún paciente coincide con la búsqueda.</p>
            ) : (
              <PacientesTabla
                pacientes={pacientesFiltrados}
                onEditar={setEditando}
                onEliminar={borrar}
              />
            )}

            <PacienteForm
              key={editando ? editando.id : 'nuevo'}
              pacienteEditando={editando}
              onGuardar={guardar}
              onCancelar={() => setEditando(null)}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
