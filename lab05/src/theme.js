// theme.js — Paleta de colores, tema claro/oscuro (automático o manual) y colores de curso
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_TEMA = 'uplan_movil_tema';

const paletaClara = {
  esOscuro: false,
  fondo: '#f5f6fb',
  superficie: '#ffffff',
  superficieAlt: '#f1f2f9',
  borde: '#e4e6f2',
  texto: '#1e2233',
  sutil: '#6b7085',
  primario: '#4f46e5',
  primarioSuave: '#eef2ff',
  exito: '#10b981',
  adv: '#f59e0b',
  peligro: '#ef4444',
};

const paletaOscura = {
  esOscuro: true,
  fondo: '#12141f',
  superficie: '#1a1d2c',
  superficieAlt: '#21243a',
  borde: '#2c2f45',
  texto: '#edeef8',
  sutil: '#9a9dbb',
  primario: '#818cf8',
  primarioSuave: '#262a45',
  exito: '#10b981',
  adv: '#f59e0b',
  peligro: '#ef4444',
};

// Preferencia del usuario: 'auto' (sigue al sistema), 'claro' u 'oscuro'
const ContextoTema = createContext({ preferencia: 'auto', setPreferencia: () => {} });

export function TemaProvider({ children }) {
  const [preferencia, setPref] = useState('auto');

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_TEMA)
      .then((valor) => { if (valor) setPref(valor); })
      .catch(() => {});
  }, []);

  const valor = useMemo(() => ({
    preferencia,
    setPreferencia: (nueva) => {
      setPref(nueva);
      AsyncStorage.setItem(CLAVE_TEMA, nueva).catch(() => {});
    },
  }), [preferencia]);

  return <ContextoTema.Provider value={valor}>{children}</ContextoTema.Provider>;
}

// Hook: devuelve la paleta vigente según la preferencia y el esquema del sistema
export function useTema() {
  const sistema = useColorScheme();
  const { preferencia } = useContext(ContextoTema);
  const oscuro = preferencia === 'oscuro' || (preferencia === 'auto' && sistema === 'dark');
  return oscuro ? paletaOscura : paletaClara;
}

// Hook para cambiar el tema: alternar() invierte el tema actual
export function useControlTema() {
  const { preferencia, setPreferencia } = useContext(ContextoTema);
  const t = useTema();
  return { preferencia, setPreferencia, alternar: () => setPreferencia(t.esOscuro ? 'claro' : 'oscuro') };
}

export const COLORES_CURSO = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];

// Convierte '#rrggbb' a 'rgba(r, g, b, alpha)'
export function hexARgba(hex, alpha = 1) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
