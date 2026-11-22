import { useEffect, useState } from 'react';
import {
  obtenerTratamientos,
  crearTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
} from '../api';

const ESTADOS = ['Pendiente', 'En curso', 'Realizado'];

function Tratamientos({ pacienteId }) {
  const [lista, setLista] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    obtenerTratamientos(pacienteId)
      .then((t) => vigente && setLista(t))
      .catch((e) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [pacienteId]);

  async function agregar(evento) {
    evento.preventDefault();
    if (!nombre.trim()) {
      setError('Escribe el nombre del tratamiento');
      return;
    }
    try {
      const nuevo = await crearTratamiento({ pacienteId, nombre: nombre.trim(), fecha });
      setLista([...lista, nuevo]);
      setNombre('');
      setFecha('');
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  async function cambiarEstado(t, estado) {
    try {
      const actualizado = await actualizarTratamiento(t.id, { estado });
      setLista(lista.map((x) => (x.id === t.id ? actualizado : x)));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  async function borrar(t) {
    if (!window.confirm(`¿Eliminar el tratamiento "${t.nombre}"?`)) return;
    try {
      await eliminarTratamiento(t.id);
      setLista(lista.filter((x) => x.id !== t.id));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {cargando ? (
        <p className="aviso">Cargando tratamientos...</p>
      ) : lista.length === 0 ? (
        <p className="vacio">Este paciente aún no tiene tratamientos.</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr><th>Tratamiento</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {lista.map((t) => (
              <tr key={t.id}>
                <td>{t.nombre}</td>
                <td>{t.fecha}</td>
                <td>
                  <select
                    className={`estado estado-${t.estado.replace(' ', '-').toLowerCase()}`}
                    value={t.estado}
                    onChange={(e) => cambiarEstado(t, e.target.value)}
                  >
                    {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </td>
                <td className="acciones">
                  <button className="btn btn-peligro" onClick={() => borrar(t)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form className="formulario formulario-linea" onSubmit={agregar}>
        <label>
          Nuevo tratamiento
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Limpieza dental" />
        </label>
        <label>
          Fecha
          <input value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder="Ej. 25 nov 2026" />
        </label>
        <button className="btn btn-principal" type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default Tratamientos;
