// storage.js — Manejo de persistencia en localStorage y datos semilla (seed data)

import { fechaISOLocal } from './utils.js';

const CLAVE_CURSOS = 'uplan_cursos';
const CLAVE_TAREAS = 'uplan_tareas';
const CLAVE_PERFIL = 'uplan_perfil';
const CLAVE_TEMA = 'uplan_tema';
const CLAVE_ASISTENCIAS = 'uplan_asistencias';

// Paleta de colores de acento disponible para los cursos
export const COLORES_CURSO = [
  '#4f46e5', // índigo
  '#0ea5e9', // celeste
  '#10b981', // verde esmeralda
  '#f59e0b', // ámbar
  '#ef4444', // rojo
  '#8b5cf6', // violeta
  '#ec4899', // rosa
  '#14b8a6', // turquesa
];

// Genera un identificador único simple basado en tiempo + azar
function generarId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sumarDias(fechaBaseISO, dias) {
  const [anio, mes, dia] = fechaBaseISO.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  fecha.setDate(fecha.getDate() + dias);
  return fechaISOLocal(fecha);
}

// Datos de ejemplo para que la app no se vea vacía en el primer uso.
// Los bloques de cada curso (dia + bloqueId + tipo) se usan en la vista
// "Horario" y hacen referencia a los índices definidos en horario.js.
function crearCursosSemilla() {
  return [
    {
      id: generarId(),
      nombre: 'Tópicos Avanzados en Ingeniería de Software',
      codigo: '17070',
      seccion: 'B',
      aula: 'A',
      creditos: 3,
      docente: 'Docente por asignar',
      color: COLORES_CURSO[4],
      bloques: [
        { dia: 'lunes', bloqueId: 0, tipo: 'laboratorio' },
        { dia: 'jueves', bloqueId: 5, tipo: 'teoria' },
      ],
    },
    {
      id: generarId(),
      nombre: 'Prácticas Pre Profesionales',
      codigo: '17071',
      seccion: 'B',
      aula: 'A',
      creditos: 3,
      docente: 'Docente por asignar',
      color: COLORES_CURSO[3],
      bloques: [
        { dia: 'lunes', bloqueId: 3, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 3, tipo: 'teoria' },
      ],
    },
    {
      id: generarId(),
      nombre: 'Proyecto de Ingeniería de Software 2',
      codigo: '17073',
      seccion: 'B',
      aula: 'A',
      creditos: 3,
      docente: 'Docente por asignar',
      color: COLORES_CURSO[7],
      bloques: [
        { dia: 'jueves', bloqueId: 6, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 0, tipo: 'laboratorio' },
        { dia: 'viernes', bloqueId: 4, tipo: 'teoria' },
      ],
    },
    {
      id: generarId(),
      nombre: 'Desarrollo de Software para Juegos (E)',
      codigo: '17075',
      seccion: 'B',
      aula: 'A',
      creditos: 3,
      docente: 'Docente por asignar',
      color: COLORES_CURSO[2],
      bloques: [
        { dia: 'miercoles', bloqueId: 3, tipo: 'teoria' },
        { dia: 'jueves', bloqueId: 1, tipo: 'laboratorio' },
      ],
    },
    {
      id: generarId(),
      nombre: 'Plataformas Emergentes (E)',
      codigo: '17076',
      seccion: 'B',
      aula: 'A',
      creditos: 3,
      docente: 'Norman Patrick Harvey Arce',
      color: COLORES_CURSO[5],
      bloques: [
        { dia: 'martes', bloqueId: 1, tipo: 'laboratorio' },
        { dia: 'jueves', bloqueId: 3, tipo: 'teoria' },
      ],
    },
    {
      id: generarId(),
      nombre: 'Trabajo de Investigación',
      codigo: '17079',
      seccion: 'B',
      aula: 'G',
      creditos: 4,
      docente: 'Docente por asignar',
      color: COLORES_CURSO[0],
      bloques: [
        { dia: 'jueves', bloqueId: 9, tipo: 'teoria' },
        { dia: 'jueves', bloqueId: 10, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 9, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 10, tipo: 'teoria' },
      ],
    },
  ];
}

function crearTareasSemilla(cursos) {
  const hoy = fechaISOLocal(new Date());
  return [
    { id: generarId(), cursoId: cursos[4].id, titulo: 'Informe de laboratorio 03 (U-Plan)', fechaEntrega: sumarDias(hoy, 1), prioridad: 'alta', completada: false },
    { id: generarId(), cursoId: cursos[4].id, titulo: 'Entrega de laboratorio: consumo de API', fechaEntrega: sumarDias(hoy, 2), prioridad: 'alta', completada: false },
    { id: generarId(), cursoId: cursos[2].id, titulo: 'Sprint review del proyecto', fechaEntrega: sumarDias(hoy, -1), prioridad: 'alta', completada: false },
    { id: generarId(), cursoId: cursos[3].id, titulo: 'Build jugable del prototipo', fechaEntrega: sumarDias(hoy, 4), prioridad: 'media', completada: false },
    { id: generarId(), cursoId: cursos[0].id, titulo: 'Exposición de arquitectura de microservicios', fechaEntrega: sumarDias(hoy, 5), prioridad: 'media', completada: false },
    { id: generarId(), cursoId: cursos[5].id, titulo: 'Entrega de marco teórico', fechaEntrega: sumarDias(hoy, 3), prioridad: 'alta', completada: false },
    { id: generarId(), cursoId: cursos[1].id, titulo: 'Informe mensual de prácticas', fechaEntrega: sumarDias(hoy, 10), prioridad: 'baja', completada: true },
  ];
}

function crearPerfilSemilla() {
  return {
    nombre: 'William',
    universidad: 'Universidad Nacional de San Agustín de Arequipa',
    carrera: 'Ingeniería de Sistemas',
    ciclo: '10mo ciclo',
    correo: '',
    integrantes: ['William Isaías Roque Quispe', 'Misael Josías Marrón Lope'],
  };
}

// --- Cursos ---

export function obtenerCursos() {
  const datos = localStorage.getItem(CLAVE_CURSOS);
  if (!datos) {
    const semilla = crearCursosSemilla();
    guardarCursos(semilla);
    // También sembramos tareas ligadas a estos cursos la primera vez
    if (!localStorage.getItem(CLAVE_TAREAS)) {
      guardarTareas(crearTareasSemilla(semilla));
    }
    return semilla;
  }
  return JSON.parse(datos);
}

export function guardarCursos(cursos) {
  localStorage.setItem(CLAVE_CURSOS, JSON.stringify(cursos));
}

export function agregarCurso(curso) {
  const cursos = obtenerCursos();
  cursos.push({ ...curso, id: generarId(), bloques: [] });
  guardarCursos(cursos);
}

export function actualizarCurso(id, cambios) {
  const cursos = obtenerCursos().map((c) => (c.id === id ? { ...c, ...cambios } : c));
  guardarCursos(cursos);
}

export function eliminarCurso(id) {
  const cursos = obtenerCursos().filter((c) => c.id !== id);
  guardarCursos(cursos);
  // Al eliminar un curso, también eliminamos sus tareas asociadas
  const tareas = obtenerTareas().filter((t) => t.cursoId !== id);
  guardarTareas(tareas);
}

// --- Bloques de horario (usados por la vista "Horario" dentro de Cursos) ---

// Busca si una celda (día + bloque) del horario ya tiene un curso asignado
export function obtenerAsignacionBloque(dia, bloqueId) {
  const cursos = obtenerCursos();
  for (const curso of cursos) {
    const bloque = (curso.bloques || []).find((b) => b.dia === dia && b.bloqueId === bloqueId);
    if (bloque) return { curso, tipo: bloque.tipo };
  }
  return null;
}

// Asigna un curso a una celda del horario, liberándola primero de cualquier
// otro curso que la ocupara (una celda solo puede tener un curso a la vez)
export function asignarBloque(cursoId, dia, bloqueId, tipo) {
  const cursos = obtenerCursos().map((curso) => {
    const bloquesLimpios = (curso.bloques || []).filter((b) => !(b.dia === dia && b.bloqueId === bloqueId));
    if (curso.id === cursoId) bloquesLimpios.push({ dia, bloqueId, tipo });
    return { ...curso, bloques: bloquesLimpios };
  });
  guardarCursos(cursos);
}

export function quitarBloque(dia, bloqueId) {
  const cursos = obtenerCursos().map((curso) => ({
    ...curso,
    bloques: (curso.bloques || []).filter((b) => !(b.dia === dia && b.bloqueId === bloqueId)),
  }));
  guardarCursos(cursos);
}

// --- Tareas ---

export function obtenerTareas() {
  const datos = localStorage.getItem(CLAVE_TAREAS);
  if (!datos) {
    const cursos = obtenerCursos();
    const semilla = crearTareasSemilla(cursos);
    guardarTareas(semilla);
    return semilla;
  }
  return JSON.parse(datos);
}

export function guardarTareas(tareas) {
  localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
}

export function agregarTarea(tarea) {
  const tareas = obtenerTareas();
  tareas.push({ ...tarea, id: generarId(), completada: false });
  guardarTareas(tareas);
}

export function actualizarTarea(id, cambios) {
  const tareas = obtenerTareas().map((t) => (t.id === id ? { ...t, ...cambios } : t));
  guardarTareas(tareas);
}

export function eliminarTarea(id) {
  const tareas = obtenerTareas().filter((t) => t.id !== id);
  guardarTareas(tareas);
}

export function alternarCompletada(id) {
  const tareas = obtenerTareas().map((t) =>
    t.id === id ? { ...t, completada: !t.completada } : t
  );
  guardarTareas(tareas);
}

// --- Perfil ---

export function obtenerPerfil() {
  const datos = localStorage.getItem(CLAVE_PERFIL);
  if (!datos) {
    const semilla = crearPerfilSemilla();
    guardarPerfil(semilla);
    return semilla;
  }
  return JSON.parse(datos);
}

export function guardarPerfil(perfil) {
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
}

// --- Tema (modo oscuro) ---

export function obtenerTema() {
  return localStorage.getItem(CLAVE_TEMA) || 'auto';
}

export function guardarTema(tema) {
  localStorage.setItem(CLAVE_TEMA, tema);
}

// --- Asistencia a clases (usada en la Agenda a partir del horario semanal) ---

// Se guarda solo la lista de claves confirmadas: `${fecha}_${cursoId}_${bloqueId}`
export function obtenerAsistencias() {
  const datos = localStorage.getItem(CLAVE_ASISTENCIAS);
  return datos ? JSON.parse(datos) : [];
}

export function confirmarAsistencia(clave) {
  const asistencias = obtenerAsistencias();
  if (!asistencias.includes(clave)) {
    asistencias.push(clave);
    localStorage.setItem(CLAVE_ASISTENCIAS, JSON.stringify(asistencias));
  }
}

// --- Reinicio completo de datos (RF5) ---

export function reiniciarDatos() {
  localStorage.removeItem(CLAVE_CURSOS);
  localStorage.removeItem(CLAVE_TAREAS);
  localStorage.removeItem(CLAVE_PERFIL);
  localStorage.removeItem(CLAVE_ASISTENCIAS);
  // El tema de color no se reinicia porque es una preferencia de interfaz, no un dato académico
}
