// OPERACIÓN 11: el frontend, escrito en JavaScript, consume el backend con fetch
const API_URL = 'http://localhost:3000';
const CABECERAS = { 'Content-Type': 'application/json' };

async function manejarRespuesta(respuesta) {
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new Error(cuerpo.error || `Error ${respuesta.status}`);
  }
  return respuesta.json();
}

// READ
export function obtenerPacientes() {
  return fetch(`${API_URL}/pacientes`).then(manejarRespuesta);
}

// CREATE
export function crearPaciente(paciente) {
  return fetch(`${API_URL}/pacientes`, {
    method: 'POST',
    headers: CABECERAS,
    body: JSON.stringify(paciente),
  }).then(manejarRespuesta);
}

// UPDATE
export function actualizarPaciente(id, paciente) {
  return fetch(`${API_URL}/pacientes/${id}`, {
    method: 'PUT',
    headers: CABECERAS,
    body: JSON.stringify(paciente),
  }).then(manejarRespuesta);
}

// DELETE
export function eliminarPaciente(id) {
  return fetch(`${API_URL}/pacientes/${id}`, {
    method: 'DELETE',
  }).then(manejarRespuesta);
}
