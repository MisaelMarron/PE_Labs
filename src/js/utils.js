// utils.js — Funciones auxiliares compartidas entre las vistas

// Convierte 'YYYY-MM-DD' a un objeto Date en hora local (evita el corrimiento de UTC)
export function aFechaLocal(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

// Formatea una fecha a 'YYYY-MM-DD' usando componentes LOCALES. Nunca usar
// toISOString() para esto: convierte a UTC y puede desfasar el día según
// la zona horaria del usuario.
export function fechaISOLocal(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// Formatea una fecha ISO a un formato legible en español, ej: "12 sep 2026"
export function formatearFecha(fechaISO) {
  const fecha = aFechaLocal(fechaISO);
  return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Devuelve cuántos días faltan (positivo) o han pasado (negativo) hasta la fecha dada
export function diasRestantes(fechaISO) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = aFechaLocal(fechaISO);
  objetivo.setHours(0, 0, 0, 0);
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((objetivo - hoy) / msPorDia);
}

// Texto amigable para mostrar la cercanía de una fecha de entrega
export function textoFechaRelativa(fechaISO) {
  const dias = diasRestantes(fechaISO);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  if (dias === -1) return 'Ayer';
  if (dias > 1) return `En ${dias} días`;
  return `Vencida hace ${Math.abs(dias)} días`;
}

// Etiqueta y color visual asociados a cada nivel de prioridad
export function infoPrioridad(prioridad) {
  const mapa = {
    alta: { etiqueta: 'Alta', clase: 'prioridad-alta' },
    media: { etiqueta: 'Media', clase: 'prioridad-media' },
    baja: { etiqueta: 'Baja', clase: 'prioridad-baja' },
  };
  return mapa[prioridad] || mapa.media;
}

// Convierte un color hexadecimal ('#4f46e5') a rgba(...) con la opacidad dada
export function hexARgba(hex, alpha = 1) {
  const limpio = hex.replace('#', '');
  const bigint = parseInt(limpio, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Escapa texto que vendrá de inputs del usuario antes de insertarlo como HTML
export function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

// Crea un elemento con atributos y contenido de forma abreviada
export function crearElemento(etiqueta, atributos = {}, hijos = []) {
  const el = document.createElement(etiqueta);
  Object.entries(atributos).forEach(([clave, valor]) => {
    if (clave === 'class') el.className = valor;
    else if (clave === 'texto') el.textContent = valor;
    else if (clave.startsWith('on') && typeof valor === 'function') {
      el.addEventListener(clave.slice(2).toLowerCase(), valor);
    } else {
      el.setAttribute(clave, valor);
    }
  });
  (Array.isArray(hijos) ? hijos : [hijos]).forEach((hijo) => {
    if (hijo) el.appendChild(hijo);
  });
  return el;
}
