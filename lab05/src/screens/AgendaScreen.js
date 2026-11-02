// AgendaScreen.js — SectionList con dos secciones: asistencia a clases y próximas entregas
import React from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../theme';
import { useDatos } from '../context/DataContext';
import { Tarjeta, Chip, Encabezado } from '../components/Basicos';
import Boton from '../components/Boton';
import { generarSesiones } from '../constants/horario';
import { formatearFecha, textoFechaRelativa, diasRestantes, infoPrioridad } from '../utils/fechas';

export default function AgendaScreen() {
  const t = useTema();
  const { cursos, tareas, asistencias, confirmarAsistencia } = useDatos();
  const cursosPorId = Object.fromEntries(cursos.map((c) => [c.id, c]));

  // Solo se muestran las sesiones NO confirmadas: al pulsar "Asistiré" desaparecen
  const sesiones = generarSesiones(cursos, asistencias, 7).filter((s) => !s.confirmada);
  const entregas = tareas
    .filter((x) => !x.completada)
    .sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega))
    .map((x) => ({ ...x, kind: 'tarea' }));

  const secciones = [
    { clave: 'asistencia', titulo: 'Asistencia a clases', data: sesiones, vacio: 'Sin clases pendientes de confirmar en los próximos días.' },
    { clave: 'entregas', titulo: 'Próximas entregas', data: entregas, vacio: 'No hay entregas pendientes. ¡Vas al día!' },
  ];

  const renderItem = ({ item }) => {
    if (item.kind === 'sesion') {
      return (
        <Tarjeta acento={item.curso.color} style={item.vencida && { opacity: 0.85 }}>
          <Text style={[estilos.titulo, { color: t.texto }]}>{item.curso.nombre}</Text>
          <View style={estilos.meta}>
            <Chip texto={item.tipo === 'laboratorio' ? 'Laboratorio' : 'Teoría'} />
            <Chip texto={`${formatearFecha(item.fecha)} · ${item.bloque.inicio}-${item.bloque.fin}`} />
            {item.vencida ? <Chip texto="Vencido" tono="peligro" /> : null}
          </View>
          <View style={estilos.accion}>
            <Boton
              compacto
              variante={item.vencida ? 'fantasma' : 'primario'}
              icono="checkmark"
              titulo={item.vencida ? 'Marcar asistencia' : 'Asistiré'}
              onPress={() => confirmarAsistencia(item.clave)}
            />
          </View>
        </Tarjeta>
      );
    }
    const curso = cursosPorId[item.cursoId];
    const prio = infoPrioridad(item.prioridad);
    const vencida = diasRestantes(item.fechaEntrega) < 0;
    return (
      <Tarjeta acento={curso?.color}>
        <Text style={[estilos.titulo, { color: t.texto }]}>{item.titulo}</Text>
        <Text style={{ color: t.sutil, fontSize: 12, marginTop: 2 }}>{curso?.nombre}</Text>
        <View style={estilos.meta}>
          <Chip texto={`${formatearFecha(item.fechaEntrega)} · ${textoFechaRelativa(item.fechaEntrega)}`} tono={vencida ? 'peligro' : 'neutro'} />
          <Chip texto={prio.etiqueta} tono={prio.tono} />
        </View>
      </Tarjeta>
    );
  };

  return (
    <SectionList
      sections={secciones}
      keyExtractor={(item) => item.clave || item.id}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={<Encabezado titulo="Agenda" />}
      renderSectionHeader={({ section }) => (
        <View style={estilos.seccion}>
          <Ionicons name={section.clave === 'asistencia' ? 'school-outline' : 'flag-outline'} size={18} color={t.primario} />
          <Text style={[estilos.seccionTexto, { color: t.texto }]}>{section.titulo}</Text>
        </View>
      )}
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? <Text style={{ color: t.sutil, marginBottom: 16 }}>{section.vacio}</Text> : null
      }
      contentContainerStyle={estilos.lista}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { padding: 16, paddingBottom: 32 },
  seccion: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 10 },
  seccionTexto: { fontSize: 18, fontWeight: '800' },
  titulo: { fontSize: 15, fontWeight: '700' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  accion: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
});
