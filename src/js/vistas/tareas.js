// tareas.js — Vista "Tareas": listado con filtros, checkbox de completado y CRUD (RF2)

import {
  obtenerTareas,
  obtenerCursos,
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  alternarCompletada,
} from '../storage.js';
import { escaparHTML, formatearFecha, textoFechaRelativa, diasRestantes, infoPrioridad, fechaISOLocal } from '../utils.js';
import { icono } from '../iconos.js';
import { abrirModal, cerrarModal } from '../modal.js';

// Filtro activo en memoria (se reinicia al recargar la app, es solo de interfaz)
let filtroActivo = 'todas';

function opcionesCursoSelect(cursos, cursoSeleccionadoId) {
  if (cursos.length === 0) {
    return '<option value="">Primero crea un curso</option>';
  }
  return cursos
    .map(
      (c) => `<option value="${c.id}" ${c.id === cursoSeleccionadoId ? 'selected' : ''}>${escaparHTML(c.nombre)}</option>`
    )
    .join('');
}

function plantillaFormulario(cursos, tarea = {}) {
  const { titulo = '', fechaEntrega = fechaISOLocal(), prioridad = 'media', cursoId = cursos[0]?.id } = tarea;
  return `
    <form class="formulario" data-form-tarea>
      <label class="campo">
        <span>Título de la tarea</span>
        <input type="text" name="titulo" required maxlength="80" value="${escaparHTML(titulo)}" placeholder="Ej. Informe de laboratorio" />
      </label>
      <label class="campo">
        <span>Curso</span>
        <select name="cursoId" required>${opcionesCursoSelect(cursos, cursoId)}</select>
      </label>
      <label class="campo">
        <span>Fecha de entrega</span>
        <input type="date" name="fechaEntrega" required value="${fechaEntrega}" />
      </label>
      <label class="campo">
        <span>Prioridad</span>
        <select name="prioridad">
          <option value="alta" ${prioridad === 'alta' ? 'selected' : ''}>Alta</option>
          <option value="media" ${prioridad === 'media' ? 'selected' : ''}>Media</option>
          <option value="baja" ${prioridad === 'baja' ? 'selected' : ''}>Baja</option>
        </select>
      </label>
      <div class="acciones-formulario">
        <button type="button" class="boton boton-fantasma" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton-primario" ${cursos.length === 0 ? 'disabled' : ''}>Guardar</button>
      </div>
    </form>
  `;
}

function filtrarTareas(tareas) {
  if (filtroActivo === 'pendientes') return tareas.filter((t) => !t.completada);
  if (filtroActivo === 'completadas') return tareas.filter((t) => t.completada);
  return tareas;
}

function ordenarPorFecha(tareas) {
  return [...tareas].sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega));
}

function filaTarea(tarea, curso) {
  const { etiqueta, clase } = infoPrioridad(tarea.prioridad);
  const dias = diasRestantes(tarea.fechaEntrega);
  const vencida = !tarea.completada && dias < 0;
  return `
    <li class="fila-tarea ${tarea.completada ? 'tarea-completada' : ''}" style="--color-curso:${curso?.color || '#999'}">
      <label class="casilla-tarea">
        <input type="checkbox" data-completar="${tarea.id}" ${tarea.completada ? 'checked' : ''} aria-label="Marcar como completada" />
        <span class="marca-check">${icono('check')}</span>
      </label>
      <div class="detalle-tarea">
        <p class="titulo-tarea">${escaparHTML(tarea.titulo)}</p>
        <div class="meta-tarea">
          <span class="chip-curso">${escaparHTML(curso?.nombre || 'Sin curso')}</span>
          <span class="fecha-tarea ${vencida ? 'texto-vencido' : ''}">${icono('reloj')} ${formatearFecha(tarea.fechaEntrega)} · ${textoFechaRelativa(tarea.fechaEntrega)}</span>
          <span class="etiqueta-prioridad ${clase}">${etiqueta}</span>
        </div>
      </div>
      <div class="acciones-tarjeta">
        <button type="button" class="boton-icono" data-editar-tarea="${tarea.id}" aria-label="Editar tarea">${icono('editar')}</button>
        <button type="button" class="boton-icono" data-eliminar-tarea="${tarea.id}" aria-label="Eliminar tarea">${icono('eliminar')}</button>
      </div>
    </li>
  `;
}

function estadoVacio(cursos) {
  const mensaje = filtroActivo === 'completadas'
    ? 'Todavía no completas ninguna tarea.'
    : filtroActivo === 'pendientes'
      ? '¡Genial! No tienes tareas pendientes.'
      : 'Aún no registras tareas.';
  return `
    <div class="estado-vacio">
      ${icono('vacio', 'icono-vacio')}
      <h3>${mensaje}</h3>
      ${cursos.length === 0
        ? '<p>Crea primero un curso desde la pestaña Cursos.</p>'
        : '<p>Agrega una tarea para hacerle seguimiento a tus entregas.</p>'}
    </div>
  `;
}

function manejarEnvioFormulario(formulario, idEdicion) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    const tarea = {
      titulo: datos.get('titulo').trim(),
      cursoId: datos.get('cursoId'),
      fechaEntrega: datos.get('fechaEntrega'),
      prioridad: datos.get('prioridad'),
    };
    if (idEdicion) {
      actualizarTarea(idEdicion, tarea);
    } else {
      agregarTarea(tarea);
    }
    cerrarModal();
    renderizarTareas(document.querySelector('#contenido-vista'));
  });
}

function abrirFormularioTarea(tareaExistente) {
  const cursos = obtenerCursos();
  const titulo = tareaExistente ? 'Editar tarea' : 'Nueva tarea';
  abrirModal(titulo, plantillaFormulario(cursos, tareaExistente || {}), (formulario) => {
    manejarEnvioFormulario(formulario, tareaExistente?.id);
  });
}

// Renderiza la vista completa de Tareas dentro del contenedor dado
export function renderizarTareas(contenedor) {
  const cursos = obtenerCursos();
  const cursosPorId = Object.fromEntries(cursos.map((c) => [c.id, c]));
  const tareas = ordenarPorFecha(filtrarTareas(obtenerTareas()));

  contenedor.innerHTML = `
    <div class="cabecera-vista">
      <h1>Mis tareas</h1>
      <button type="button" class="boton boton-primario" data-nueva-tarea>${icono('agregar')} Nueva tarea</button>
    </div>
    <div class="barra-filtros" role="tablist" aria-label="Filtrar tareas">
      <button type="button" class="boton-filtro ${filtroActivo === 'todas' ? 'activo' : ''}" data-filtro="todas">Todas</button>
      <button type="button" class="boton-filtro ${filtroActivo === 'pendientes' ? 'activo' : ''}" data-filtro="pendientes">Pendientes</button>
      <button type="button" class="boton-filtro ${filtroActivo === 'completadas' ? 'activo' : ''}" data-filtro="completadas">Completadas</button>
    </div>
    ${tareas.length === 0
      ? estadoVacio(cursos)
      : `<ul class="lista-tareas">${tareas.map((t) => filaTarea(t, cursosPorId[t.cursoId])).join('')}</ul>`}
  `;

  contenedor.querySelectorAll('[data-nueva-tarea]').forEach((boton) => {
    boton.addEventListener('click', () => abrirFormularioTarea());
  });

  contenedor.querySelectorAll('[data-filtro]').forEach((boton) => {
    boton.addEventListener('click', () => {
      filtroActivo = boton.dataset.filtro;
      renderizarTareas(contenedor);
    });
  });

  contenedor.querySelectorAll('[data-completar]').forEach((casilla) => {
    casilla.addEventListener('change', () => {
      alternarCompletada(casilla.dataset.completar);
      renderizarTareas(contenedor);
    });
  });

  contenedor.querySelectorAll('[data-editar-tarea]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const tarea = obtenerTareas().find((t) => t.id === boton.dataset.editarTarea);
      abrirFormularioTarea(tarea);
    });
  });

  contenedor.querySelectorAll('[data-eliminar-tarea]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const tarea = obtenerTareas().find((t) => t.id === boton.dataset.eliminarTarea);
      if (tarea && window.confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) {
        eliminarTarea(tarea.id);
        renderizarTareas(contenedor);
      }
    });
  });
}
