import { useEffect, useState } from 'react';
import { obtenerTextosConsentimiento, obtenerConsentimientos, guardarConsentimiento } from '../api';

function formatearFecha(iso) {
  return iso ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : '';
}

function Consentimientos({ pacienteId }) {
  const [textos, setTextos] = useState(null);
  const [estados, setEstados] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    Promise.all([obtenerTextosConsentimiento(), obtenerConsentimientos(pacienteId)])
      .then(([t, e]) => {
        if (!vigente) return;
        setTextos(t);
        setEstados(e);
      })
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [pacienteId]);

  async function cambiar(tipo, aceptado) {
    try {
      const registro = await guardarConsentimiento(pacienteId, tipo, aceptado);
      setEstados(estados.map((e) => (e.tipo === tipo ? registro : e)));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  if (error && !textos) return <p className="error">{error}</p>;
  if (!textos) return <p className="aviso">Cargando consentimientos...</p>;

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {estados.map((c) => (
        <div key={c.tipo} className="consentimiento">
          <h4>{textos.tipos[c.tipo].titulo}</h4>
          <p>{textos.tipos[c.tipo].texto}</p>
          <label className="check">
            <input type="checkbox" checked={c.aceptado} onChange={(e) => cambiar(c.tipo, e.target.checked)} />
            El paciente da su consentimiento
          </label>
          <small>
            {c.fecha
              ? `${c.aceptado ? 'Aceptado' : 'Retirado'} el ${formatearFecha(c.fecha)} (texto ${c.version})`
              : 'Aún sin responder'}
          </small>
        </div>
      ))}
      <p className="pista">Los textos son un borrador y deben ser revisados por un abogado antes de usarse con pacientes reales.</p>
    </div>
  );
}

export default Consentimientos;
