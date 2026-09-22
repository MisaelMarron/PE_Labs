# U-Plan — Gestor de cursos y tareas universitarias

Aplicación web tipo SPA (Single Page Application) para que un estudiante universitario organice sus cursos, tareas y fechas de entrega, con navegación tipo app nativa y datos guardados en el propio navegador (sin backend).

## Integrantes

- William Isaias Roque Quispe
- Misael Josías Marrón Lope

## Tecnologías utilizadas

- HTML5, CSS3 (variables CSS, Flexbox, Grid, media queries) y JavaScript (ES6+, módulos, sin frameworks).
- [Vite](https://vitejs.dev/) como bundler y servidor de desarrollo.
- `localStorage` del navegador como única persistencia de datos.

## Instalación y ejecución

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
# Clonar el repositorio
git clone <URL-del-repositorio>
cd u-plan

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Luego abrir la URL que muestra la terminal (por defecto `http://localhost:5173`).

Otros comandos:

```bash
npm run build     # Genera la versión de producción en /dist
npm run preview   # Sirve localmente la build de producción
```

## Vistas de la aplicación

1. **Inicio** — resumen de progreso, tareas por vencer y próximas entregas.
2. **Cursos** — tarjetas de curso (nombre, docente, horario, color) con alta, edición y eliminación.
3. **Tareas** — lista de tareas con checkbox de completado, filtros y prioridad.
4. **Agenda** — próximas entregas ordenadas por fecha.
5. **Perfil** — datos del estudiante/integrantes y opción de reiniciar los datos.

## Estructura de carpetas

```
u-plan/
├── index.html
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.js            # Layout de la app, router y tema
    ├── style.css          # Estilos y responsive
    └── js/
        ├── storage.js     # Persistencia en localStorage + datos de ejemplo
        ├── utils.js       # Fechas, prioridades y helpers
        ├── iconos.js      # Íconos SVG en línea
        ├── modal.js       # Ventana modal para formularios
        └── vistas/
            ├── inicio.js
            ├── cursos.js
            ├── tareas.js
            ├── calendario.js
            └── perfil.js
```
