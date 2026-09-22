// inicio.js — Vista "Inicio": resumen general del progreso académico (RF4)

import { obtenerTareas, obtenerCursos } from '../storage.js';
import { escaparHTML, formatearFecha, textoFechaRelativa, diasRestantes, infoPrioridad } from '../utils.js';
import { icono } from '../iconos.js';

const DIAS_LIMITE_POR_VENCER = 7;

function calcularEstadisticas(tareas) {
  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
  const porVencer = tareas.filter(
    (t) => !t.completada && diasRestantes(t.fechaEntrega) >= 0 && diasRestantes(t.fechaEntrega) <= DIAS_LIMITE_POR_VENCER
  ).length;
  const vencidas = tareas.filter((t) => !t.completada && diasRestantes(t.fechaEntrega) < 0).length;
  return { total, completadas, porcentaje, porVencer, vencidas };
}

function anilloProgreso(porcentaje) {
  const circunferencia = 2 * Math.PI * 52;
  const relleno = (porcentaje / 100) * circunferencia;
  return `
    <svg viewBox="0 0 120 120" class="anillo-progreso" role="img" aria-label="Progreso de tareas completadas: ${porcentaje}%">
      <circle cx="60" cy="60" r="52" class="anillo-fondo" />
      <circle cx="60" cy="60" r="52" class="anillo-relleno"
        stroke-dasharray="${circunferencia}"
        stroke-dashoffset="${circunferencia - relleno}" />
      <text x="60" y="66" text-anchor="middle" class="texto-anillo">${porcentaje}%</text>
    </svg>
  `;
}

function tarjetaProximaEntrega(tarea, curso) {
  const { etiqueta, clase } = infoPrioridad(tarea.prioridad);
  return `
    <li class="entrega-agenda" style="--color-curso:${curso?.color || '#999'}">
      <span class="punto-curso"></span>
      <div class="detalle-tarea">
        <p class="titulo-tarea">${escaparHTML(tarea.titulo)}</p>
        <div class="meta-tarea">
          <span class="chip-curso">${escaparHTML(curso?.nombre || 'Sin curso')}</span>
          <span class="fecha-tarea">${icono('reloj')} ${formatearFecha(tarea.fechaEntrega)} · ${textoFechaRelativa(tarea.fechaEntrega)}</span>
          <span class="etiqueta-prioridad ${clase}">${etiqueta}</span>
        </div>
      </div>
    </li>
  `;
}

function saludoSegunHora() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

// Renderiza la vista completa de Inicio dentro del contenedor dado
export function renderizarInicio(contenedor) {
  const cursos = obtenerCursos();
  const cursosPorId = Object.fromEntries(cursos.map((c) => [c.id, c]));
  const tareas = obtenerTareas();
  const { total, completadas, porcentaje, porVencer, vencidas } = calcularEstadisticas(tareas);

  const proximasEntregas = tareas
    .filter((t) => !t.completada)
    .sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega))
    .slice(0, 3);

  contenedor.innerHTML = `
    <div class="cabecera-vista">
      <h1>${saludoSegunHora()} 👋</h1>
    </div>

    <div class="rejilla-resumen">
      <div class="tarjeta-resumen tarjeta-progreso">
        ${anilloProgreso(porcentaje)}
        <div>
          <p class="numero-resumen">${completadas} / ${total}</p>
          <p class="etiqueta-resumen">Tareas completadas</p>
        </div>
      </div>

      <div class="tarjeta-resumen">
        <div class="icono-resumen icono-alerta">${icono('reloj')}</div>
        <div>
          <p class="numero-resumen">${porVencer}</p>
          <p class="etiqueta-resumen">Por vencer (7 días)</p>
        </div>
      </div>

      <div class="tarjeta-resumen">
        <div class="icono-resumen icono-cursos">${icono('cursos')}</div>
        <div>
          <p class="numero-resumen">${cursos.length}</p>
          <p class="etiqueta-resumen">Cursos activos</p>
        </div>
      </div>

      <div class="tarjeta-resumen ${vencidas > 0 ? 'tarjeta-resumen-alerta' : ''}">
        <div class="icono-resumen icono-vencida">${icono('eliminar')}</div>
        <div>
          <p class="numero-resumen">${vencidas}</p>
          <p class="etiqueta-resumen">Tareas vencidas</p>
        </div>
      </div>
    </div>

    <section class="seccion-proximas">
      <h2>Próximas entregas</h2>
      ${proximasEntregas.length === 0
        ? '<p class="texto-sutil">No tienes entregas pendientes. ¡Vas al día!</p>'
        : `<ul class="lista-agenda">${proximasEntregas.map((t) => tarjetaProximaEntrega(t, cursosPorId[t.cursoId])).join('')}</ul>`}
    </section>
  `;
}
