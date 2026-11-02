// TareasScreen.js — Lista de tareas (FlatList) con filtros, checkbox y alta/edición/baja
import React, { useState } from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../theme';
import { useDatos } from '../context/DataContext';
import { Tarjeta, Chip, IconoBoton, EstadoVacio, Encabezado } from '../components/Basicos';
import { ModalBase, ConfirmModal, Campo, SelectorOpciones } from '../components/Formularios';
import Boton from '../components/Boton';
import {
  diasRestantes, formatearFecha, textoFechaRelativa, infoPrioridad,
  esFechaValida, fechaISOLocal, sumarDias,
} from '../utils/fechas';

const FILTROS = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'pendientes', etiqueta: 'Pendientes' },
  { valor: 'completadas', etiqueta: 'Completadas' },
];

const PRIORIDADES = [
  { valor: 'alta', etiqueta: 'Alta' },
  { valor: 'media', etiqueta: 'Media' },
  { valor: 'baja', etiqueta: 'Baja' },
];

// Formulario modal para crear o editar una tarea
function FormularioTarea({ tarea, cursos, onGuardar, onCerrar }) {
  const [titulo, setTitulo] = useState(tarea?.titulo ?? '');
  const [cursoId, setCursoId] = useState(tarea?.cursoId ?? cursos[0]?.id);
  const [fecha, setFecha] = useState(tarea?.fechaEntrega ?? fechaISOLocal());
  const [prioridad, setPrioridad] = useState(tarea?.prioridad ?? 'media');
  const [intento, setIntento] = useState(false);

  const errorTitulo = intento && !titulo.trim() ? 'Escribe un título' : null;
  const errorFecha = intento && !esFechaValida(fecha) ? 'Usa el formato AAAA-MM-DD' : null;

  const guardar = () => {
    setIntento(true);
    if (!titulo.trim() || !esFechaValida(fecha) || !cursoId) return;
    onGuardar({ titulo: titulo.trim(), cursoId, fechaEntrega: fecha, prioridad });
  };

  return (
    <>
      <Campo etiqueta="Título de la tarea" value={titulo} onChangeText={setTitulo} placeholder="Ej. Informe de laboratorio" error={errorTitulo} />
      <SelectorOpciones
        etiqueta="Curso"
        opciones={cursos.map((c) => ({ valor: c.id, etiqueta: c.nombre.replace(/ \(E\)/, ''), color: c.color }))}
        valor={cursoId}
        onChange={setCursoId}
      />
      <Campo etiqueta="Fecha de entrega (AAAA-MM-DD)" value={fecha} onChangeText={setFecha} placeholder="2026-10-31" error={errorFecha} />
      <View style={estilos.atajos}>
        <Boton compacto variante="fantasma" titulo="Hoy" onPress={() => setFecha(fechaISOLocal())} />
        <Boton compacto variante="fantasma" titulo="Mañana" onPress={() => setFecha(sumarDias(fechaISOLocal(), 1))} />
        <Boton compacto variante="fantasma" titulo="+7 días" onPress={() => setFecha(sumarDias(fechaISOLocal(), 7))} />
      </View>
      <SelectorOpciones etiqueta="Prioridad" opciones={PRIORIDADES} valor={prioridad} onChange={setPrioridad} />
      <View style={estilos.acciones}>
        <Boton titulo="Cancelar" variante="fantasma" onPress={onCerrar} />
        <Boton titulo="Guardar" onPress={guardar} />
      </View>
    </>
  );
}

export default function TareasScreen() {
  const t = useTema();
  const { cursos, tareas, agregarTarea, actualizarTarea, eliminarTarea, alternarTarea } = useDatos();
  const [filtro, setFiltro] = useState('todas');
  const [editando, setEditando] = useState(null); // null | 'nueva' | objeto tarea
  const [porEliminar, setPorEliminar] = useState(null);
  const cursosPorId = Object.fromEntries(cursos.map((c) => [c.id, c]));

  const visibles = tareas
    .filter((x) => (filtro === 'pendientes' ? !x.completada : filtro === 'completadas' ? x.completada : true))
    .sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega));

  const guardar = (datos) => {
    if (editando === 'nueva') agregarTarea(datos);
    else actualizarTarea(editando.id, datos);
    setEditando(null);
  };

  const renderTarea = ({ item }) => {
    const curso = cursosPorId[item.cursoId];
    const prio = infoPrioridad(item.prioridad);
    const vencida = !item.completada && diasRestantes(item.fechaEntrega) < 0;
    return (
      <Tarjeta acento={curso?.color} style={item.completada && { opacity: 0.55 }}>
        <View style={estilos.fila}>
          <Pressable
            role="checkbox"
            aria-checked={item.completada}
            accessibilityLabel={`Completar ${item.titulo}`}
            onPress={() => alternarTarea(item.id)}
            style={estilos.zonaCheck}
          >
            <View style={[estilos.check, { borderColor: item.completada ? t.exito : t.borde, backgroundColor: item.completada ? t.exito : 'transparent' }]}>
              {item.completada ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
            </View>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[estilos.titulo, { color: t.texto }, item.completada && { textDecorationLine: 'line-through' }]}>{item.titulo}</Text>
            <Text style={{ color: t.sutil, fontSize: 12, marginTop: 2 }}>{curso?.nombre ?? 'Sin curso'}</Text>
            <View style={estilos.meta}>
              <Chip
                texto={`${formatearFecha(item.fechaEntrega)} · ${textoFechaRelativa(item.fechaEntrega)}`}
                tono={vencida ? 'peligro' : 'neutro'}
              />
              <Chip texto={prio.etiqueta} tono={prio.tono} />
            </View>
          </View>
          <View>
            <IconoBoton nombre="create-outline" etiqueta="Editar tarea" onPress={() => setEditando(item)} />
            <IconoBoton nombre="trash-outline" etiqueta="Eliminar tarea" onPress={() => setPorEliminar(item)} />
          </View>
        </View>
      </Tarjeta>
    );
  };

  const cabecera = (
    <View>
      <Encabezado titulo="Mis tareas" derecha={<Boton compacto icono="add" titulo="Nueva" onPress={() => setEditando('nueva')} />} />
      <View style={estilos.filtros}>
        {FILTROS.map((f) => {
          const activo = f.valor === filtro;
          return (
            <Pressable
              key={f.valor}
              role="tab"
              aria-selected={activo}
              onPress={() => setFiltro(f.valor)}
              style={[estilos.filtro, { backgroundColor: activo ? t.primario : t.superficie, borderColor: activo ? t.primario : t.borde }]}
            >
              <Text style={{ color: activo ? '#fff' : t.sutil, fontWeight: '700', fontSize: 13 }}>{f.etiqueta}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={visibles}
        keyExtractor={(item) => item.id}
        renderItem={renderTarea}
        ListHeaderComponent={cabecera}
        ListEmptyComponent={<EstadoVacio titulo="No hay tareas aquí" texto="Agrega una tarea con el botón Nueva." />}
        contentContainerStyle={estilos.lista}
      />

      <ModalBase visible={editando !== null} titulo={editando === 'nueva' ? 'Nueva tarea' : 'Editar tarea'} onCerrar={() => setEditando(null)}>
        {editando !== null && (
          <FormularioTarea
            tarea={editando === 'nueva' ? null : editando}
            cursos={cursos}
            onGuardar={guardar}
            onCerrar={() => setEditando(null)}
          />
        )}
      </ModalBase>

      <ConfirmModal
        visible={porEliminar !== null}
        titulo="Eliminar tarea"
        mensaje={`¿Eliminar "${porEliminar?.titulo ?? ''}"?`}
        onConfirmar={() => { eliminarTarea(porEliminar.id); setPorEliminar(null); }}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

const estilos = StyleSheet.create({
  lista: { padding: 16, paddingBottom: 32 },
  filtros: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filtro: { paddingHorizontal: 16, minHeight: 40, borderRadius: 999, borderWidth: 1, justifyContent: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center' },
  zonaCheck: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 4, marginLeft: -8 },
  check: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 15, fontWeight: '700' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  atajos: { flexDirection: 'row', gap: 8, marginBottom: 14, marginTop: -4 },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
});
