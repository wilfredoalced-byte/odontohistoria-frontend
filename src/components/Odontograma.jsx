import { useEffect, useRef, useState } from 'react';
import { obtenerOdontograma, marcarPieza, quitarPieza } from '../api';

// Numeración FDI de adultos: cuadrantes superiores (18→11, 21→28) e inferiores (48→41, 31→38)
const SUPERIOR = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const INFERIOR = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// Al hacer clic en una pieza avanza: Sano → Caries → Tratado → Sano
const SIGUIENTE = { Sano: 'Caries', Caries: 'Tratado', Tratado: 'Sano' };

function Odontograma({ pacienteId }) {
  const [estados, setEstados] = useState({}); // { 26: 'Caries', ... }
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const ultimo = useRef({}); // estado más reciente, para que dos clics rápidos no se pisen

  useEffect(() => {
    let vigente = true;
    obtenerOdontograma(pacienteId)
      .then((piezas) => {
        if (!vigente) return;
        const mapa = {};
        piezas.forEach((p) => (mapa[p.pieza] = p.estado));
        ultimo.current = mapa;
        setEstados(mapa);
      })
      .catch((e) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [pacienteId]);

  // Se actualiza la pantalla de inmediato; si el backend falla, se devuelve la pieza a como estaba
  async function cambiar(pieza) {
    const anterior = ultimo.current[pieza] || 'Sano';
    const nuevo = SIGUIENTE[anterior];
    aplicar(pieza, nuevo);
    try {
      if (nuevo === 'Sano') await quitarPieza(pacienteId, pieza);
      else await marcarPieza(pacienteId, pieza, nuevo);
      setError('');
    } catch (e) {
      aplicar(pieza, anterior);
      setError(e.message);
    }
  }

  function aplicar(pieza, estado) {
    const copia = { ...ultimo.current };
    if (estado === 'Sano') delete copia[pieza];
    else copia[pieza] = estado;
    ultimo.current = copia;
    setEstados(copia);
  }

  function fila(piezas) {
    return (
      <div className="odo-fila">
        {piezas.map((n) => {
          const estado = estados[n] || 'Sano';
          return (
            <button
              key={n}
              type="button"
              className={`diente diente-${estado.toLowerCase()}`}
              onClick={() => cambiar(n)}
              title={`Pieza ${n}: ${estado}. Clic para cambiar.`}
              aria-label={`Pieza ${n}, ${estado}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    );
  }

  if (cargando) return <p className="aviso">Cargando odontograma...</p>;

  const resumen = Object.values(estados).reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <div className="odontograma">
        {fila(SUPERIOR)}
        <div className="odo-separador" />
        {fila(INFERIOR)}
      </div>
      <div className="leyenda">
        <span><i className="muestra diente-sano" /> Sano</span>
        <span><i className="muestra diente-caries" /> Caries ({resumen.Caries || 0})</span>
        <span><i className="muestra diente-tratado" /> Tratado ({resumen.Tratado || 0})</span>
        <span className="pista">Clic en una pieza para cambiar su estado</span>
      </div>
    </div>
  );
}

export default Odontograma;
