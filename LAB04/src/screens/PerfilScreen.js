// PerfilScreen.js — Datos del estudiante e integrantes, con reinicio de datos
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema, useControlTema } from '../theme';
import { useDatos } from '../context/DataContext';
import { Tarjeta, Encabezado } from '../components/Basicos';
import { Campo, ConfirmModal, SelectorOpciones } from '../components/Formularios';
import Boton from '../components/Boton';

export default function PerfilScreen() {
  const t = useTema();
  const { perfil, guardarPerfil, reiniciarDatos } = useDatos();
  const { preferencia, setPreferencia } = useControlTema();
  const [form, setForm] = useState({ ...perfil, integrantes: perfil.integrantes.join('\n') });
  const [guardado, setGuardado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const cambiar = (campo) => (texto) => setForm((f) => ({ ...f, [campo]: texto }));

  const guardar = () => {
    guardarPerfil({
      ...form,
      nombre: form.nombre.trim(),
      integrantes: form.integrantes.split('\n').map((l) => l.trim()).filter(Boolean),
    });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  // Si el perfil cambia (por guardar o por reiniciar), el formulario se sincroniza
  useEffect(() => {
    setForm({ ...perfil, integrantes: perfil.integrantes.join('\n') });
  }, [perfil]);

  const reiniciar = () => {
    reiniciarDatos();
    setConfirmando(false);
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
      <Encabezado titulo="Mi perfil" />

      <Tarjeta>
        <View style={estilos.cabeceraPerfil}>
          <View style={[estilos.avatar, { backgroundColor: t.primarioSuave }]}>
            <Ionicons name="person" size={30} color={t.primario} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[estilos.nombre, { color: t.texto }]}>{perfil.nombre || 'Estudiante'}</Text>
            <Text style={{ color: t.sutil, fontSize: 13 }}>{perfil.carrera} · {perfil.ciclo}</Text>
          </View>
        </View>
      </Tarjeta>

      <Tarjeta>
        <Text style={[estilos.seccion, { color: t.texto }]}>Datos del estudiante</Text>
        <Campo etiqueta="Nombre" value={form.nombre} onChangeText={cambiar('nombre')} />
        <Campo etiqueta="Universidad" value={form.universidad} onChangeText={cambiar('universidad')} />
        <Campo etiqueta="Carrera" value={form.carrera} onChangeText={cambiar('carrera')} />
        <Campo etiqueta="Ciclo" value={form.ciclo} onChangeText={cambiar('ciclo')} />
        <Campo etiqueta="Correo" value={form.correo} onChangeText={cambiar('correo')} keyboardType="email-address" autoCapitalize="none" placeholder="correo@ejemplo.com" />
        <Campo etiqueta="Integrantes del equipo (uno por línea)" multilinea value={form.integrantes} onChangeText={cambiar('integrantes')} />
        <View style={estilos.filaGuardar}>
          {guardado ? <Text style={{ color: t.exito, fontWeight: '700' }}>Guardado</Text> : <View />}
          <Boton titulo="Guardar cambios" icono="save-outline" onPress={guardar} />
        </View>
      </Tarjeta>

      <Tarjeta>
        <Text style={[estilos.seccion, { color: t.texto }]}>Integrantes registrados</Text>
        {perfil.integrantes.length === 0 ? (
          <Text style={{ color: t.sutil }}>Aún no registras integrantes.</Text>
        ) : (
          perfil.integrantes.map((nombre) => (
            <View key={nombre} style={estilos.integrante}>
              <Ionicons name="person-outline" size={16} color={t.primario} />
              <Text style={{ color: t.texto, fontSize: 14 }}>{nombre}</Text>
            </View>
          ))
        )}
      </Tarjeta>

      <Tarjeta>
        <Text style={[estilos.seccion, { color: t.texto }]}>Apariencia</Text>
        <SelectorOpciones
          opciones={[
            { valor: 'auto', etiqueta: 'Automático' },
            { valor: 'claro', etiqueta: 'Claro' },
            { valor: 'oscuro', etiqueta: 'Oscuro' },
          ]}
          valor={preferencia}
          onChange={setPreferencia}
        />
      </Tarjeta>

      <Tarjeta>
        <Text style={[estilos.seccion, { color: t.texto }]}>Reiniciar datos</Text>
        <Text style={{ color: t.sutil, fontSize: 13, marginBottom: 12 }}>
          Elimina cursos, tareas, asistencias y perfil guardados en este dispositivo y vuelve a cargar los datos de ejemplo.
        </Text>
        <Boton titulo="Reiniciar todos los datos" variante="peligro" icono="trash-outline" onPress={() => setConfirmando(true)} />
      </Tarjeta>

      <ConfirmModal
        visible={confirmando}
        titulo="¿Reiniciar todo?"
        mensaje="Se perderán tus cursos, tareas y perfil actuales."
        textoConfirmar="Reiniciar"
        onConfirmar={reiniciar}
        onCancelar={() => setConfirmando(false)}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 32 },
  cabeceraPerfil: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  nombre: { fontSize: 20, fontWeight: '800' },
  seccion: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  integrante: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  filaGuardar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
});
