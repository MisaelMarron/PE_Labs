// Boton.js — Botón reutilizable (Pressable) con variantes y área táctil de 44px
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema, hexARgba } from '../theme';

export default function Boton({ titulo, onPress, variante = 'primario', icono, compacto = false, deshabilitado = false, style }) {
  const t = useTema();
  const fondo = { primario: t.primario, fantasma: 'transparent', peligro: hexARgba(t.peligro, 0.14) }[variante];
  const color = { primario: '#ffffff', fantasma: t.sutil, peligro: t.peligro }[variante];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={deshabilitado}
      style={({ pressed }) => [
        estilos.base,
        {
          backgroundColor: fondo,
          borderColor: variante === 'fantasma' ? t.borde : 'transparent',
          opacity: deshabilitado ? 0.5 : pressed ? 0.8 : 1,
          minHeight: compacto ? 40 : 44,
          paddingHorizontal: compacto ? 12 : 18,
        },
        style,
      ]}
    >
      {icono ? <Ionicons name={icono} size={compacto ? 15 : 18} color={color} style={estilos.icono} /> : null}
      <Text style={{ color, fontWeight: '600', fontSize: compacto ? 12 : 14 }}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  icono: { marginRight: 6 },
});
