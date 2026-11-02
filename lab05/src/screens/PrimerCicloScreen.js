import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../theme';
import { useDatos } from '../context/DataContext';
import { Tarjeta, Encabezado } from '../components/Basicos';
import { fechaISOLocal } from '../utils/fechas';

const PASOS = [
  { id: 'perfil', titulo: 'Personaliza tu perfil', detalle: 'Indica tu nombre y carrera.', destino: 'perfil' },
  { id: 'cursos', titulo: 'Revisa tus cursos', detalle: 'Agrega o corrige los cursos de este ciclo.', destino: 'cursos' },
  { id: 'horario', titulo: 'Organiza tu horario', detalle: 'Asigna las clases a los días y bloques.', destino: 'cursos' },
  { id: 'tarea', titulo: 'Anota tu primera entrega', detalle: 'Registra una tarea y su fecha límite.', destino: 'tareas' },
];

const RECURSOS = [
  { id: 'tutoria', icono: 'people-outline', titulo: 'Tutoría académica', detalle: 'Si un curso se vuelve difícil, consulta con su docente o con la coordinación de tu escuela sobre tutorías disponibles.' },
  { id: 'bienestar', icono: 'heart-outline', titulo: 'Bienestar universitario', detalle: 'Si el estrés o una dificultad personal afecta tus estudios, busca los canales oficiales de bienestar de tu universidad.' },
  { id: 'biblioteca', icono: 'library-outline', titulo: 'Biblioteca y materiales', detalle: 'Consulta los recursos de biblioteca y los materiales recomendados por tus docentes antes de una evaluación.' },
];

function fechaDeSemana(inicio, dias) {
  const fecha = new Date(inicio);
  fecha.setDate(fecha.getDate() + dias);
  return fechaISOLocal(fecha);
}

export default function PrimerCicloScreen({ onNavegar }) {
  const t = useTema();
  const { cursos, tareas, primerCiclo, alternarPasoInicial, completarInicio } = useDatos();
  const [recurso, setRecurso] = useState(null);
  const semana = useMemo(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return dias.map((nombre, indice) => {
      const fecha = fechaDeSemana(lunes, indice);
      const delDia = tareas.filter((tarea) => !tarea.completada && tarea.fechaEntrega === fecha);
      return { nombre, fecha, tareas: delDia };
    });
  }, [tareas]);
  const pendientes = tareas.filter((tarea) => !tarea.completada);
  const vencidas = pendientes.filter((tarea) => tarea.fechaEntrega < fechaISOLocal());
  const completados = primerCiclo.pasos.length;

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Encabezado titulo="Primer Ciclo" />
      <Text style={[estilos.intro, { color: t.sutil }]}>Organiza tus primeras semanas con pasos pequeños y una vista clara de tus entregas.</Text>

      <Tarjeta>
        <Text style={[estilos.titulo, { color: t.texto }]}>Tu punto de partida</Text>
        <Text style={[estilos.parrafo, { color: t.sutil }]}>{completados} de {PASOS.length} pasos preparados. Puedes revisarlos cuando cambie tu horario.</Text>
        {PASOS.map((paso) => {
          const hecho = primerCiclo.pasos.includes(paso.id);
          return <View key={paso.id} style={[estilos.paso, { borderColor: t.borde }]}>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: hecho }} onPress={() => alternarPasoInicial(paso.id)} style={estilos.check}>
              <Ionicons name={hecho ? 'checkbox' : 'square-outline'} size={25} color={t.primario} />
            </Pressable>
            <View style={{ flex: 1 }}><Text style={[estilos.pasoTitulo, { color: t.texto }]}>{paso.titulo}</Text><Text style={{ color: t.sutil, fontSize: 12 }}>{paso.detalle}</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Ir a ${paso.titulo}`} onPress={() => onNavegar(paso.destino)}><Ionicons name="arrow-forward-circle-outline" size={24} color={t.primario} /></Pressable>
          </View>;
        })}
        {completados === PASOS.length && !primerCiclo.inicioCompleto && <Pressable onPress={completarInicio} style={[estilos.boton, { backgroundColor: t.primario }]}><Text style={estilos.botonTexto}>Terminar preparación inicial</Text></Pressable>}
        {primerCiclo.inicioCompleto && <Text style={{ color: t.exito, fontWeight: '700', marginTop: 10 }}>Preparación inicial completada</Text>}
      </Tarjeta>

      <Tarjeta>
        <Text style={[estilos.titulo, { color: t.texto }]}>Carga de esta semana</Text>
        <Text style={[estilos.parrafo, { color: t.sutil }]}>Entregas pendientes por día. Toca Tareas para cambiar fechas o prioridades.</Text>
        <View style={estilos.dias}>{semana.map((dia) => <View key={dia.fecha} style={[estilos.dia, { backgroundColor: dia.tareas.length > 1 ? t.primarioSuave : t.superficieAlt }]}><Text style={{ color: t.sutil, fontSize: 11 }}>{dia.nombre}</Text><Text style={{ color: t.texto, fontWeight: '800', fontSize: 20 }}>{dia.tareas.length}</Text></View>)}</View>
        <Text style={{ color: t.sutil, fontSize: 12, marginTop: 12 }}>{vencidas.length > 0 ? `${vencidas.length} entrega(s) vencida(s). Revisa cuáles siguen pendientes.` : 'No tienes entregas vencidas.'}</Text>
        <Pressable onPress={() => onNavegar('tareas')} style={[estilos.boton, { backgroundColor: t.primario }]}><Text style={estilos.botonTexto}>Revisar mis tareas</Text></Pressable>
      </Tarjeta>

      <Tarjeta>
        <Text style={[estilos.titulo, { color: t.texto }]}>Orientación para empezar</Text>
        <Text style={[estilos.parrafo, { color: t.sutil }]}>Estos son tipos de apoyo. Confirma horarios y contactos en los canales oficiales de tu universidad.</Text>
        {RECURSOS.map((item) => <Pressable key={item.id} accessibilityRole="button" onPress={() => setRecurso(item)} style={[estilos.recurso, { borderColor: t.borde }]}><Ionicons name={item.icono} size={22} color={t.primario} /><Text style={{ color: t.texto, fontWeight: '600', flex: 1 }}>{item.titulo}</Text><Ionicons name="chevron-forward" size={18} color={t.sutil} /></Pressable>)}
      </Tarjeta>

      <Text style={{ color: t.sutil, fontSize: 12, textAlign: 'center' }}>{cursos.length} cursos registrados · {pendientes.length} tareas pendientes</Text>
      <Modal visible={Boolean(recurso)} transparent animationType="fade" onRequestClose={() => setRecurso(null)}>
        <View style={estilos.modalFondo}><View style={[estilos.modal, { backgroundColor: t.superficie }]}><Text style={[estilos.titulo, { color: t.texto }]}>{recurso?.titulo}</Text><Text style={[estilos.parrafo, { color: t.sutil }]}>{recurso?.detalle}</Text><Pressable onPress={() => setRecurso(null)} style={[estilos.boton, { backgroundColor: t.primario }]}><Text style={estilos.botonTexto}>Entendido</Text></Pressable></View></View>
      </Modal>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 32, gap: 14 },
  intro: { fontSize: 14, lineHeight: 20 },
  titulo: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  parrafo: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  paso: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1 },
  check: { padding: 2 }, pasoTitulo: { fontWeight: '700', fontSize: 13 },
  boton: { marginTop: 12, padding: 12, borderRadius: 10, alignItems: 'center' }, botonTexto: { color: '#fff', fontWeight: '700' },
  dias: { flexDirection: 'row', gap: 4 }, dia: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  recurso: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, paddingVertical: 12 },
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 },
  modal: { borderRadius: 16, padding: 20 },
});
