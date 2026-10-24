// OPERACIÓN 11: el frontend, escrito en JavaScript, consume el backend con fetch
const API_URL = 'http://localhost:3000';

// READ: pide todos los pacientes al backend
export async function obtenerPacientes() {
  const respuesta = await fetch(`${API_URL}/pacientes`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  return respuesta.json();
}