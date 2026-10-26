// App.js — Punto de entrada de U-Plan móvil: estado global, pantalla activa y barra inferior
import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema, TemaProvider } from './src/theme';
import { DataProvider, useDatos } from './src/context/DataContext';
import BarraPestanas, { BarraLateral } from './src/components/BarraPestanas';
import { useLayout, ANCHO_MAXIMO_CONTENIDO } from './src/layout';
import InicioScreen from './src/screens/InicioScreen';
import CursosScreen from './src/screens/CursosScreen';
import TareasScreen from './src/screens/TareasScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const PANTALLAS = {
  inicio: InicioScreen,
  cursos: CursosScreen,
  tareas: TareasScreen,
  agenda: AgendaScreen,
  perfil: PerfilScreen,
};

function Contenido() {
  const t = useTema();
  const insets = useSafeAreaInsets();
  const { cargando } = useDatos();
  const { esAncho } = useLayout();
  const [pestana, setPestana] = useState('inicio');
  const Pantalla = PANTALLAS[pestana];

  return (
    <View style={[estilos.raiz, { backgroundColor: t.fondo, paddingTop: insets.top }]}>
      <StatusBar style={t.esOscuro ? 'light' : 'dark'} />
      {cargando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={t.primario} />
        </View>
      ) : (
        esAncho ? (
          <View style={estilos.filaAncha}>
            <BarraLateral activa={pestana} onCambiar={setPestana} />
            <View style={estilos.areaAncha}>
              <View style={estilos.contenidoAncho}>
                <Pantalla />
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={estilos.pantalla}>
              <Pantalla />
            </View>
            <BarraPestanas activa={pestana} onCambiar={setPestana} />
          </>
        )
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <DataProvider>
          <Contenido />
        </DataProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  pantalla: { flex: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  filaAncha: { flex: 1, flexDirection: 'row' },
  areaAncha: { flex: 1, alignItems: 'center' },
  contenidoAncho: { flex: 1, width: '100%', maxWidth: ANCHO_MAXIMO_CONTENIDO },
});
