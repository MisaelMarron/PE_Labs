# U-Plan móvil — Laboratorio 04 (Plataformas Emergentes)

Versión móvil de U-Plan, gestor de cursos, horario, tareas y asistencia para estudiantes universitarios, desarrollada con **React Native + Expo** usando los componentes propios del framework (`View`, `Text`, `FlatList`, `SectionList`, `Pressable`, `Modal`, `TextInput`).

## Integrantes

- William Isaias Roque Quispe
- Misael Josías Marrón Lope

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior y la app **Expo Go** en el teléfono (mismo WiFi que la PC).

```bash
npm install
npx expo start
```

Escanea el código QR con Expo Go (Android) o con la cámara (iPhone). Para ver la vista previa en el navegador, presiona `w` en la terminal.

## Estructura

```
App.js                    Proveedores, pestaña activa y barra inferior
src/theme.js              Colores claro/oscuro
src/utils/fechas.js       Utilidades de fechas
src/constants/horario.js  Días, 16 bloques horarios y generación de sesiones
src/data/semilla.js       Datos de ejemplo
src/context/DataContext.js  Estado global + AsyncStorage
src/components/           Componentes reutilizables
src/screens/              Inicio, Cursos, Tareas, Agenda, Perfil
```
