// Basicos.js — Componentes pequeños reutilizables: Chip, Tarjeta, IconoBoton, EstadoVacio, Encabezado
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema, useControlTema, hexARgba } from '../theme';

// Etiqueta redondeada. `tono` puede ser: neutro, exito, adv o peligro
export function Chip({ texto, tono = 'neutro', color }) {
  const t = useTema();
  const base = color || (tono === 'neutro' ? t.sutil : t[tono]);
  const fondo = tono === 'neutro' && !color ? t.superficieAlt : hexARgba(base, 0.15);
  return (
    <View style={[estilos.chip, { backgroundColor: fondo }]}>
      <Text style={[estilos.chipTexto, { color: base }]}>{texto}</Text>
    </View>
  );
}

// Tarjeta con franja de color de acento a la izquierda
export function Tarjeta({ children, acento, style }) {
  const t = useTema();
  return (
    <View
      style={[
        estilos.tarjeta,
        { backgroundColor: t.superficie, borderLeftColor: acento || 'transparent', borderLeftWidth: acento ? 5 : 0 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Botón circular solo con ícono (44x44 para cumplir el área táctil mínima)
export function IconoBoton({ nombre, onPress, etiqueta, color }) {
  const t = useTema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      onPress={onPress}
      style={({ pressed }) => [estilos.iconoBoton, pressed && { backgroundColor: t.superficieAlt }]}
    >
      <Ionicons name={nombre} size={20} color={color || t.sutil} />
    </Pressable>
  );
}

export function EstadoVacio({ icono = 'file-tray-outline', titulo, texto }) {
  const t = useTema();
  return (
    <View style={estilos.vacio}>
      <Ionicons name={icono} size={56} color={t.primario} style={{ opacity: 0.6 }} />
      <Text style={[estilos.vacioTitulo, { color: t.texto }]}>{titulo}</Text>
      {texto ? <Text style={[estilos.vacioTexto, { color: t.sutil }]}>{texto}</Text> : null}
    </View>
  );
}

// Título de pantalla con una acción opcional y el botón de tema claro/oscuro
export function Encabezado({ titulo, derecha }) {
  const t = useTema();
  const { alternar } = useControlTema();
  return (
    <View style={estilos.encabezado}>
      <Text style={[estilos.titulo, { color: t.texto }]} accessibilityRole="header">{titulo}</Text>
      <View style={estilos.accionesEncabezado}>
        {derecha}
        <IconoBoton
          nombre={t.esOscuro ? 'sunny-outline' : 'moon-outline'}
          etiqueta="Cambiar entre tema claro y oscuro"
          onPress={alternar}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipTexto: { fontSize: 11, fontWeight: '700' },
  tarjeta: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(30, 34, 51, 0.08)',
  },
  iconoBoton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  vacio: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  vacioTitulo: { fontSize: 17, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  vacioTexto: { fontSize: 13, marginTop: 6, textAlign: 'center' },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: '800', flexShrink: 1 },
  accionesEncabezado: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
