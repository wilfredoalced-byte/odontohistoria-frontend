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

// ---------- Ficha del paciente: odontograma, tratamientos y consentimientos ----------
export function obtenerOdontograma(pacienteId) {
  return fetch(`${API_URL}/pacientes/${pacienteId}/odontograma`).then(manejarRespuesta);
}

export function marcarPieza(pacienteId, pieza, estado) {
  return fetch(`${API_URL}/pacientes/${pacienteId}/odontograma/${pieza}`, {
    method: 'PUT',
    headers: CABECERAS,
    body: JSON.stringify({ estado }),
  }).then(manejarRespuesta);
}

export function quitarPieza(pacienteId, pieza) {
  return fetch(`${API_URL}/pacientes/${pacienteId}/odontograma/${pieza}`, {
    method: 'DELETE',
  }).then(manejarRespuesta);
}

export function obtenerTratamientos(pacienteId) {
  return fetch(`${API_URL}/tratamientos?pacienteId=${pacienteId}`).then(manejarRespuesta);
}

export function crearTratamiento(tratamiento) {
  return fetch(`${API_URL}/tratamientos`, {
    method: 'POST',
    headers: CABECERAS,
    body: JSON.stringify(tratamiento),
  }).then(manejarRespuesta);
}

export function actualizarTratamiento(id, cambios) {
  return fetch(`${API_URL}/tratamientos/${id}`, {
    method: 'PUT',
    headers: CABECERAS,
    body: JSON.stringify(cambios),
  }).then(manejarRespuesta);
}

export function eliminarTratamiento(id) {
  return fetch(`${API_URL}/tratamientos/${id}`, { method: 'DELETE' }).then(manejarRespuesta);
}

export function obtenerTextosConsentimiento() {
  return fetch(`${API_URL}/consentimientos/textos`).then(manejarRespuesta);
}

export function obtenerConsentimientos(pacienteId) {
  return fetch(`${API_URL}/pacientes/${pacienteId}/consentimientos`).then(manejarRespuesta);
}

export function guardarConsentimiento(pacienteId, tipo, aceptado) {
  return fetch(`${API_URL}/pacientes/${pacienteId}/consentimientos/${tipo}`, {
    method: 'PUT',
    headers: CABECERAS,
    body: JSON.stringify({ aceptado }),
  }).then(manejarRespuesta);
}
