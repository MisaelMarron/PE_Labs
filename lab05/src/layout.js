// layout.js — Diseño adaptable: pantalla de celular (barra inferior) o ancha (barra lateral)
import { useWindowDimensions } from 'react-native';

export const ANCHO_MINIMO_ESCRITORIO = 768;
export const ANCHO_BARRA_LATERAL = 230;
export const ANCHO_MAXIMO_CONTENIDO = 980;

// Hook: lee el tamaño de la ventana y decide qué distribución usar
export function useLayout() {
  const { width } = useWindowDimensions();
  const esAncho = width >= ANCHO_MINIMO_ESCRITORIO;
  const disponible = esAncho ? width - ANCHO_BARRA_LATERAL : width;
  return { esAncho, anchoContenido: Math.min(disponible, ANCHO_MAXIMO_CONTENIDO) };
}
