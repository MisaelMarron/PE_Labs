// fechas.js — Utilidades de fechas en formato 'AAAA-MM-DD' usando siempre hora LOCAL

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function aFechaLocal(iso) {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function fechaISOLocal(fecha = new Date()) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function sumarDias(iso, dias) {
  const fecha = aFechaLocal(iso);
  fecha.setDate(fecha.getDate() + dias);
  return fechaISOLocal(fecha);
}

export function formatearFecha(iso) {
  const f = aFechaLocal(iso);
  return `${String(f.getDate()).padStart(2, '0')} ${MESES[f.getMonth()]} ${f.getFullYear()}`;
}

export function diasRestantes(iso) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((aFechaLocal(iso) - hoy) / 86400000);
}

export function textoFechaRelativa(iso) {
  const d = diasRestantes(iso);
  if (d === 0) return 'Hoy';
  if (d === 1) return 'Mañana';
  if (d === -1) return 'Ayer';
  if (d > 1) return `En ${d} días`;
  return `Vencida hace ${Math.abs(d)} días`;
}

// Valida que el texto sea una fecha real con formato AAAA-MM-DD
export function esFechaValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  return fechaISOLocal(aFechaLocal(texto)) === texto;
}

// Etiqueta y tono de color asociados a cada prioridad
export function infoPrioridad(prioridad) {
  const mapa = {
    alta: { etiqueta: 'Alta', tono: 'peligro' },
    media: { etiqueta: 'Media', tono: 'adv' },
    baja: { etiqueta: 'Baja', tono: 'exito' },
  };
  return mapa[prioridad] || mapa.media;
}
