// horario.js — Constantes del horario semanal (días y bloques) y generación
// de las sesiones de clase próximas, usadas para el control de asistencia.

import { obtenerCursos, obtenerAsistencias } from './storage.js';
import { fechaISOLocal } from './utils.js';

export const DIAS = [
  { id: 'lunes', etiqueta: 'Lunes' },
  { id: 'martes', etiqueta: 'Martes' },
  { id: 'miercoles', etiqueta: 'Miércoles' },
  { id: 'jueves', etiqueta: 'Jueves' },
  { id: 'viernes', etiqueta: 'Viernes' },
];

// Los 16 bloques horarios fijos de la institución (7:00 a 21:00)
export const BLOQUES = [
  { id: 0, inicio: '07:00', fin: '07:50' },
  { id: 1, inicio: '07:50', fin: '08:40' },
  { id: 2, inicio: '08:50', fin: '09:40' },
  { id: 3, inicio: '09:40', fin: '10:30' },
  { id: 4, inicio: '10:40', fin: '11:30' },
  { id: 5, inicio: '11:30', fin: '12:20' },
  { id: 6, inicio: '12:20', fin: '13:10' },
  { id: 7, inicio: '13:10', fin: '14:00' },
  { id: 8, inicio: '14:00', fin: '14:50' },
  { id: 9, inicio: '14:50', fin: '15:40' },
  { id: 10, inicio: '15:50', fin: '16:40' },
  { id: 11, inicio: '16:40', fin: '17:30' },
  { id: 12, inicio: '17:40', fin: '18:30' },
  { id: 13, inicio: '18:30', fin: '19:20' },
  { id: 14, inicio: '19:20', fin: '20:10' },
  { id: 15, inicio: '20:10', fin: '21:00' },
];

// getDay() de JS: 0=domingo..6=sábado. Los sábados y domingos no tienen clases.
const ID_DIA_SEMANA = ['', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', ''];

// Texto legible del horario semanal de un curso, ej: "Lun 07:00-07:50 (Lab) · Jue 11:30-12:20 (Teoría)"
export function resumenHorario(curso) {
  const bloques = curso.bloques || [];
  if (bloques.length === 0) return 'Sin horario asignado';
  const ordenDias = DIAS.map((d) => d.id);
  const ordenados = [...bloques].sort((a, b) => {
    const diff = ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia);
    return diff !== 0 ? diff : a.bloqueId - b.bloqueId;
  });
  return ordenados
    .map((b) => {
      const dia = DIAS.find((d) => d.id === b.dia);
      const bloque = BLOQUES.find((x) => x.id === b.bloqueId);
      if (!dia || !bloque) return null;
      const tipoTexto = b.tipo === 'laboratorio' ? 'Lab' : 'Teoría';
      return `${dia.etiqueta.slice(0, 3)} ${bloque.inicio}-${bloque.fin} (${tipoTexto})`;
    })
    .filter(Boolean)
    .join(' · ');
}

// Genera las sesiones de clase (a partir del horario semanal de todos los
// cursos) para los próximos `dias` días, incluyendo hoy, marcando si ya
// fueron confirmadas ("Asistiré") o si quedaron vencidas sin confirmar.
export function generarSesiones(dias = 7) {
  const cursos = obtenerCursos();
  const asistencias = obtenerAsistencias();
  const sesiones = [];
  const ahora = new Date();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = 0; i < dias; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + i);
    const idDia = ID_DIA_SEMANA[fecha.getDay()];
    if (!idDia) continue; // fin de semana: el horario no tiene clases
    const fechaISO = fechaISOLocal(fecha);

    cursos.forEach((curso) => {
      (curso.bloques || []).forEach((asignacion) => {
        if (asignacion.dia !== idDia) return;
        const bloque = BLOQUES.find((b) => b.id === asignacion.bloqueId);
        if (!bloque) return;

        const clave = `${fechaISO}_${curso.id}_${asignacion.bloqueId}`;
        const [horaFinH, horaFinM] = bloque.fin.split(':').map(Number);
        const finSesion = new Date(fecha);
        finSesion.setHours(horaFinH, horaFinM, 0, 0);
        const confirmada = asistencias.includes(clave);

        sesiones.push({
          clave,
          curso,
          tipo: asignacion.tipo,
          fecha: fechaISO,
          bloque,
          confirmada,
          vencida: !confirmada && finSesion < ahora,
        });
      });
    });
  }

  return sesiones.sort((a, b) => (a.fecha + a.bloque.inicio).localeCompare(b.fecha + b.bloque.inicio));
}
