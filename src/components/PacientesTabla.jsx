// OPERACIÓN 11: componente de React que recibe datos por "props" y los dibuja
function PacientesTabla({ pacientes }) {
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
        </tr>
      </thead>
      <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td>{paciente.id}</td>
            <td>{paciente.nombre}</td>
            <td>{paciente.motivoConsulta}</td>
            <td>{paciente.proximaCita}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PacientesTabla;