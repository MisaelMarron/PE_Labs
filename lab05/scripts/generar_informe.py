from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / 'Informe_UPlan_Primer_Ciclo_Lab05.docx'
EVID = BASE / 'evidencias'
doc = Document()
sec = doc.sections[0]
sec.top_margin = Inches(.8)
sec.bottom_margin = Inches(.75)
sec.left_margin = Inches(.95)
sec.right_margin = Inches(.95)

styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Calibri'
normal.font.size = Pt(11)
normal.paragraph_format.first_line_indent = Pt(0)
normal.paragraph_format.space_after = Pt(7)
normal.paragraph_format.line_spacing = 1.35
for name, size in [('Title', 18), ('Heading 1', 14), ('Heading 2', 12)]:
    s = styles[name]
    s.font.name = 'Calibri'
    s.font.size = Pt(size)
    s.font.bold = True
    s.font.color.rgb = None
    s.paragraph_format.space_before = Pt(9)
    s.paragraph_format.space_after = Pt(7)
    s.paragraph_format.keep_with_next = True
    s.paragraph_format.first_line_indent = Pt(0)
    if name == 'Title':
        for border in s._element.findall('.//' + qn('w:pBdr')):
            border.getparent().remove(border)
code_style = styles.add_style('Codigo', WD_STYLE_TYPE.PARAGRAPH)
code_style.font.name = 'Consolas'
code_style.font.size = Pt(7.2)
code_style.paragraph_format.space_after = Pt(0)
code_style.paragraph_format.line_spacing = 1
code_style.paragraph_format.first_line_indent = Pt(0)

def title(s): doc.add_paragraph(s, 'Title')
def h1(s): doc.add_paragraph(s, 'Heading 1')
def h2(s): doc.add_paragraph(s, 'Heading 2')
def p(s): doc.add_paragraph(s)
def page(): doc.add_page_break()
def fig(filename, caption, width=2.65):
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.add_run().add_picture(str(EVID / filename), width=Inches(width))
    cap = doc.add_paragraph(caption)
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.runs[0].italic = True
    cap.runs[0].font.size = Pt(9)
def table(headers, rows):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, text in enumerate(headers): t.rows[0].cells[i].text = text
    for row in rows:
        c = t.add_row().cells
        for i, text in enumerate(row): c[i].text = str(text)
    return t
def code(path, start=None, end=None):
    lines = (BASE / path).read_text(encoding='utf-8').splitlines()
    first = start or 1
    last = end or len(lines)
    p(f'Código fuente: {path}, líneas {first} a {last}.')
    for n in range(first, min(last, len(lines)) + 1):
        line = doc.add_paragraph(style='Codigo')
        line.add_run(f'{n:03d}  {lines[n-1]}')

# Portada
for text in ['UNIVERSIDAD NACIONAL DE SAN AGUSTÍN', 'FACULTAD DE INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', 'ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS']:
    x = doc.add_paragraph(text); x.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('\n\n')
title('Desarrollo de U Plan Primer Ciclo')
x = doc.add_paragraph('Aplicación multiplataforma de organización académica para estudiantes ingresantes'); x.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('\n')
for text in ['Curso: Plataformas Emergentes', 'Laboratorio: 05', 'Integrantes: William Isaias Roque Quispe y Misael Josías Marrón Lope', 'Docente: [Completar]', 'Fecha de entrega: [Completar]', 'Arequipa, Perú']:
    x = doc.add_paragraph(text); x.alignment = WD_ALIGN_PARAGRAPH.CENTER
page()

h1('Resumen')
p('U Plan Primer Ciclo es una evolución de U Plan móvil, desarrollado en el laboratorio anterior con React Native y Expo. La nueva versión conserva la organización de cursos, horarios, tareas y agenda, e incorpora una pantalla de apoyo dirigida a estudiantes que comienzan la universidad. Esta pantalla reúne una lista de preparación inicial, una vista de entregas por día de la semana y orientación sobre tipos de apoyo académico. La aplicación almacena los datos en el dispositivo mediante AsyncStorage y adapta la navegación a pantallas estrechas y anchas.')
p('El proyecto parte de la hipótesis de que algunos ingresantes tienen dificultades para reunir y ordenar la información académica de sus primeras semanas. La hipótesis y los requisitos propuestos deberán contrastarse mediante entrevistas o pruebas con usuarios reales antes de afirmar un impacto social. La versión implementada permite mostrar un recorrido funcional y documentar decisiones de interfaz, componentes del framework y persistencia local. Las capturas de este informe proceden de la vista web móvil del mismo código React Native; aún se requiere documentar una prueba en un dispositivo Android o iOS.')
p('Palabras clave: React Native, Expo, primer ciclo, organización académica, aplicación multiplataforma.')
h1('Contenido')
p('1. Introducción\n2. Justificación y proyección social\n3. Problema y requisitos\n4. Objetivos y alcance\n5. Tecnologías y componentes\n6. Arquitectura y datos\n7. Desarrollo de funcionalidades\n8. Interfaces y capturas\n9. Verificación y limitaciones\n10. Trabajo futuro\n11. Conclusiones\n12. Referencias\nAnexo A. Código fuente explicado')
page()

h1('1 Introducción')
p('El ingreso a la universidad supone aprender una nueva forma de organizar cursos, horarios, evaluaciones y entregas. La información puede encontrarse en distintos medios y llegar en momentos diferentes. Una herramienta de planificación personal ayuda a reunirla y a convertirla en una secuencia de acciones visibles. U Plan ya ofrecía un gestor de cursos y tareas; el presente desarrollo lo orienta al periodo de adaptación del primer ciclo.')
p('El trabajo se sitúa en el marco de una aplicación multiplataforma basada en requisitos y vinculada con proyección social. Se utiliza React Native con Expo porque el proyecto anterior ya empleaba ese framework y sus componentes propios. La evolución conserva la relación entre las pantallas existentes y el problema de organización académica, mientras agrega una sección de acompañamiento para el inicio de estudios.')
p('Este informe expone el problema formulado, la justificación, los requisitos, el diseño, la arquitectura, las funciones desarrolladas y el código principal. También incluye capturas reales de la interfaz. Distingue las funciones implementadas de las actividades de validación que todavía corresponden al equipo, particularmente las entrevistas a estudiantes ingresantes y las pruebas en dispositivos físicos.')
h1('2 Justificación y proyección social')
p('Una propuesta de proyección social debe identificar a quién beneficia y cómo se comprobó la necesidad. En este caso, el grupo destinatario propuesto son estudiantes de primer ciclo que necesitan organizar sus actividades académicas. La aplicación busca ofrecer una herramienta gratuita y de consulta local para registrar cursos y entregas, revisar la carga semanal y ubicar categorías de apoyo disponibles en su institución.')
p('El enfoque social no se deduce únicamente de agregar una pantalla. Se sostiene cuando el equipo contrasta el problema con usuarios, adapta los requisitos según sus respuestas y evalúa si la herramienta les resulta comprensible. Para ello se propone entrevistar a cuatro o cinco ingresantes y consultar a un tutor o representante académico. Esta actividad no se presenta aquí como realizada.')

h1('3 Problema y requisitos')
h2('3.1 Árbol de problemas propuesto')
p('El problema central planteado es la dificultad de algunos estudiantes ingresantes para organizar las actividades de sus primeras semanas universitarias. Entre sus posibles causas se encuentran la información dispersa, la falta de un método de planificación y la poca visibilidad de las entregas que se acumulan en una misma semana. Como posibles efectos se consideran tareas olvidadas, entregas tardías y mayor sensación de sobrecarga. Las entrevistas deben confirmar, corregir o descartar estas relaciones.')
table(['Nivel', 'Elemento del árbol', 'Respuesta de diseño'], [
    ['Causa', 'Información de cursos y horarios dispersa', 'Registro de cursos y horario editable'],
    ['Causa', 'Dificultad para iniciar la planificación', 'Lista guiada de preparación inicial'],
    ['Causa', 'Poca visibilidad de entregas simultáneas', 'Carga semanal por día'],
    ['Problema', 'Organización académica insuficiente al ingresar', 'Pantalla Primer Ciclo y funciones existentes'],
    ['Efecto', 'Entregas olvidadas o vencidas', 'Resumen de pendientes y vencidas'],
])
p('Figura 1. Árbol de problemas expresado como relación entre causas, problema, efectos y respuestas de interfaz. Elaboración propia.')
h2('3.2 Requisitos funcionales')
table(['Código', 'Requisito', 'Pantalla'], [
    ['RF01', 'Registrar y modificar cursos y bloques de horario', 'Cursos'],
    ['RF02', 'Registrar, editar, completar y filtrar tareas', 'Tareas'],
    ['RF03', 'Consultar entregas y sesiones próximas', 'Agenda'],
    ['RF04', 'Marcar pasos de preparación inicial', 'Apoyo'],
    ['RF05', 'Visualizar entregas pendientes por día de la semana', 'Apoyo'],
    ['RF06', 'Consultar orientación sobre tipos de apoyo', 'Apoyo'],
    ['RF07', 'Guardar los datos en el dispositivo', 'Todas'],
])
h2('3.3 Requisitos no funcionales')
p('La interfaz debe adaptarse a teléfonos y ventanas anchas; las acciones principales deben ser legibles y accesibles por toque; los datos deben recuperarse al reiniciar la aplicación; y el contenido de orientación debe evitar publicar contactos u horarios no verificados. La información personal no se envía a un servidor en esta versión.')

h1('4 Objetivos y alcance')
h2('4.1 Objetivo general')
p('Desarrollar una aplicación multiplataforma que apoye la organización académica de estudiantes de primer ciclo mediante planificación de cursos, tareas, horario y entregas semanales.')
h2('4.2 Objetivos específicos')
p('Conservar las funciones de planificación del laboratorio anterior; incorporar una guía inicial de configuración; mostrar la concentración de entregas durante la semana; ofrecer orientación general para buscar apoyo institucional; y almacenar el progreso localmente.')
h2('4.3 Alcance de la versión')
p('La versión implementada es individual. Un estudiante puede gestionar sus cursos y tareas en el dispositivo donde usa la aplicación. La sección de apoyo contiene cuatro pasos de preparación, un resumen semanal de tareas pendientes y tres categorías de orientación: tutoría académica, bienestar universitario y biblioteca. Los recursos no incluyen datos de contacto específicos porque estos requieren verificación institucional.')
h1('5 Tecnologías y componentes')
p('React Native proporciona componentes para construir interfaces en distintas plataformas. En este proyecto se emplean View y Text para estructurar el contenido, Pressable para acciones, ScrollView para el contenido de la pantalla de apoyo, FlatList para cursos y tareas, SectionList para la agenda, Modal para formularios y cuadros informativos, y StyleSheet para estilos. La documentación oficial explica el propósito de estos componentes (Meta Platforms, s. f.).')
p('Expo aporta el entorno de desarrollo y las herramientas para ejecutar el proyecto en Android, iOS y web a partir de una misma base de código (Expo, s. f.). AsyncStorage conserva el estado mediante claves y valores de forma persistente en el dispositivo. Su documentación lo describe como almacenamiento asíncrono y no cifrado; por ello no se utiliza para contraseñas ni información sensible (React Native Async Storage, s. f.).')
p('La aplicación también utiliza Expo Vector Icons para iconos de navegación e interfaz, y react-native-safe-area-context para respetar las zonas seguras de la pantalla. El diseño mantiene una barra inferior en teléfonos y una barra lateral en pantallas anchas.')

h1('6 Arquitectura y datos')
p('El componente App organiza los proveedores de tema, datos y área segura. Según la pestaña activa, muestra una de las seis pantallas. DataContext mantiene cursos, tareas, asistencias y perfil, y expone las acciones que los modifican. Un segundo estado dentro de ese contexto guarda la preparación de primer ciclo: los pasos marcados y la finalización de la guía.')
table(['Capa', 'Archivos principales', 'Responsabilidad'], [
    ['Interfaz', 'src/screens y src/components', 'Pantallas, formularios, tarjetas y navegación'],
    ['Estado', 'src/context/DataContext.js', 'Datos y acciones disponibles para las pantallas'],
    ['Persistencia', 'AsyncStorage en DataContext.js', 'Guardar y recuperar estado local'],
    ['Reglas y utilidades', 'src/utils/fechas.js y src/constants/horario.js', 'Fechas y sesiones de horario'],
    ['Diseño', 'src/theme.js y src/layout.js', 'Paleta y distribución adaptable'],
])
p('Figura 2. Arquitectura lógica de U Plan Primer Ciclo. Elaboración propia a partir del código fuente.')
h2('6.1 Flujo de información')
p('Una acción del estudiante, por ejemplo marcar un paso inicial, invoca una función del contexto. Esa función actualiza el estado de React. Un efecto observa el cambio y guarda la representación JSON en AsyncStorage. Cuando se abre la aplicación, otro efecto recupera el valor guardado y lo vuelve a cargar en memoria. Para evitar sobrescribir el valor anterior con el estado vacío inicial, el guardado de la preparación se habilita después de completar la lectura.')
h2('6.2 Datos de demostración')
p('El proyecto incluye cursos y tareas de ejemplo para facilitar la revisión de las pantallas. Sus nombres y códigos EJ son ilustrativos; no constituyen un plan de estudios oficial. El usuario puede editarlos o reiniciar los datos desde Perfil. Antes de una prueba con estudiantes reales conviene sustituirlos por información que corresponda a su contexto.')

h1('7 Desarrollo de funcionalidades')
h2('7.1 Preparación inicial')
p('La sección Primer Ciclo presenta cuatro acciones: personalizar el perfil, revisar los cursos, organizar el horario y anotar la primera entrega. Cada fila muestra una casilla que el estudiante puede marcar y una acción para ir a la pantalla correspondiente. Cuando completa los cuatro pasos, aparece la opción de finalizar la preparación. El estado se conserva mediante AsyncStorage.')
h2('7.2 Carga semanal')
p('La pantalla calcula el lunes de la semana actual y genera los siete días siguientes. Para cada día cuenta las tareas pendientes cuya fecha de entrega coincide con esa fecha. También informa cuántas tareas vencidas siguen sin completar. El recuento permite reconocer días con varias entregas, aunque no mide horas de estudio ni dificultad de cada actividad; por ello se presenta como carga de entregas y no como diagnóstico de riesgo académico.')
h2('7.3 Orientación de apoyo')
p('Las tarjetas de tutoría, bienestar y biblioteca abren una explicación breve. El texto orienta al usuario a consultar los canales oficiales de su universidad. Esta decisión evita inventar horarios, responsables o enlaces y deja espacio para incorporar información institucional verificada después de la investigación de campo.')
h2('7.4 Funciones conservadas')
p('La pantalla Inicio resume el progreso de tareas y muestra entregas próximas. Cursos permite crear, editar y eliminar cursos, además de asignar clases al horario. Tareas admite prioridades, filtros y cambios de estado. Agenda organiza sesiones y entregas por secciones. Perfil permite modificar datos del estudiante, cambiar el tema y reiniciar la información. Estas funciones constituían la base del laboratorio anterior y sostienen la nueva experiencia.')

h1('8 Interfaces y capturas')
p('Las capturas siguientes se obtuvieron ejecutando la vista web de Expo con un ancho de 390 píxeles. Muestran la interfaz móvil derivada del mismo código React Native. No sustituyen una captura de Android o iOS; esa evidencia debe añadirse cuando el equipo realice la prueba en un dispositivo.')
fig('05-apoyo.png', 'Figura 3. Preparación inicial y carga de entregas en la pantalla Apoyo. Captura propia.', 2.7)
p('La primera tarjeta convierte la configuración inicial en cuatro acciones visibles. La segunda distribuye las entregas pendientes entre lunes y domingo. El botón lleva a la lista de tareas para revisar el detalle.')
page()

h1('8.1 Pantalla Inicio')
fig('01-inicio.png', 'Figura 4. Resumen académico y próximas entregas. Captura propia.', 2.7)
p('Inicio resume el porcentaje de tareas completadas, el número de cursos, las tareas por vencer y las vencidas. Su propósito es ofrecer una lectura rápida de la situación académica antes de entrar a las listas detalladas.')
page()

h1('8.2 Cursos y horario')
fig('02-cursos.png', 'Figura 5. Tarjetas de cursos. Captura propia.', 2.7)
p('Cada tarjeta presenta el nombre del curso, docente, código, horario resumido y tareas relacionadas. La vista de horario permite asignar sesiones a bloques semanales. Los cursos mostrados en la captura son datos de ejemplo y deben actualizarse según los cursos reales del estudiante.')
page()

h1('8.3 Tareas y agenda')
fig('03-tareas.png', 'Figura 6. Lista de tareas y prioridades. Captura propia.', 2.45)
fig('04-agenda.png', 'Figura 7. Agenda de clases y entregas. Captura propia.', 2.45)
p('Tareas permite consultar y modificar actividades individuales. Agenda presenta dos secciones: sesiones de clase pendientes de confirmar y próximas entregas. La confirmación «Asistiré» expresa una intención de asistir; no verifica presencia física.')
page()

h1('8.4 Orientación y perfil')
fig('07-recurso.png', 'Figura 8. Cuadro informativo de tutoría académica. Captura propia.', 2.45)
fig('06-perfil.png', 'Figura 9. Datos personales y ajustes. Captura propia.', 2.45)
p('Los cuadros de orientación ofrecen recomendaciones generales sin atribuir servicios concretos a la institución. Perfil reúne los datos del estudiante y del equipo, el selector de apariencia y la acción de reinicio.')
page()

h1('9 Verificación y limitaciones')
p('Se instaló el conjunto de dependencias del proyecto y se generó satisfactoriamente una exportación web con Expo. También se abrió la aplicación en una ventana móvil de navegador y se capturaron las seis pantallas y un cuadro de recurso. Se marcó un paso de preparación y, tras recargar la página, el avance de uno de cuatro pasos continuó visible. Esto verifica la compilación, representación y una ruta de persistencia en web. La ejecución en Android e iOS y la evaluación con estudiantes ingresantes permanecen pendientes de documentar.')
table(['Caso', 'Procedimiento sugerido', 'Resultado a registrar'], [
    ['Preparación', 'Marcar cuatro pasos, cerrar y abrir la app', '[Completar tras prueba en teléfono]'],
    ['Carga semanal', 'Crear dos tareas para el mismo día', '[Completar]'],
    ['Persistencia', 'Editar un curso y reiniciar la app', '[Completar]'],
    ['Navegación', 'Ir de Apoyo a Cursos, Tareas y Perfil', '[Completar]'],
    ['Recursos', 'Abrir y cerrar cada cuadro informativo', '[Completar]'],
])
p('La persistencia local no sincroniza datos entre dispositivos. Los datos se pueden perder si se desinstala la aplicación o se borra su almacenamiento. La vista semanal cuenta entregas, pero no estima la duración de las tareas. La sección de orientación todavía no contiene recursos institucionales verificados. Estas limitaciones son importantes al describir el alcance del producto.')
h1('10 Trabajo futuro')
p('El siguiente paso es entrevistar a ingresantes y revisar el árbol de problemas según sus respuestas. Después conviene simplificar las partes de la interfaz que resulten difíciles de entender y reemplazar los datos de ejemplo por un recorrido de configuración más personal. También se podrían incorporar avisos locales para entregas cercanas, respaldo de datos y enlaces a servicios institucionales comprobados. Cada ampliación requiere pruebas en dispositivos y una revisión de privacidad si se añaden cuentas o sincronización.')
page()

h1('11 Conclusiones')
p('La evolución de U Plan muestra que un proyecto de diseño de interfaces puede convertirse en una aplicación funcional mediante componentes de React Native. La nueva pantalla de Primer Ciclo conecta las funciones existentes con una necesidad concreta: iniciar la organización de cursos y entregas al entrar a la universidad.')
p('La preparación guiada, la carga semanal y la orientación general amplían la utilidad del gestor académico sin depender de un servidor. La persistencia local permite retomar la planificación en el mismo dispositivo, mientras que la distribución adaptable conserva una experiencia clara en pantallas de distinto tamaño.')
p('El aporte social previsto debe evaluarse con estudiantes reales. La implementación es un prototipo funcional, pero las entrevistas y pruebas de uso son necesarias para determinar si los requisitos representan sus dificultades y si la herramienta les ayuda de manera efectiva.')
h1('12 Referencias')
for ref in [
    'Expo. (s. f.). Create a project. Expo Documentation. https://docs.expo.dev/get-started/create-a-project/',
    'Meta Platforms. (s. f.). Core components and APIs. React Native. https://reactnative.dev/docs/components-and-apis',
    'React Native Async Storage. (s. f.). Async Storage. https://react-native-async-storage.github.io/',
    'Roque Quispe, W. I., & Marrón Lope, M. J. (2026). U Plan móvil [Código fuente]. GitHub. https://github.com/WilliamIsaiasRoque/PE_Labs',
]: p(ref)
page()

h1('Anexo A Código fuente explicado')
p('Los listados siguientes reproducen archivos reales de la versión desarrollada. Se incluyen para mostrar cómo se conectan la navegación, el estado y la pantalla de Primer Ciclo. La carpeta del proyecto conserva el código completo de las demás pantallas y componentes.')
h2('A.1 Navegación y proveedores')
p('App.js envuelve la interfaz en los proveedores de tema y datos. El objeto PANTALLAS relaciona cada identificador de pestaña con su pantalla. La nueva pestaña primerCiclo se abre al iniciar; la función onNavegar permite saltar desde la guía a Perfil, Cursos o Tareas.')
code('App.js')
page()
h2('A.2 Estado y persistencia')
p('DataContext.js contiene las acciones de cursos y tareas y el nuevo estado primerCiclo. La lectura inicial precede al guardado para preservar la información anterior. El progreso de la guía usa una clave independiente en AsyncStorage, mientras los datos académicos conservan su clave original.')
code('src/context/DataContext.js')
page()
h2('A.3 Pantalla Primer Ciclo')
p('PrimerCicloScreen.js define los pasos, calcula la carga semanal y muestra los recursos informativos. El código distingue entre tareas pendientes y vencidas, y usa componentes nativos de React Native para las tarjetas, casillas, botones y cuadros.')
code('src/screens/PrimerCicloScreen.js')
page()
h2('A.4 Datos de ejemplo')
p('semilla.js genera cursos y tareas ilustrativos para que la aplicación muestre un flujo completo desde el primer uso. Los códigos EJ y los nombres de los cursos son ejemplos, no información oficial de la universidad.')
code('src/data/semilla.js')

footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
footer.add_run('U Plan Primer Ciclo  |  Laboratorio 05')
doc.save(OUT)
print(OUT)
