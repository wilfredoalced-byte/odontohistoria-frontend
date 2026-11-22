import { useState } from 'react';
import Odontograma from './Odontograma';
import Tratamientos from './Tratamientos';
import Consentimientos from './Consentimientos';
import AnalisisIA from './AnalisisIA';

const PESTANAS = ['Odontograma', 'Tratamientos', 'Consentimientos', 'IA (apoyo)'];

function FichaPaciente({ paciente, onCerrar }) {
  const [pestana, setPestana] = useState('Odontograma');

  return (
    <section className="ficha">
      <div className="ficha-cabecera">
        <div>
          <h3>{paciente.nombre}</h3>
          <p>{paciente.motivoConsulta}</p>
        </div>
        <button className="btn" onClick={onCerrar}>Cerrar ficha</button>
      </div>

      <div className="pestanas" role="tablist">
        {PESTANAS.map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={pestana === p}
            className={pestana === p ? 'pestana activa' : 'pestana'}
            onClick={() => setPestana(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {pestana === 'Odontograma' && <Odontograma key={paciente.id} pacienteId={paciente.id} />}
      {pestana === 'Tratamientos' && <Tratamientos key={paciente.id} pacienteId={paciente.id} />}
      {pestana === 'Consentimientos' && <Consentimientos key={paciente.id} pacienteId={paciente.id} />}
      {pestana === 'IA (apoyo)' && <AnalisisIA key={paciente.id} />}
    </section>
  );
}

export default FichaPaciente;
