import { useState } from 'react';

const DATOS_VACIOS = { nombre: '', motivoConsulta: '', proximaCita: '' };

// OPERACIÓN 11: formulario controlado de React (el estado guarda lo que se escribe)
function PacienteForm({ pacienteEditando, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({
    nombre: pacienteEditando?.nombre ?? '',
    motivoConsulta: pacienteEditando?.motivoConsulta ?? '',
    proximaCita: pacienteEditando?.proximaCita ?? '',
  });
  const [errorForm, setErrorForm] = useState('');

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!datos.nombre.trim()) {
      setErrorForm('El nombre es obligatorio');
      return;
    }
    try {
      await onGuardar(datos);
      if (!pacienteEditando) setDatos(DATOS_VACIOS);
      setErrorForm('');
    } catch (error) {
      setErrorForm(error.message);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>{pacienteEditando ? 'Editar paciente' : 'Nuevo paciente'}</h3>

      <label>
        Nombre
        <input name="nombre" value={datos.nombre} onChange={cambiar} />
      </label>

      <label>
        Motivo de consulta
        <input name="motivoConsulta" value={datos.motivoConsulta} onChange={cambiar} />
      </label>

      <label>
        Próxima cita
        <input name="proximaCita" value={datos.proximaCita} onChange={cambiar} />
      </label>

      {errorForm && <p className="error">{errorForm}</p>}

      <div className="botones">
        <button type="submit" className="btn btn-principal">
          {pacienteEditando ? 'Guardar cambios' : 'Crear paciente'}
        </button>
        {pacienteEditando && (
          <button type="button" className="btn" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default PacienteForm;
