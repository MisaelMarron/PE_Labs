// semilla.js — Datos de ejemplo (seed data) para que la app no inicie vacía
import { COLORES_CURSO } from '../theme';
import { fechaISOLocal, sumarDias } from '../utils/fechas';

export function generarId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function crearCursos() {
  const base = { seccion: 'B', aula: 'A', docente: 'Docente por asignar' };
  return [
    {
      ...base, id: generarId(), nombre: 'Introducción a la Programación', codigo: 'EJ-101',
      creditos: 3, color: COLORES_CURSO[4],
      bloques: [
        { dia: 'lunes', bloqueId: 0, tipo: 'laboratorio' },
        { dia: 'jueves', bloqueId: 5, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Matemática Básica', codigo: 'EJ-102',
      creditos: 3, color: COLORES_CURSO[3],
      bloques: [
        { dia: 'lunes', bloqueId: 3, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 3, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Comunicación Académica', codigo: 'EJ-103',
      creditos: 3, color: COLORES_CURSO[7],
      bloques: [
        { dia: 'jueves', bloqueId: 6, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 0, tipo: 'laboratorio' },
        { dia: 'viernes', bloqueId: 4, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Introducción a la Ingeniería', codigo: 'EJ-104',
      creditos: 3, color: COLORES_CURSO[2],
      bloques: [
        { dia: 'miercoles', bloqueId: 3, tipo: 'teoria' },
        { dia: 'jueves', bloqueId: 1, tipo: 'laboratorio' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Técnicas de Estudio', codigo: 'EJ-105',
      creditos: 3, color: COLORES_CURSO[5], docente: 'Norman Patrick Harvey Arce',
      bloques: [
        { dia: 'martes', bloqueId: 1, tipo: 'laboratorio' },
        { dia: 'jueves', bloqueId: 3, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Pensamiento Crítico', codigo: 'EJ-106', aula: 'G',
      creditos: 4, color: COLORES_CURSO[0],
      bloques: [
        { dia: 'jueves', bloqueId: 9, tipo: 'teoria' },
        { dia: 'jueves', bloqueId: 10, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 9, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 10, tipo: 'teoria' },
      ],
    },
  ];
}

function crearTareas(cursos) {
  const hoy = fechaISOLocal();
  const t = (cursoIdx, titulo, dias, prioridad, completada = false) => ({
    id: generarId(), cursoId: cursos[cursoIdx].id, titulo,
    fechaEntrega: sumarDias(hoy, dias), prioridad, completada,
  });
  return [
    t(0, 'Primer ejercicio de programación', 1, 'alta'),
    t(1, 'Práctica de ecuaciones', 2, 'alta'),
    t(2, 'Borrador de presentación', -1, 'alta'),
    t(3, 'Lectura de introducción', 4, 'media'),
    t(4, 'Organizar apuntes de la semana', 5, 'media'),
    t(5, 'Mapa de ideas', 3, 'alta'),
    t(1, 'Repaso inicial', 10, 'baja', true),
  ];
}

export function crearDatosIniciales() {
  const cursos = crearCursos();
  return {
    cursos,
    tareas: crearTareas(cursos),
    asistencias: [],
    perfil: {
      nombre: 'Estudiante',
      universidad: 'Universidad Nacional de San Agustín de Arequipa',
      carrera: 'Ingeniería de Sistemas',
      ciclo: 'Primer ciclo',
      correo: '',
      integrantes: ['William Isaias Roque Quispe', 'Misael Josías Marrón Lope'],
    },
  };
}
