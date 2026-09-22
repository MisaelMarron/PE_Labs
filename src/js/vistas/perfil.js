// perfil.js — Vista "Perfil": datos del estudiante/integrantes y reset de datos (RF5)

import { obtenerPerfil, guardarPerfil, reiniciarDatos } from '../storage.js';
import { escaparHTML } from '../utils.js';
import { icono } from '../iconos.js';

// Convierte el arreglo de integrantes en texto (uno por línea) y viceversa
function integrantesATexto(integrantes) {
  return (integrantes || []).join('\n');
}

function textoAIntegrantes(texto) {
  return texto
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0);
}

function listaIntegrantes(integrantes) {
  if (!integrantes || integrantes.length === 0) {
    return '<p class="texto-sutil">Aún no registras integrantes.</p>';
  }
  return `<ul class="lista-integrantes">${integrantes
    .map((nombre) => `<li>${icono('perfil')} ${escaparHTML(nombre)}</li>`)
    .join('')}</ul>`;
}

function manejarGuardarPerfil(formulario, contenedor) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    const perfil = {
      nombre: datos.get('nombre').trim(),
      universidad: datos.get('universidad').trim(),
      carrera: datos.get('carrera').trim(),
      ciclo: datos.get('ciclo').trim(),
      correo: datos.get('correo').trim(),
      integrantes: textoAIntegrantes(datos.get('integrantes')),
    };
    guardarPerfil(perfil);
    mostrarConfirmacionGuardado(formulario);
    renderizarPerfil(contenedor);
  });
}

function mostrarConfirmacionGuardado(formulario) {
  const aviso = formulario.querySelector('[data-aviso-guardado]');
  if (!aviso) return;
  aviso.classList.add('visible');
  setTimeout(() => aviso.classList.remove('visible'), 2000);
}

function manejarReinicio(contenedor) {
  const confirmado = window.confirm(
    '¿Seguro que deseas reiniciar todos los datos? Se perderán tus cursos, tareas y perfil actuales, y se restaurarán los datos de ejemplo.'
  );
  if (confirmado) {
    reiniciarDatos();
    renderizarPerfil(contenedor);
  }
}

// Renderiza la vista completa de Perfil dentro del contenedor dado
export function renderizarPerfil(contenedor) {
  const perfil = obtenerPerfil();

  contenedor.innerHTML = `
    <div class="cabecera-vista"><h1>Mi perfil</h1></div>

    <div class="tarjeta-perfil">
      <div class="avatar-perfil">${icono('perfil')}</div>
      <div>
        <h2>${escaparHTML(perfil.nombre) || 'Estudiante'}</h2>
        <p class="texto-sutil">${escaparHTML(perfil.carrera)} · ${escaparHTML(perfil.ciclo)}</p>
      </div>
    </div>

    <section class="seccion-formulario">
      <h2>Datos del estudiante</h2>
      <form class="formulario" data-form-perfil>
        <label class="campo">
          <span>Nombre completo</span>
          <input type="text" name="nombre" maxlength="60" value="${escaparHTML(perfil.nombre)}" />
        </label>
        <label class="campo">
          <span>Universidad</span>
          <input type="text" name="universidad" maxlength="80" value="${escaparHTML(perfil.universidad)}" />
        </label>
        <label class="campo">
          <span>Carrera</span>
          <input type="text" name="carrera" maxlength="60" value="${escaparHTML(perfil.carrera)}" />
        </label>
        <label class="campo">
          <span>Ciclo</span>
          <input type="text" name="ciclo" maxlength="30" value="${escaparHTML(perfil.ciclo)}" />
        </label>
        <label class="campo">
          <span>Correo</span>
          <input type="email" name="correo" maxlength="80" value="${escaparHTML(perfil.correo)}" placeholder="correo@ejemplo.com" />
        </label>
        <label class="campo">
          <span>Integrantes del equipo (uno por línea)</span>
          <textarea name="integrantes" rows="3" placeholder="Nombre Apellido">${escaparHTML(integrantesATexto(perfil.integrantes))}</textarea>
        </label>
        <div class="acciones-formulario">
          <span class="aviso-guardado" data-aviso-guardado>${icono('check')} Guardado</span>
          <button type="submit" class="boton boton-primario">Guardar cambios</button>
        </div>
      </form>
    </section>

    <section class="seccion-formulario">
      <h2>Integrantes registrados</h2>
      ${listaIntegrantes(perfil.integrantes)}
    </section>

    <section class="seccion-formulario seccion-peligro">
      <h2>Reiniciar datos</h2>
      <p class="texto-sutil">Elimina todos los cursos, tareas y datos de perfil guardados en este dispositivo, y vuelve a cargar los datos de ejemplo.</p>
      <button type="button" class="boton boton-peligro" data-reiniciar>${icono('eliminar')} Reiniciar todos los datos</button>
    </section>
  `;

  const formulario = contenedor.querySelector('[data-form-perfil]');
  if (formulario) manejarGuardarPerfil(formulario, contenedor);

  contenedor.querySelector('[data-reiniciar]').addEventListener('click', () => manejarReinicio(contenedor));
}
