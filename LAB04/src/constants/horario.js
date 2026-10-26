// horario.js — Días, bloques horarios fijos y generación de sesiones de clase
import { fechaISOLocal } from '../utils/fechas';

export const DIAS = [
  { id: 'lunes', etiqueta: 'Lunes', corto: 'Lun' },
  { id: 'martes', etiqueta: 'Martes', corto: 'Mar' },
  { id: 'miercoles', etiqueta: 'Miércoles', corto: 'Mié' },
  { id: 'jueves', etiqueta: 'Jueves', corto: 'Jue' },
  { id: 'viernes', etiqueta: 'Viernes', corto: 'Vie' },
];

// Los 16 bloques horarios fijos (7:00 a 21:00)
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

// getDay() de JS: 0 = domingo ... 6 = sábado (sin clases los fines de semana)
const ID_DIA_SEMANA = ['', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', ''];

// Texto legible del horario de un curso: "Lun 07:00-07:50 (Lab) · ..."
export function resumenHorario(curso) {
  const bloques = curso.bloques || [];
  if (bloques.length === 0) return 'Sin horario asignado';
  const orden = DIAS.map((d) => d.id);
  return [...bloques]
    .sort((a, b) => orden.indexOf(a.dia) - orden.indexOf(b.dia) || a.bloqueId - b.bloqueId)
    .map((b) => {
      const dia = DIAS.find((d) => d.id === b.dia);
      const bloque = BLOQUES.find((x) => x.id === b.bloqueId);
      return `${dia.corto} ${bloque.inicio}-${bloque.fin} (${b.tipo === 'laboratorio' ? 'Lab' : 'Teoría'})`;
    })
    .join(' · ');
}

// Genera las sesiones de clase de los próximos `dias` días a partir del horario
// semanal de los cursos, marcando si fueron confirmadas o quedaron vencidas.
export function generarSesiones(cursos, asistencias, dias = 7) {
  const sesiones = [];
  const ahora = new Date();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = 0; i < dias; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + i);
    const idDia = ID_DIA_SEMANA[fecha.getDay()];
    if (!idDia) continue;
    const fechaISO = fechaISOLocal(fecha);

    cursos.forEach((curso) => {
      (curso.bloques || []).forEach((asignacion) => {
        if (asignacion.dia !== idDia) return;
        const bloque = BLOQUES.find((b) => b.id === asignacion.bloqueId);
        const clave = `${fechaISO}_${curso.id}_${asignacion.bloqueId}`;
        const [h, m] = bloque.fin.split(':').map(Number);
        const fin = new Date(fecha);
        fin.setHours(h, m, 0, 0);
        const confirmada = asistencias.includes(clave);
        sesiones.push({
          kind: 'sesion',
          clave,
          curso,
          tipo: asignacion.tipo,
          fecha: fechaISO,
          bloque,
          confirmada,
          vencida: !confirmada && fin < ahora,
        });
      });
    });
  }
  return sesiones.sort((a, b) => (a.fecha + a.bloque.inicio).localeCompare(b.fecha + b.bloque.inicio));
}
