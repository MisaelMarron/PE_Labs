// CursosScreen.js — Cursos en tarjetas (FlatList) y horario semanal por bloques (ScrollView)
import React, { useState } from 'react';
import { FlatList, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTema, hexARgba, COLORES_CURSO } from '../theme';
import { useDatos } from '../context/DataContext';
import { Tarjeta, Chip, IconoBoton, EstadoVacio, Encabezado } from '../components/Basicos';
import { ModalBase, ConfirmModal, Campo, SelectorOpciones, SelectorColor } from '../components/Formularios';
import Boton from '../components/Boton';
import { DIAS, BLOQUES, resumenHorario } from '../constants/horario';
import { useLayout } from '../layout';

const ANCHO_HORA = 58;
const ANCHO_CELDA_MOVIL = 96;
const ALTO_CELDA = 58;

const TIPOS = [
  { valor: 'teoria', etiqueta: 'Teoría' },
  { valor: 'laboratorio', etiqueta: 'Laboratorio' },
];

// --- Formulario de curso -----------------------------------------------------
function FormularioCurso({ curso, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState(curso?.nombre ?? '');
  const [docente, setDocente] = useState(curso?.docente ?? '');
  const [color, setColor] = useState(curso?.color ?? COLORES_CURSO[0]);
  const [intento, setIntento] = useState(false);

  const guardar = () => {
    setIntento(true);
    if (!nombre.trim() || !docente.trim()) return;
    onGuardar({ nombre: nombre.trim(), docente: docente.trim(), color });
  };

  return (
    <>
      <Campo etiqueta="Nombre del curso" value={nombre} onChangeText={setNombre} placeholder="Ej. Cálculo III" error={intento && !nombre.trim() ? 'Escribe el nombre' : null} />
      <Campo etiqueta="Docente" value={docente} onChangeText={setDocente} placeholder="Ej. Ing. Juan Pérez" error={intento && !docente.trim() ? 'Escribe el docente' : null} />
      <SelectorColor etiqueta="Color distintivo" colores={COLORES_CURSO} valor={color} onChange={setColor} />
      <View style={estilos.acciones}>
        <Boton titulo="Cancelar" variante="fantasma" onPress={onCerrar} />
        <Boton titulo="Guardar" onPress={guardar} />
      </View>
    </>
  );
}

// --- Formulario de una celda del horario ----------------------------------------
function FormularioBloque({ asignacion, cursos, onGuardar, onQuitar, onCerrar }) {
  const [cursoId, setCursoId] = useState(asignacion?.curso.id ?? cursos[0]?.id);
  const [tipo, setTipo] = useState(asignacion?.tipo ?? 'teoria');

  return (
    <>
      <SelectorOpciones
        etiqueta="Curso"
        opciones={cursos.map((c) => ({ valor: c.id, etiqueta: c.nombre.replace(/ \(E\)/, ''), color: c.color }))}
        valor={cursoId}
        onChange={setCursoId}
      />
      <SelectorOpciones etiqueta="Tipo de sesión" opciones={TIPOS} valor={tipo} onChange={setTipo} />
      <View style={estilos.acciones}>
        {asignacion ? <Boton titulo="Quitar" variante="peligro" onPress={onQuitar} /> : null}
        <Boton titulo="Cancelar" variante="fantasma" onPress={onCerrar} />
        <Boton titulo="Guardar" onPress={() => onGuardar(cursoId, tipo)} deshabilitado={!cursoId} />
      </View>
    </>
  );
}

// --- Grilla de horario ----------------------------------------------------------
function GrillaHorario({ cursos, onTocarCelda, anchoCelda }) {
  const t = useTema();
  const ANCHO_CELDA = anchoCelda;

  // Busca qué curso ocupa una celda (día + bloque)
  const buscar = (dia, bloqueId) => {
    for (const curso of cursos) {
      const b = (curso.bloques || []).find((x) => x.dia === dia && x.bloqueId === bloqueId);
      if (b) return { curso, tipo: b.tipo };
    }
    return null;
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        <View style={estilos.filaGrilla}>
          <View style={{ width: ANCHO_HORA }} />
          {DIAS.map((d) => (
            <View key={d.id} style={[estilos.cabeceraDia, { width: ANCHO_CELDA, backgroundColor: t.superficieAlt, borderColor: t.borde }]}>
              <Text style={{ color: t.sutil, fontWeight: '700', fontSize: 12 }}>{d.etiqueta}</Text>
            </View>
          ))}
        </View>

        {BLOQUES.map((bloque) => (
          <View key={bloque.id} style={estilos.filaGrilla}>
            <View style={[estilos.celdaHora, { width: ANCHO_HORA, backgroundColor: t.superficieAlt, borderColor: t.borde }]}>
              <Text style={[estilos.textoHora, { color: t.sutil }]}>{bloque.inicio}</Text>
              <Text style={[estilos.textoHora, { color: t.sutil }]}>{bloque.fin}</Text>
            </View>
            {DIAS.map((dia) => {
              const asignacion = buscar(dia.id, bloque.id);
              return (
                <Pressable
                  key={dia.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${dia.etiqueta} ${bloque.inicio}`}
                  onPress={() => onTocarCelda(dia.id, bloque.id, asignacion)}
                  style={[
                    estilos.celda,
                    { width: ANCHO_CELDA, borderColor: t.borde, backgroundColor: asignacion ? hexARgba(asignacion.curso.color, 0.18) : t.superficie },
                    asignacion && { borderLeftColor: asignacion.curso.color, borderLeftWidth: 3 },
                  ]}
                >
                  {asignacion ? (
                    <>
                      <Text numberOfLines={2} style={[estilos.nombreCelda, { color: t.texto }]}>{asignacion.curso.nombre.replace(/ \(E\)/, '')}</Text>
                      <Text style={{ color: t.sutil, fontSize: 9 }}>{asignacion.tipo === 'laboratorio' ? 'Lab' : 'Teoría'}</Text>
                    </>
                  ) : (
                    <Text style={{ color: t.sutil, opacity: 0.4, fontSize: 18 }}>+</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// --- Pantalla principal ----------------------------------------------------------
export default function CursosScreen() {
  const t = useTema();
  const { esAncho, anchoContenido } = useLayout();
  const { cursos, tareas, agregarCurso, actualizarCurso, eliminarCurso, asignarBloque, quitarBloque } = useDatos();
  const [modo, setModo] = useState('tarjetas'); // 'tarjetas' | 'horario'
  const [editando, setEditando] = useState(null); // null | 'nuevo' | curso
  const [porEliminar, setPorEliminar] = useState(null);
  const [celda, setCelda] = useState(null); // { dia, bloqueId, asignacion }

  const guardarCurso = (datos) => {
    if (editando === 'nuevo') agregarCurso(datos);
    else actualizarCurso(editando.id, datos);
    setEditando(null);
  };

  const cabecera = (
    <View>
      <Encabezado titulo="Mis cursos" derecha={<Boton compacto icono="add" titulo="Nuevo" onPress={() => setEditando('nuevo')} />} />
      <View style={estilos.segmentos}>
        {[['tarjetas', 'Tarjetas'], ['horario', 'Horario']].map(([valor, etiqueta]) => {
          const activo = modo === valor;
          return (
            <Pressable
              key={valor}
              role="tab"
              aria-selected={activo}
              onPress={() => setModo(valor)}
              style={[estilos.segmento, { backgroundColor: activo ? t.primario : t.superficie, borderColor: activo ? t.primario : t.borde }]}
            >
              <Text style={{ color: activo ? '#fff' : t.sutil, fontWeight: '700', fontSize: 13 }}>{etiqueta}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderCurso = ({ item }) => {
    const mias = tareas.filter((x) => x.cursoId === item.id);
    const pendientes = mias.filter((x) => !x.completada).length;
    return (
      <View style={{ flex: 1, maxWidth: esAncho ? '50%' : '100%' }}>
      <Tarjeta acento={item.color}>
        <View style={estilos.filaTitulo}>
          <Text style={[estilos.nombre, { color: t.texto }]}>{item.nombre}</Text>
          <View style={{ flexDirection: 'row' }}>
            <IconoBoton nombre="create-outline" etiqueta="Editar curso" onPress={() => setEditando(item)} />
            <IconoBoton nombre="trash-outline" etiqueta="Eliminar curso" onPress={() => setPorEliminar(item)} />
          </View>
        </View>
        <Text style={{ color: t.sutil, fontSize: 13 }}>{item.docente}</Text>
        {item.codigo ? <Text style={{ color: t.sutil, fontSize: 12, marginTop: 2 }}>Código {item.codigo} · {item.creditos} créditos</Text> : null}
        <Text style={{ color: t.sutil, fontSize: 12, marginTop: 8 }}>{resumenHorario(item)}</Text>
        <View style={estilos.chips}>
          <Chip texto={`${mias.length} tarea${mias.length === 1 ? '' : 's'}`} />
          <Chip texto={`${pendientes} pendiente${pendientes === 1 ? '' : 's'}`} tono={pendientes > 0 ? 'adv' : 'exito'} />
        </View>
      </Tarjeta>
      </View>
    );
  };

  return (
    <>
      {modo === 'tarjetas' ? (
        <FlatList
          key={esAncho ? 'dos-columnas' : 'una-columna'}
          numColumns={esAncho ? 2 : 1}
          columnWrapperStyle={esAncho ? { gap: 12 } : undefined}
          data={cursos}
          keyExtractor={(c) => c.id}
          renderItem={renderCurso}
          ListHeaderComponent={cabecera}
          ListEmptyComponent={<EstadoVacio titulo="Aún no tienes cursos" texto="Agrega tu primer curso con el botón Nuevo." />}
          contentContainerStyle={estilos.lista}
        />
      ) : (
        <ScrollView contentContainerStyle={estilos.lista}>
          {cabecera}
          <Text style={{ color: t.sutil, fontSize: 13, marginBottom: 10 }}>Toca una celda para asignar o quitar un curso.</Text>
          <GrillaHorario
            anchoCelda={esAncho ? Math.floor((anchoContenido - 32 - ANCHO_HORA) / 5) : ANCHO_CELDA_MOVIL}
            cursos={cursos}
            onTocarCelda={(dia, bloqueId, asignacion) => setCelda({ dia, bloqueId, asignacion })} />
        </ScrollView>
      )}

      <ModalBase visible={editando !== null} titulo={editando === 'nuevo' ? 'Nuevo curso' : 'Editar curso'} onCerrar={() => setEditando(null)}>
        {editando !== null && (
          <FormularioCurso curso={editando === 'nuevo' ? null : editando} onGuardar={guardarCurso} onCerrar={() => setEditando(null)} />
        )}
      </ModalBase>

      <ModalBase
        visible={celda !== null}
        titulo={celda ? `${DIAS.find((d) => d.id === celda.dia).etiqueta} · ${BLOQUES[celda.bloqueId].inicio}-${BLOQUES[celda.bloqueId].fin}` : ''}
        onCerrar={() => setCelda(null)}
      >
        {celda !== null && (
          <FormularioBloque
            asignacion={celda.asignacion}
            cursos={cursos}
            onGuardar={(cursoId, tipo) => { asignarBloque(cursoId, celda.dia, celda.bloqueId, tipo); setCelda(null); }}
            onQuitar={() => { quitarBloque(celda.dia, celda.bloqueId); setCelda(null); }}
            onCerrar={() => setCelda(null)}
          />
        )}
      </ModalBase>

      <ConfirmModal
        visible={porEliminar !== null}
        titulo="Eliminar curso"
        mensaje={`¿Eliminar "${porEliminar?.nombre ?? ''}"? También se eliminarán sus tareas.`}
        onConfirmar={() => { eliminarCurso(porEliminar.id); setPorEliminar(null); }}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

const estilos = StyleSheet.create({
  lista: { padding: 16, paddingBottom: 32 },
  segmentos: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  segmento: { paddingHorizontal: 18, minHeight: 40, borderRadius: 999, borderWidth: 1, justifyContent: 'center' },
  filaTitulo: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  nombre: { flex: 1, fontSize: 16, fontWeight: '800', paddingTop: 10, paddingRight: 4 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 12 },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  filaGrilla: { flexDirection: 'row' },
  cabeceraDia: { height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  celdaHora: { height: ALTO_CELDA, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  textoHora: { fontSize: 10, fontWeight: '600' },
  celda: { height: ALTO_CELDA, alignItems: 'center', justifyContent: 'center', padding: 4, borderWidth: StyleSheet.hairlineWidth },
  nombreCelda: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
});
