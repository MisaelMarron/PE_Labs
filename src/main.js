// main.js — Punto de entrada de U-Plan: arma el layout de la app y el router de vistas

import './style.css';
import { icono } from './js/iconos.js';
import { obtenerTema, guardarTema } from './js/storage.js';
import { renderizarInicio } from './js/vistas/inicio.js';
import { renderizarCursos } from './js/vistas/cursos.js';
import { renderizarTareas } from './js/vistas/tareas.js';
import { renderizarCalendario } from './js/vistas/calendario.js';
import { renderizarPerfil } from './js/vistas/perfil.js';

// Cada vista se identifica por un nombre de ruta y sabe cómo pintarse a sí misma
const VISTAS = {
  inicio: { titulo: 'Inicio', icono: 'inicio', render: renderizarInicio },
  cursos: { titulo: 'Cursos', icono: 'cursos', render: renderizarCursos },
  tareas: { titulo: 'Tareas', icono: 'tareas', render: renderizarTareas },
  calendario: { titulo: 'Agenda', icono: 'calendario', render: renderizarCalendario },
  perfil: { titulo: 'Perfil', icono: 'perfil', render: renderizarPerfil },
};

const ORDEN_VISTAS = ['inicio', 'cursos', 'tareas', 'calendario', 'perfil'];
const VISTA_POR_DEFECTO = 'inicio';

// --- Estructura fija del layout (cabecera + navegación + contenedor de vista) ---
function construirEstructuraApp() {
  const raiz = document.querySelector('#app');
  raiz.innerHTML = `
    <div class="app-shell">
      <aside class="barra-lateral">
        <div class="marca-app">
          <span class="logo-app">${icono('cursos')}</span>
          <span class="nombre-app">U-Plan</span>
        </div>
        <nav class="nav-lateral" aria-label="Navegación principal">
          ${ORDEN_VISTAS.map(
            (clave) => `
              <button type="button" class="enlace-nav" data-ruta="${clave}">
                ${icono(VISTAS[clave].icono)}
                <span>${VISTAS[clave].titulo}</span>
              </button>
            `
          ).join('')}
        </nav>
        <button type="button" class="boton-tema" data-alternar-tema aria-label="Cambiar tema claro/oscuro">
          <span data-icono-tema></span>
          <span data-texto-tema>Modo oscuro</span>
        </button>
      </aside>

      <div class="area-principal">
        <header class="encabezado-app">
          <span class="nombre-app-movil">U-Plan</span>
          <button type="button" class="boton-icono boton-tema-movil" data-alternar-tema aria-label="Cambiar tema claro/oscuro">
            <span data-icono-tema-movil></span>
          </button>
        </header>
        <main id="contenido-vista" class="contenido-vista" tabindex="-1"></main>
      </div>

      <nav class="nav-inferior" aria-label="Navegación principal">
        ${ORDEN_VISTAS.map(
          (clave) => `
            <button type="button" class="enlace-nav-movil" data-ruta="${clave}">
              ${icono(VISTAS[clave].icono)}
              <span>${VISTAS[clave].titulo}</span>
            </button>
          `
        ).join('')}
      </nav>
    </div>
  `;
}

// --- Router muy simple basado en el hash de la URL (#inicio, #cursos, ...) ---
function obtenerRutaActual() {
  const hash = window.location.hash.replace('#', '');
  return VISTAS[hash] ? hash : VISTA_POR_DEFECTO;
}

function marcarEnlaceActivo(rutaActual) {
  document.querySelectorAll('[data-ruta]').forEach((enlace) => {
    const activo = enlace.dataset.ruta === rutaActual;
    enlace.classList.toggle('activo', activo);
    if (activo) enlace.setAttribute('aria-current', 'page');
    else enlace.removeAttribute('aria-current');
  });
}

function navegarA(ruta) {
  if (window.location.hash !== `#${ruta}`) {
    window.location.hash = ruta;
    return; // el evento hashchange se encargará de renderizar
  }
  renderizarVistaActual();
}

function renderizarVistaActual() {
  const ruta = obtenerRutaActual();
  const contenedor = document.querySelector('#contenido-vista');
  marcarEnlaceActivo(ruta);
  VISTAS[ruta].render(contenedor);
  contenedor.focus({ preventScroll: true });
  contenedor.scrollTo?.(0, 0);
}

function inicializarNavegacion() {
  document.querySelectorAll('[data-ruta]').forEach((enlace) => {
    enlace.addEventListener('click', () => navegarA(enlace.dataset.ruta));
  });
  window.addEventListener('hashchange', renderizarVistaActual);
  if (!window.location.hash) window.location.hash = VISTA_POR_DEFECTO;
}

// --- Modo oscuro: 'auto' sigue las preferencias del sistema; si no, se fuerza ---
function aplicarTema(tema) {
  if (tema === 'auto') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = tema;
  }
  const esOscuro = tema === 'dark' || (tema === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelectorAll('[data-icono-tema]').forEach((el) => (el.innerHTML = icono(esOscuro ? 'sol' : 'luna')));
  document.querySelectorAll('[data-icono-tema-movil]').forEach((el) => (el.innerHTML = icono(esOscuro ? 'sol' : 'luna')));
  document.querySelectorAll('[data-texto-tema]').forEach((el) => (el.textContent = esOscuro ? 'Modo claro' : 'Modo oscuro'));
}

function inicializarTema() {
  let tema = obtenerTema();
  aplicarTema(tema);
  document.querySelectorAll('[data-alternar-tema]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const actualEsOscuro = document.documentElement.dataset.theme === 'dark'
        || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      tema = actualEsOscuro ? 'light' : 'dark';
      guardarTema(tema);
      aplicarTema(tema);
    });
  });
}

// --- Arranque de la aplicación ---
function iniciarApp() {
  construirEstructuraApp();
  inicializarNavegacion();
  inicializarTema();
  renderizarVistaActual();
}

iniciarApp();
