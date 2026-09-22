// calendario.js — Vista "Agenda": asistencia a clases del horario semanal (RF3)
// + próximas entregas de tareas ordenadas por fecha (RF3)

import { obtenerTareas, obtenerCursos, confirmarAsistencia } from '../storage.js';
import { escaparHTML, formatearFecha, textoFechaRelativa, diasRestantes, infoPrioridad } from '../utils.js';
import { icono } from '../iconos.js';
import { generarSesiones } from '../horario.js';

const DIAS_VENTANA_CLASES = 7;

// --- Asistencia a clases (a partir del horario semanal) -------------------

function tarjetaSesion(sesion) {
  const tipoTexto = sesion.tipo === 'laboratorio' ? 'Laboratorio' : 'Teoría';
  return `
    <li class="entrega-agenda ${sesion.vencida ? 'entrega-vencida' : ''}" style="--color-curso:${sesion.curso.color}">
      <span class="punto-curso"></span>
      <div class="detalle-tarea">
        <p class="titulo-tarea">${escaparHTML(sesion.curso.nombre)}</p>
        <div class="meta-tarea">
          <span class="chip-curso">${tipoTexto}</span>
          <span class="fecha-tarea">${icono('reloj')} ${formatearFecha(sesion.fecha)} · ${sesion.bloque.inicio}-${sesion.bloque.fin}</span>
          ${sesion.vencida ? '<span class="etiqueta-prioridad prioridad-alta">Vencido</span>' : ''}
        </div>
      </div>
      <button type="button" class="boton boton-fantasma boton-compacto" data-confirmar-asistencia="${sesion.clave}">
        ${sesion.vencida ? 'Marcar asistencia' : 'Asistiré'}
      </button>
    </li>
  `;
}

function seccionAsistencia() {
  const sesiones = generarSesiones(DIAS_VENTANA_CLASES);
  if (sesiones.length === 0) return ''; // aún no se armó ningún horario

  const pendientes = sesiones.filter((s) => !s.confirmada);

  return `
    <section class="seccion-proximas">
      <h2>Asistencia a clases</h2>
      ${pendientes.length === 0
        ? '<p class="texto-sutil">Ya confirmaste tu asistencia a todas las clases de los próximos días.</p>'
        : `<ul class="lista-agenda">${pendientes.map(tarjetaSesion).join('')}</ul>`}
    </section>
  `;
}

function activarBotonesAsistencia(contenedor) {
  contenedor.querySelectorAll('[data-confirmar-asistencia]').forEach((boton) => {
    boton.addEventListener('click', () => {
      confirmarAsistencia(boton.dataset.confirmarAsistencia);
      renderizarCalendario(contenedor);
    });
  });
}

// --- Próximas entregas (tareas) --------------------------------------------

function agruparPorFecha(tareas) {
  const grupos = new Map();
  tareas.forEach((tarea) => {
    if (!grupos.has(tarea.fechaEntrega)) grupos.set(tarea.fechaEntrega, []);
    grupos.get(tarea.fechaEntrega).push(tarea);
  });
  return [...grupos.entries()].sort(([fechaA], [fechaB]) => fechaA.localeCompare(fechaB));
}

function etiquetaGrupoFecha(fechaISO) {
  const dias = diasRestantes(fechaISO);
  const base = formatearFecha(fechaISO);
  if (dias < 0) return `${base} · Vencida`;
  return `${base} · ${textoFechaRelativa(fechaISO)}`;
}

function tarjetaEntrega(tarea, curso) {
  const { etiqueta, clase } = infoPrioridad(tarea.prioridad);
  const vencida = diasRestantes(tarea.fechaEntrega) < 0;
  return `
    <li class="entrega-agenda ${vencida ? 'entrega-vencida' : ''}" style="--color-curso:${curso?.color || '#999'}">
      <span class="punto-curso"></span>
      <div class="detalle-tarea">
        <p class="titulo-tarea">${escaparHTML(tarea.titulo)}</p>
        <div class="meta-tarea">
          <span class="chip-curso">${escaparHTML(curso?.nombre || 'Sin curso')}</span>
          <span class="etiqueta-prioridad ${clase}">${etiqueta}</span>
        </div>
      </div>
    </li>
  `;
}

function seccionEntregas(cursosPorId) {
  const pendientes = obtenerTareas().filter((t) => !t.completada);

  if (pendientes.length === 0) {
    return `
      <section class="seccion-proximas">
        <h2>Próximas entregas</h2>
        <p class="texto-sutil">No hay entregas pendientes. ¡Vas al día!</p>
      </section>
    `;
  }

  const grupos = agruparPorFecha(pendientes);
  return `
    <section class="seccion-proximas">
      <h2>Próximas entregas</h2>
      <div class="lista-agenda">
        ${grupos
          .map(
            ([fecha, tareasDelDia]) => `
              <section class="grupo-agenda">
                <h3 class="fecha-grupo-agenda">${etiquetaGrupoFecha(fecha)}</h3>
                <ul class="entregas-del-dia">
                  ${tareasDelDia.map((t) => tarjetaEntrega(t, cursosPorId[t.cursoId])).join('')}
                </ul>
              </section>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

// --- Vista completa ---------------------------------------------------------

// Renderiza la vista completa de Agenda dentro del contenedor dado
export function renderizarCalendario(contenedor) {
  const cursos = obtenerCursos();
  const cursosPorId = Object.fromEntries(cursos.map((c) => [c.id, c]));

  contenedor.innerHTML = `
    <div class="cabecera-vista"><h1>Agenda</h1></div>
    ${seccionAsistencia()}
    ${seccionEntregas(cursosPorId)}
  `;

  activarBotonesAsistencia(contenedor);
}
