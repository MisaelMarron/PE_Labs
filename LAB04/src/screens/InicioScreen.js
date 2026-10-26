// InicioScreen.js — Resumen: progreso, tareas por vencer, cursos activos y próximas entregas
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema, hexARgba } from '../theme';
import { useDatos } from '../context/DataContext';
import { Tarjeta, Chip, Encabezado } from '../components/Basicos';
import { diasRestantes, formatearFecha, textoFechaRelativa, infoPrioridad } from '../utils/fechas';

function saludo() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

// Tarjeta pequeña de estadística (ícono + número + etiqueta)
function Estadistica({ icono, color, valor, etiqueta }) {
  const t = useTema();
  return (
    <View style={[estilos.stat, { backgroundColor: t.superficie }]}>
      <View style={[estilos.statIcono, { backgroundColor: hexARgba(color, 0.15) }]}>
        <Ionicons name={icono} size={20} color={color} />
      </View>
      <Text style={[estilos.statValor, { color: t.texto }]}>{valor}</Text>
      <Text style={[estilos.statEtiqueta, { color: t.sutil }]}>{etiqueta}</Text>
    </View>
  );
}

export default function InicioScreen() {
  const t = useTema();
  const { cursos, tareas, perfil } = useDatos();
  const cursosPorId = Object.fromEntries(cursos.map((c) => [c.id, c]));

  const total = tareas.length;
  const completadas = tareas.filter((x) => x.completada).length;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
  const pendientes = tareas.filter((x) => !x.completada);
  const porVencer = pendientes.filter((x) => diasRestantes(x.fechaEntrega) >= 0 && diasRestantes(x.fechaEntrega) <= 7).length;
  const vencidas = pendientes.filter((x) => diasRestantes(x.fechaEntrega) < 0).length;
  const proximas = [...pendientes].sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega)).slice(0, 3);

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Encabezado titulo={`${saludo()}, ${perfil.nombre || 'estudiante'}`} />

      <Tarjeta>
        <View style={estilos.filaProgreso}>
          <Text style={[estilos.porcentaje, { color: t.primario }]}>{porcentaje}%</Text>
          <View style={{ flex: 1 }}>
            <Text style={[estilos.statValor, { color: t.texto }]}>{completadas} de {total}</Text>
            <Text style={{ color: t.sutil, fontSize: 13 }}>tareas completadas</Text>
          </View>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: porcentaje }}
          style={[estilos.barraFondo, { backgroundColor: t.superficieAlt }]}
        >
          <View style={[estilos.barraRelleno, { width: `${porcentaje}%`, backgroundColor: t.primario }]} />
        </View>
      </Tarjeta>

      <View style={estilos.rejilla}>
        <Estadistica icono="time-outline" color={t.adv} valor={porVencer} etiqueta="Por vencer (7 días)" />
        <Estadistica icono="book-outline" color={t.primario} valor={cursos.length} etiqueta="Cursos activos" />
        <Estadistica icono="alert-circle-outline" color={t.peligro} valor={vencidas} etiqueta="Tareas vencidas" />
      </View>

      <Text style={[estilos.seccion, { color: t.texto }]}>Próximas entregas</Text>
      {proximas.length === 0 ? (
        <Text style={{ color: t.sutil }}>No tienes entregas pendientes. ¡Vas al día!</Text>
      ) : (
        proximas.map((tarea) => {
          const curso = cursosPorId[tarea.cursoId];
          const prio = infoPrioridad(tarea.prioridad);
          return (
            <Tarjeta key={tarea.id} acento={curso?.color}>
              <Text style={[estilos.tareaTitulo, { color: t.texto }]}>{tarea.titulo}</Text>
              <Text style={{ color: t.sutil, fontSize: 12, marginTop: 2 }}>{curso?.nombre}</Text>
              <View style={estilos.meta}>
                <Chip texto={`${formatearFecha(tarea.fechaEntrega)} · ${textoFechaRelativa(tarea.fechaEntrega)}`} />
                <Chip texto={prio.etiqueta} tono={prio.tono} />
              </View>
            </Tarjeta>
          );
        })
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 32 },
  filaProgreso: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  porcentaje: { fontSize: 38, fontWeight: '800' },
  barraFondo: { height: 10, borderRadius: 5, overflow: 'hidden' },
  barraRelleno: { height: '100%', borderRadius: 5 },
  rejilla: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  stat: { flex: 1, borderRadius: 16, padding: 12, boxShadow: '0 2px 8px rgba(30, 34, 51, 0.08)' },
  statIcono: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValor: { fontSize: 22, fontWeight: '800' },
  statEtiqueta: { fontSize: 11, marginTop: 2 },
  seccion: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  tareaTitulo: { fontSize: 15, fontWeight: '700' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
});
