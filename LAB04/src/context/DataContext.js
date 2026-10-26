// DataContext.js — Estado global de la app (cursos, tareas, perfil, asistencias)
// con persistencia automática en AsyncStorage (equivalente móvil de localStorage).
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { crearDatosIniciales, generarId } from '../data/semilla';

const CLAVE = 'uplan_movil_datos';
const Contexto = createContext(null);

export function DataProvider({ children }) {
  const [datos, setDatos] = useState(null);

  // Al abrir la app: leer lo guardado o, si no hay nada, cargar los datos de ejemplo
  useEffect(() => {
    let activo = true;
    AsyncStorage.getItem(CLAVE)
      .then((texto) => activo && setDatos(texto ? JSON.parse(texto) : crearDatosIniciales()))
      .catch(() => activo && setDatos(crearDatosIniciales()));
    return () => { activo = false; };
  }, []);

  // Cada vez que cambian los datos, se guardan
  useEffect(() => {
    if (datos) AsyncStorage.setItem(CLAVE, JSON.stringify(datos)).catch(() => {});
  }, [datos]);

  const acciones = useMemo(() => {
    const cambiar = (fn) => setDatos((previo) => fn(previo));
    return {
      agregarCurso: (curso) => cambiar((d) => ({ ...d, cursos: [...d.cursos, { ...curso, id: generarId(), bloques: [] }] })),
      actualizarCurso: (id, cambios) => cambiar((d) => ({ ...d, cursos: d.cursos.map((c) => (c.id === id ? { ...c, ...cambios } : c)) })),
      eliminarCurso: (id) => cambiar((d) => ({
        ...d,
        cursos: d.cursos.filter((c) => c.id !== id),
        tareas: d.tareas.filter((t) => t.cursoId !== id),
      })),

      // Una celda (día + bloque) solo puede pertenecer a un curso a la vez
      asignarBloque: (cursoId, dia, bloqueId, tipo) => cambiar((d) => ({
        ...d,
        cursos: d.cursos.map((c) => {
          const limpios = (c.bloques || []).filter((b) => !(b.dia === dia && b.bloqueId === bloqueId));
          if (c.id === cursoId) limpios.push({ dia, bloqueId, tipo });
          return { ...c, bloques: limpios };
        }),
      })),
      quitarBloque: (dia, bloqueId) => cambiar((d) => ({
        ...d,
        cursos: d.cursos.map((c) => ({
          ...c,
          bloques: (c.bloques || []).filter((b) => !(b.dia === dia && b.bloqueId === bloqueId)),
        })),
      })),

      agregarTarea: (tarea) => cambiar((d) => ({ ...d, tareas: [...d.tareas, { ...tarea, id: generarId(), completada: false }] })),
      actualizarTarea: (id, cambios) => cambiar((d) => ({ ...d, tareas: d.tareas.map((t) => (t.id === id ? { ...t, ...cambios } : t)) })),
      eliminarTarea: (id) => cambiar((d) => ({ ...d, tareas: d.tareas.filter((t) => t.id !== id) })),
      alternarTarea: (id) => cambiar((d) => ({ ...d, tareas: d.tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)) })),

      guardarPerfil: (perfil) => cambiar((d) => ({ ...d, perfil })),
      confirmarAsistencia: (clave) => cambiar((d) => (
        d.asistencias.includes(clave) ? d : { ...d, asistencias: [...d.asistencias, clave] }
      )),
      reiniciarDatos: () => setDatos(crearDatosIniciales()),
    };
  }, []);

  const valor = useMemo(() => (datos ? { ...datos, ...acciones, cargando: false } : { cargando: true }), [datos, acciones]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDatos() {
  return useContext(Contexto);
}
