// cursos.js — Vista "Cursos": listado en tarjetas + alta, edición y baja (RF1),
// más una pestaña "Horario" para armar el horario semanal por bloques.

import {
  obtenerCursos,
  agregarCurso,
  actualizarCurso,
  eliminarCurso,
  obtenerTareas,
  obtenerAsignacionBloque,
  asignarBloque,
  quitarBloque,
  COLORES_CURSO,
} from '../storage.js';
import { escaparHTML, hexARgba } from '../utils.js';
import { icono } from '../iconos.js';
import { abrirModal, cerrarModal } from '../modal.js';
import { DIAS, BLOQUES, resumenHorario } from '../horario.js';

// Sub-pestaña activa dentro de la vista Cursos: 'tarjetas' o 'horario'
let subVista = 'tarjetas';

// --- Formulario de curso (alta / edición) ---------------------------------

function opcionesColor(colorSeleccionado) {
  return COLORES_CURSO.map((color) => `
    <label class="opcion-color">
      <input type="radio" name="color" value="${color}" ${color === colorSeleccionado ? 'checked' : ''} />
      <span class="pastilla-color" style="background:${color}"></span>
    </label>
  `).join('');
}

function plantillaFormulario(curso = {}) {
  const { nombre = '', docente = '', color = COLORES_CURSO[0] } = curso;
  return `
    <form class="formulario" data-form-curso>
      <label class="campo">
        <span>Nombre del curso</span>
        <input type="text" name="nombre" required maxlength="60" value="${escaparHTML(nombre)}" placeholder="Ej. Cálculo III" />
      </label>
      <label class="campo">
        <span>Docente</span>
        <input type="text" name="docente" required maxlength="60" value="${escaparHTML(docente)}" placeholder="Ej. Ing. Juan Pérez" />
      </label>
      <fieldset class="campo">
        <legend>Color distintivo</legend>
        <div class="selector-colores">${opcionesColor(color)}</div>
      </fieldset>
      <p class="texto-sutil">El horario se asigna después, desde la pestaña <strong>Horario</strong>.</p>
      <div class="acciones-formulario">
        <button type="button" class="boton boton-fantasma" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton-primario">Guardar</button>
      </div>
    </form>
  `;
}

function contarTareasDeCurso(cursoId) {
  const tareas = obtenerTareas().filter((t) => t.cursoId === cursoId);
  const pendientes = tareas.filter((t) => !t.completada).length;
  return { total: tareas.length, pendientes };
}

function tarjetaCurso(curso) {
  const { total, pendientes } = contarTareasDeCurso(curso.id);
  return `
    <article class="tarjeta-curso" style="--color-curso:${curso.color}">
      <div class="franja-color"></div>
      <div class="contenido-tarjeta">
        <div class="fila-titulo-tarjeta">
          <h3>${escaparHTML(curso.nombre)}</h3>
          <div class="acciones-tarjeta">
            <button type="button" class="boton-icono" data-editar="${curso.id}" aria-label="Editar curso">${icono('editar')}</button>
            <button type="button" class="boton-icono" data-eliminar="${curso.id}" aria-label="Eliminar curso">${icono('eliminar')}</button>
          </div>
        </div>
        <p class="docente-curso">${escaparHTML(curso.docente)}</p>
        ${curso.codigo ? `<p class="codigo-curso">Código ${escaparHTML(curso.codigo)}${curso.creditos ? ` · ${curso.creditos} créditos` : ''}</p>` : ''}
        <p class="horario-curso">${escaparHTML(resumenHorario(curso))}</p>
        <div class="pie-tarjeta-curso">
          <span class="chip">${total} tarea${total === 1 ? '' : 's'}</span>
          <span class="chip ${pendientes > 0 ? 'chip-pendiente' : 'chip-ok'}">${pendientes} pendiente${pendientes === 1 ? '' : 's'}</span>
        </div>
      </div>
    </article>
  `;
}

function estadoVacio() {
  return `
    <div class="estado-vacio">
      ${icono('vacio', 'icono-vacio')}
      <h3>Aún no tienes cursos</h3>
      <p>Agrega tu primer curso para empezar a organizar tus tareas.</p>
      <button type="button" class="boton boton-primario" data-nuevo-curso>${icono('agregar')} Agregar curso</button>
    </div>
  `;
}

function manejarEnvioFormulario(formulario, idEdicion) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    const curso = {
      nombre: datos.get('nombre').trim(),
      docente: datos.get('docente').trim(),
      color: datos.get('color') || COLORES_CURSO[0],
    };
    if (idEdicion) {
      actualizarCurso(idEdicion, curso);
    } else {
      agregarCurso(curso);
    }
    cerrarModal();
    renderizarCursos(document.querySelector('#contenido-vista'));
  });
}

function abrirFormularioCurso(cursoExistente) {
  const titulo = cursoExistente ? 'Editar curso' : 'Nuevo curso';
  abrirModal(titulo, plantillaFormulario(cursoExistente || {}), (formulario) => {
    manejarEnvioFormulario(formulario, cursoExistente?.id);
  });
}

function confirmarEliminacion(cursoId, nombreCurso) {
  const confirmado = window.confirm(
    `¿Eliminar el curso "${nombreCurso}"? También se eliminarán sus tareas asociadas.`
  );
  if (confirmado) {
    eliminarCurso(cursoId);
    renderizarCursos(document.querySelector('#contenido-vista'));
  }
}

// --- Pestaña "Horario": grilla de días x bloques --------------------------

function plantillaFormularioBloque(cursos, asignacionActual) {
  const opciones = cursos
    .map((c) => `<option value="${c.id}" ${asignacionActual?.curso.id === c.id ? 'selected' : ''}>${escaparHTML(c.nombre)}</option>`)
    .join('');
  return `
    <form class="formulario" data-form-bloque>
      <label class="campo">
        <span>Curso</span>
        <select name="cursoId" required ${cursos.length === 0 ? 'disabled' : ''}>
          ${cursos.length > 0 ? opciones : '<option value="">Primero crea un curso</option>'}
        </select>
      </label>
      <label class="campo">
        <span>Tipo de sesión</span>
        <select name="tipo">
          <option value="teoria" ${asignacionActual?.tipo !== 'laboratorio' ? 'selected' : ''}>Teoría</option>
          <option value="laboratorio" ${asignacionActual?.tipo === 'laboratorio' ? 'selected' : ''}>Laboratorio</option>
        </select>
      </label>
      <div class="acciones-formulario">
        ${asignacionActual ? '<button type="button" class="boton boton-peligro" data-quitar-bloque>Quitar</button>' : ''}
        <button type="button" class="boton boton-fantasma" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton-primario" ${cursos.length === 0 ? 'disabled' : ''}>Guardar</button>
      </div>
    </form>
  `;
}

function abrirModalCelda(dia, bloqueId) {
  const cursos = obtenerCursos();
  const asignacionActual = obtenerAsignacionBloque(dia, bloqueId);
  const bloque = BLOQUES.find((b) => b.id === bloqueId);
  const nombreDia = DIAS.find((d) => d.id === dia)?.etiqueta;

  abrirModal(`${nombreDia} · ${bloque.inicio}-${bloque.fin}`, plantillaFormularioBloque(cursos, asignacionActual), (formulario) => {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const datos = new FormData(formulario);
      asignarBloque(datos.get('cursoId'), dia, bloqueId, datos.get('tipo'));
      cerrarModal();
      renderizarCursos(document.querySelector('#contenido-vista'));
    });

    const botonQuitar = formulario.querySelector('[data-quitar-bloque]');
    if (botonQuitar) {
      botonQuitar.addEventListener('click', () => {
        quitarBloque(dia, bloqueId);
        cerrarModal();
        renderizarCursos(document.querySelector('#contenido-vista'));
      });
    }
  });
}

function celdaHorario(dia, bloque) {
  const asignacion = obtenerAsignacionBloque(dia.id, bloque.id);
  if (!asignacion) {
    return `
      <td class="celda-horario celda-vacia" data-dia="${dia.id}" data-bloque="${bloque.id}" title="Asignar curso">
        <span class="mas-celda">${icono('agregar')}</span>
      </td>
    `;
  }
  const tipoTexto = asignacion.tipo === 'laboratorio' ? 'Lab' : 'Teoría';
  return `
    <td class="celda-horario celda-ocupada" data-dia="${dia.id}" data-bloque="${bloque.id}"
        style="background:${hexARgba(asignacion.curso.color, 0.16)}; border-left-color:${asignacion.curso.color}"
        title="${escaparHTML(asignacion.curso.nombre)} (${tipoTexto})">
      <span class="nombre-celda">${escaparHTML(asignacion.curso.nombre)}</span>
      <span class="tipo-celda">${tipoTexto}</span>
    </td>
  `;
}

function renderizarGridHorario(contenedor) {
  const filas = BLOQUES.map((bloque) => `
    <tr>
      <th scope="row" class="hora-bloque">${bloque.inicio}<br />${bloque.fin}</th>
      ${DIAS.map((dia) => celdaHorario(dia, bloque)).join('')}
    </tr>
  `).join('');

  contenedor.innerHTML += `
    <p class="texto-sutil" style="margin-bottom:12px">Toca una celda para asignar o quitar un curso en ese bloque.</p>
    <div class="envoltura-horario">
      <table class="tabla-horario">
        <thead>
          <tr>
            <th></th>
            ${DIAS.map((d) => `<th>${d.etiqueta}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;

  contenedor.querySelectorAll('.celda-horario').forEach((celda) => {
    celda.addEventListener('click', () => {
      abrirModalCelda(celda.dataset.dia, Number(celda.dataset.bloque));
    });
  });
}

// --- Vista principal --------------------------------------------------------

function cambiarSubVista(nueva, contenedor) {
  subVista = nueva;
  renderizarCursos(contenedor);
}

// Renderiza la vista completa de Cursos (tarjetas u horario) dentro del contenedor dado
export function renderizarCursos(contenedor) {
  const cursos = obtenerCursos();

  contenedor.innerHTML = `
    <div class="cabecera-vista">
      <h1>Mis cursos</h1>
      <button type="button" class="boton boton-primario" data-nuevo-curso>${icono('agregar')} Nuevo curso</button>
    </div>
    <div class="barra-filtros" role="tablist" aria-label="Modo de vista de cursos">
      <button type="button" class="boton-filtro ${subVista === 'tarjetas' ? 'activo' : ''}" data-subvista="tarjetas">Tarjetas</button>
      <button type="button" class="boton-filtro ${subVista === 'horario' ? 'activo' : ''}" data-subvista="horario">Horario</button>
    </div>
  `;

  if (subVista === 'horario') {
    renderizarGridHorario(contenedor);
  } else {
    contenedor.innerHTML += cursos.length === 0
      ? estadoVacio()
      : `<div class="rejilla-cursos">${cursos.map(tarjetaCurso).join('')}</div>`;
  }

  contenedor.querySelectorAll('[data-subvista]').forEach((boton) => {
    boton.addEventListener('click', () => cambiarSubVista(boton.dataset.subvista, contenedor));
  });

  contenedor.querySelectorAll('[data-nuevo-curso]').forEach((boton) => {
    boton.addEventListener('click', () => abrirFormularioCurso());
  });

  contenedor.querySelectorAll('[data-editar]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const curso = obtenerCursos().find((c) => c.id === boton.dataset.editar);
      abrirFormularioCurso(curso);
    });
  });

  contenedor.querySelectorAll('[data-eliminar]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const curso = obtenerCursos().find((c) => c.id === boton.dataset.eliminar);
      if (curso) confirmarEliminacion(curso.id, curso.nombre);
    });
  });
}
