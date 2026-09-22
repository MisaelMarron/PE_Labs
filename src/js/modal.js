// modal.js — Ventana modal reutilizable para formularios (agregar/editar curso o tarea)

import { icono } from './iconos.js';

let elementoModalActual = null;

// Cierra la modal abierta actualmente, si existe
export function cerrarModal() {
  if (elementoModalActual) {
    elementoModalActual.remove();
    elementoModalActual = null;
    document.removeEventListener('keydown', manejarEscape);
  }
}

function manejarEscape(evento) {
  if (evento.key === 'Escape') cerrarModal();
}

// Abre una modal con un título y un formulario interno (HTML como string).
// `onListo(formulario)` se ejecuta apenas el formulario está en el DOM, para
// engancharle el listener de submit desde quien llama a abrirModal().
export function abrirModal(titulo, formularioHTML, onListo) {
  cerrarModal(); // por seguridad, solo una modal a la vez

  const overlay = document.createElement('div');
  overlay.className = 'overlay-modal';
  overlay.innerHTML = `
    <div class="caja-modal" role="dialog" aria-modal="true" aria-label="${titulo}">
      <div class="cabecera-modal">
        <h2>${titulo}</h2>
        <button type="button" class="boton-icono" data-cerrar aria-label="Cerrar">${icono('cerrar')}</button>
      </div>
      <div class="cuerpo-modal">${formularioHTML}</div>
    </div>
  `;

  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) cerrarModal();
  });
  overlay.querySelectorAll('[data-cerrar]').forEach((boton) => {
    boton.addEventListener('click', cerrarModal);
  });

  document.body.appendChild(overlay);
  elementoModalActual = overlay;
  document.addEventListener('keydown', manejarEscape);

  const formulario = overlay.querySelector('form');
  if (formulario && onListo) onListo(formulario);

  // Enfoca el primer campo del formulario para agilizar el llenado
  const primerCampo = overlay.querySelector('input, select, textarea');
  if (primerCampo) primerCampo.focus();
}
