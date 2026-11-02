# U-Plan Primer Ciclo — Laboratorio 05 (Plataformas Emergentes)

Evolución móvil de U-Plan dirigida a estudiantes ingresantes. Conserva cursos, horario, tareas y agenda e incorpora una guía de preparación inicial, carga semanal de entregas y orientación general para buscar apoyo académico. Desarrollada con **React Native + Expo** usando componentes propios del framework (`View`, `Text`, `FlatList`, `SectionList`, `Pressable`, `Modal`, `TextInput`).

La necesidad planteada es una hipótesis de diseño. Antes de presentar resultados de proyección social, el equipo debe contrastarla con ingresantes y registrar las pruebas de uso. Los cursos con código `EJ-` son datos ilustrativos. La app guarda datos localmente mediante AsyncStorage y no sincroniza dispositivos.

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
                          y Primer Ciclo (Apoyo)
```
