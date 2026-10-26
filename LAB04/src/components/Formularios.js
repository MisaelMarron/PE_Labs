// Formularios.js — Modal base, modal de confirmación, campo de texto y selector de opciones
import React from 'react';
import { Modal, View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../theme';
import Boton from './Boton';
import { IconoBoton } from './Basicos';

// Ventana modal que sube desde abajo (hoja inferior). Se cierra tocando el fondo.
export function ModalBase({ visible, titulo, onCerrar, children }) {
  const t = useTema();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <KeyboardAvoidingView style={estilos.contenedor} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCerrar} accessibilityLabel="Cerrar ventana">
          <View style={estilos.fondo} />
        </Pressable>
        <View style={[estilos.hoja, { backgroundColor: t.superficie }]}>
          <View style={estilos.cabecera}>
            <Text style={[estilos.tituloModal, { color: t.texto }]}>{titulo}</Text>
            <IconoBoton nombre="close" etiqueta="Cerrar" onPress={onCerrar} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.cuerpo}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function ConfirmModal({ visible, titulo, mensaje, textoConfirmar = 'Eliminar', onConfirmar, onCancelar }) {
  const t = useTema();
  return (
    <ModalBase visible={visible} titulo={titulo} onCerrar={onCancelar}>
      <Text style={{ color: t.sutil, fontSize: 14, lineHeight: 20, marginBottom: 16 }}>{mensaje}</Text>
      <View style={estilos.acciones}>
        <Boton titulo="Cancelar" variante="fantasma" onPress={onCancelar} />
        <Boton titulo={textoConfirmar} variante="peligro" onPress={onConfirmar} />
      </View>
    </ModalBase>
  );
}

// Etiqueta + TextInput
export function Campo({ etiqueta, error, multilinea, ...props }) {
  const t = useTema();
  return (
    <View style={estilos.campo}>
      <Text style={[estilos.etiqueta, { color: t.sutil }]}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor={t.sutil}
        multiline={multilinea}
        style={[
          estilos.input,
          { backgroundColor: t.fondo, color: t.texto, borderColor: error ? t.peligro : t.borde },
          multilinea && { minHeight: 80, textAlignVertical: 'top' },
        ]}
        {...props}
      />
      {error ? <Text style={{ color: t.peligro, fontSize: 12, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}

// Grupo de "píldoras" para elegir una opción. opciones: [{ valor, etiqueta, color? }]
export function SelectorOpciones({ etiqueta, opciones, valor, onChange }) {
  const t = useTema();
  return (
    <View style={estilos.campo}>
      {etiqueta ? <Text style={[estilos.etiqueta, { color: t.sutil }]}>{etiqueta}</Text> : null}
      <View style={estilos.pildoras}>
        {opciones.map((op) => {
          const activa = op.valor === valor;
          const color = op.color || t.primario;
          return (
            <Pressable
              key={op.valor}
              role="radio"
              aria-checked={activa}
              onPress={() => onChange(op.valor)}
              style={[
                estilos.pildora,
                { borderColor: activa ? color : t.borde, backgroundColor: activa ? color : t.superficie },
              ]}
            >
              {activa ? <Ionicons name="checkmark" size={14} color="#fff" style={{ marginRight: 4 }} /> : null}
              <Text style={{ color: activa ? '#fff' : t.texto, fontSize: 13, fontWeight: '600' }}>{op.etiqueta}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Selector de color circular para los cursos
export function SelectorColor({ etiqueta, colores, valor, onChange }) {
  const t = useTema();
  return (
    <View style={estilos.campo}>
      <Text style={[estilos.etiqueta, { color: t.sutil }]}>{etiqueta}</Text>
      <View style={estilos.pildoras}>
        {colores.map((c) => (
          <Pressable
            key={c}
            role="radio"
            aria-checked={c === valor}
            accessibilityLabel={`Color ${c}`}
            onPress={() => onChange(c)}
            style={[estilos.circulo, { backgroundColor: c, borderColor: c === valor ? t.texto : 'transparent' }]}
          >
            {c === valor ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'flex-end' },
  fondo: { flex: 1, backgroundColor: 'rgba(15, 16, 28, 0.55)' },
  hoja: { maxHeight: '88%', borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingTop: 8 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 8 },
  tituloModal: { fontSize: 18, fontWeight: '800', flexShrink: 1 },
  cuerpo: { padding: 20, paddingTop: 8, paddingBottom: 32 },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  campo: { marginBottom: 14 },
  etiqueta: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, minHeight: 44 },
  pildoras: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pildora: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, minHeight: 40 },
  circulo: { width: 40, height: 40, borderRadius: 20, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
});
