// OPERACIÓN 11: componente que recibe datos y funciones por "props"
function PacientesTabla({ pacientes, onEditar, onEliminar }) {
  if (pacientes.length === 0) {
    return <p className="vacio">No hay pacientes registrados.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Motivo de consulta</th>
          <th>Próxima cita</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td>{paciente.id}</td>
            <td>{paciente.nombre}</td>
            <td>{paciente.motivoConsulta}</td>
            <td>{paciente.proximaCita}</td>
            <td className="acciones">
              <button className="btn" onClick={() => onEditar(paciente)}>
                Editar
              </button>
              <button className="btn btn-peligro" onClick={() => onEliminar(paciente)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PacientesTabla;
