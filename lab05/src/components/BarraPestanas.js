// BarraPestanas.js — Navegación inferior fija (tipo app nativa) con 5 pestañas
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '../theme';
import { ANCHO_BARRA_LATERAL } from '../layout';

export const PESTANAS = [
  { id: 'inicio', titulo: 'Inicio', icono: 'home-outline', iconoActivo: 'home' },
  { id: 'cursos', titulo: 'Cursos', icono: 'book-outline', iconoActivo: 'book' },
  { id: 'tareas', titulo: 'Tareas', icono: 'checkbox-outline', iconoActivo: 'checkbox' },
  { id: 'agenda', titulo: 'Agenda', icono: 'calendar-outline', iconoActivo: 'calendar' },
  { id: 'primerCiclo', titulo: 'Apoyo', icono: 'compass-outline', iconoActivo: 'compass' },
  { id: 'perfil', titulo: 'Perfil', icono: 'person-outline', iconoActivo: 'person' },
];

export default function BarraPestanas({ activa, onCambiar }) {
  const t = useTema();
  const insets = useSafeAreaInsets();

  return (
    <View
      role="tablist"
      style={[estilos.barra, { backgroundColor: t.superficie, borderTopColor: t.borde, paddingBottom: Math.max(insets.bottom, 6) }]}
    >
      {PESTANAS.map((p) => {
        const esActiva = p.id === activa;
        const color = esActiva ? t.primario : t.sutil;
        return (
          <Pressable
            key={p.id}
            role="tab"
            aria-selected={esActiva}
            onPress={() => onCambiar(p.id)}
            style={estilos.pestana}
          >
            <Ionicons name={esActiva ? p.iconoActivo : p.icono} size={24} color={color} />
            <Text style={[estilos.texto, { color, fontWeight: esActiva ? '700' : '500' }]}>{p.titulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Barra lateral (pantallas anchas): mismas 5 secciones en vertical, con el logo arriba
export function BarraLateral({ activa, onCambiar }) {
  const t = useTema();
  return (
    <View role="tablist" style={[estilos.lateral, { backgroundColor: t.superficie, borderRightColor: t.borde }]}>
      <View style={estilos.marca}>
        <Ionicons name="book" size={26} color={t.primario} />
        <Text style={[estilos.nombreMarca, { color: t.texto }]}>U-Plan</Text>
      </View>
      {PESTANAS.map((p) => {
        const esActiva = p.id === activa;
        const color = esActiva ? t.primario : t.sutil;
        return (
          <Pressable
            key={p.id}
            role="tab"
            aria-selected={esActiva}
            onPress={() => onCambiar(p.id)}
            style={({ pressed }) => [
              estilos.itemLateral,
              { backgroundColor: esActiva ? t.primarioSuave : pressed ? t.superficieAlt : 'transparent' },
            ]}
          >
            <Ionicons name={esActiva ? p.iconoActivo : p.icono} size={22} color={color} />
            <Text style={{ color, fontWeight: '700', fontSize: 15 }}>{p.titulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  lateral: { width: ANCHO_BARRA_LATERAL, borderRightWidth: 1, padding: 16, gap: 4 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8, paddingBottom: 20, paddingTop: 8 },
  nombreMarca: { fontSize: 22, fontWeight: '800' },
  itemLateral: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingHorizontal: 14, borderRadius: 10 },
  barra: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 6 },
  pestana: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48, gap: 2 },
  texto: { fontSize: 11 },
});
