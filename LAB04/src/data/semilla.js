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
      ...base, id: generarId(), nombre: 'Tópicos Avanzados en Ingeniería de Software', codigo: '17070',
      creditos: 3, color: COLORES_CURSO[4],
      bloques: [
        { dia: 'lunes', bloqueId: 0, tipo: 'laboratorio' },
        { dia: 'jueves', bloqueId: 5, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Prácticas Pre Profesionales', codigo: '17071',
      creditos: 3, color: COLORES_CURSO[3],
      bloques: [
        { dia: 'lunes', bloqueId: 3, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 3, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Proyecto de Ingeniería de Software 2', codigo: '17073',
      creditos: 3, color: COLORES_CURSO[7],
      bloques: [
        { dia: 'jueves', bloqueId: 6, tipo: 'teoria' },
        { dia: 'viernes', bloqueId: 0, tipo: 'laboratorio' },
        { dia: 'viernes', bloqueId: 4, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Desarrollo de Software para Juegos (E)', codigo: '17075',
      creditos: 3, color: COLORES_CURSO[2],
      bloques: [
        { dia: 'miercoles', bloqueId: 3, tipo: 'teoria' },
        { dia: 'jueves', bloqueId: 1, tipo: 'laboratorio' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Plataformas Emergentes (E)', codigo: '17076',
      creditos: 3, color: COLORES_CURSO[5], docente: 'Norman Patrick Harvey Arce',
      bloques: [
        { dia: 'martes', bloqueId: 1, tipo: 'laboratorio' },
        { dia: 'jueves', bloqueId: 3, tipo: 'teoria' },
      ],
    },
    {
      ...base, id: generarId(), nombre: 'Trabajo de Investigación', codigo: '17079', aula: 'G',
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
    t(4, 'Informe de laboratorio 04 (U-Plan móvil)', 1, 'alta'),
    t(4, 'Entrega de laboratorio: consumo de API', 2, 'alta'),
    t(2, 'Sprint review del proyecto', -1, 'alta'),
    t(3, 'Build jugable del prototipo', 4, 'media'),
    t(0, 'Exposición de arquitectura de microservicios', 5, 'media'),
    t(5, 'Entrega de marco teórico', 3, 'alta'),
    t(1, 'Informe mensual de prácticas', 10, 'baja', true),
  ];
}

export function crearDatosIniciales() {
  const cursos = crearCursos();
  return {
    cursos,
    tareas: crearTareas(cursos),
    asistencias: [],
    perfil: {
      nombre: 'William',
      universidad: 'Universidad Nacional de San Agustín de Arequipa',
      carrera: 'Ingeniería de Sistemas',
      ciclo: '10mo ciclo',
      correo: '',
      integrantes: ['William Isaias Roque Quispe', 'Misael Josías Marrón Lope'],
    },
  };
}
