# GRAN PLAN · Brief de desarrollo y aceptación

**Fecha:** 14 de octubre de 2026.  
**Proyecto:** renovación de marca, web comercial, reservas y panel de gestión del local actual Diverdino, Elche.  
**Naturaleza:** especificación de alcance para la demostración y el paso a producción. Este documento no acredita integraciones activas ni sustituye el acta de pruebas.

## 1. Decisiones que gobiernan el desarrollo

La propiedad ha elegido una marca paraguas amplia, manteniendo Diverdino como línea infantil. **GRAN PLAN · Casa de celebraciones** es el nombre creativo provisional: disponibilidad de marca, dominio y perfiles pendiente de comprobar. La arquitectura de trabajo es Diverdino Kids por Gran Plan, Gran Plan Social y Gran Plan Together.

La instrucción de color es conservar la paleta original, con un enfoque visual nuevo:

| Color | Valor | Papel orientativo |
|---|---|---|
| Turquesa | `#4fc3dc` | Reconocimiento, identidad y navegación |
| Fucsia | `#e51b83` | Acciones y acentos protagonistas |
| Verde | `#56b827` | Etiquetas y módulos de apoyo |
| Amarillo | `#fbc000` | Detalles, ritmo y señalización |
| Naranja | `#f08219` | Acentos cálidos y piezas promocionales |
| Blanco y tinta oscura | Valores de soporte definidos en el diseño | Fondos, lectura y contraste |

La renovación mantiene estos cinco colores y llega por tipografía, composición, fotografía y proporción de color. Cada estado necesita texto o icono además de color. Las combinaciones finales deben superar las comprobaciones de contraste elegidas para el sitio.

Los importes vigentes proceden de la **confirmación escrita posterior de la propiedad el 14/10/2026**, que sustituye al cartel anterior: limpieza 25 €, hora extra 20 €, reserva 20 €; aforo 75 personas entre niños y adultos. Shifter es el calendario actual. Instagram, Facebook y TikTok son los canales actuales. Se respetan sus valores. Tratamiento fiscal, festivos/vísperas, señal y posible fianza, obligatoriedad de limpieza, horas extra y aplicación del día completo se cierran antes de activar cobros.

La estrategia y la especificación operativa se desarrollan en [estrategia.md](estrategia.md) y [operaciones.md](operaciones.md). La investigación de mercado está en [competencia.md](competencia.md).

## 2. Demostración revisable

### Entregables previstos

La demostración se plantea como tres páginas estáticas, sin proceso de compilación obligatorio para su uso:

- `index.html`: propuesta comercial, experiencias, espacio, tarifas de referencia y simulador de consulta/reserva.
- `panel.html`: demostración de agenda, reservas, clientes anónimos, marketing y conexiones.
- `propuesta.html`: acceso a la propuesta empresarial y sus documentos descargables.

El entorno de entrega debe permitir abrir las páginas, recorrer los enlaces y comprobar los estados desde escritorio y móvil. Si se comparte mediante hosting, será privado y accesible al propietario según la configuración de entrega; no se considera por ello un sistema comercial en producción.

### Lo que hace la demo y su límite

| Función | Alcance de la demostración | Límite que debe quedar visible |
|---|---|---|
| Marca y experiencias | Presenta la marca provisional y Kids, Social y Together | La marca no está adoptada ni protegida por esta entrega; imágenes conceptuales no certifican el estado del local |
| Tarifas | Usa los importes del cartel como referencia y permite revisar el cálculo | Las reglas pendientes no se presentan como condiciones contractuales cerradas |
| Fechas y franjas | Consulta estados y registros de ejemplo; usa fecha de Madrid | No consulta la agenda real del negocio |
| Solapamientos locales | Evita repetir la franja en el mismo almacenamiento del navegador; día completo se cruza con mañana/tarde | No garantiza exclusión entre usuarios, dispositivos, navegadores ni ventanas concurrentes |
| Persistencia | Conserva simulaciones mediante `localStorage` cuando el navegador lo permite | No es una base de datos compartida, copia de seguridad ni historial comercial |
| Señal de 20 € | Representación simulada del importe «reserva» del cartel | No hay cargo; si se descuenta del total, es un supuesto de simulación pendiente de confirmar |
| Limpieza de 25 € | Representación del importe del cartel como extra o regla ilustrativa | Su obligatoriedad debe confirmarse y configurarse antes de contratar |
| Social | Se registra siempre como solicitud pendiente de revisión | No se confirma automáticamente la actividad ni una reserva |
| Panel de reservas | Lista registros de ejemplo y simulaciones locales, con filtros y cancelación demo | No modifica reservas reales ni devuelve pagos |
| Calendario del panel | Permite visualizar ocupación de la demostración | No está conectado a Shifter ni a otro calendario real |
| Clientes | Datos ficticios para mostrar el trabajo de atención | No se introducen datos personales reales |
| Marketing | Textos y piezas de ejemplo revisables | No publica ni envía comunicaciones |
| Conexiones | Muestra el estado inactivo y el recorrido previsto | No existen APIs autorizadas, credenciales ni sincronización operativa |
| WhatsApp | Puede abrir el enlace público de contacto si la persona decide usarlo | Abrir WhatsApp no confirma fecha ni activa mensajería automatizada |
| Documentos | Permite leer o descargar la propuesta y el material disponible | No convierte estimaciones o borradores en servicios contratados |

Una simulación que se guarda, se cancela o se recupera dentro del mismo navegador sigue siendo una simulación. El panel público de la demo solo puede contener ejemplos. No se colocan datos reales ni secretos en HTML, JavaScript, archivos de descarga o almacenamiento del navegador.

### Aceptación de la demostración

| ID | Comprobación | Resultado esperado |
|---|---|---|
| D01 | Abrir las tres páginas y sus enlaces internos | Navegación coherente; no hay enlaces rotos a archivos entregados |
| D02 | Revisar escritorio y móvil | Texto legible, acciones accesibles y ausencia de desbordamiento horizontal relevante |
| D03 | Recorrer navegación, formulario y diálogo con teclado | Foco visible, etiquetas comprensibles, cierre y retorno de foco adecuados |
| D04 | Cambiar fecha, franja y complementos | El cálculo de referencia y los estados corresponden a la selección |
| D05 | Intentar simular una reserva sobre una franja ocupada en ese navegador | Mensaje comprensible y ausencia de una segunda confirmación local |
| D06 | Simular día completo y después mañana/tarde, y a la inversa | La lógica local muestra el conflicto correspondiente |
| D07 | Elegir Social | La salida es solicitud sujeta a revisión, sin confirmación automática |
| D08 | Crear una simulación y revisar el panel del mismo origen/navegador | Aparece el registro local con su estado y carácter de demo |
| D09 | Cancelar un registro demo y actualizar la vista | Cambia únicamente la simulación; el estado y la disponibilidad local se explican |
| D10 | Abrir conexiones, marketing y cobro | No se afirma conexión, envío, publicación ni pago real |
| D11 | Restablecer los datos demo si se ofrece esa función | Se explica el alcance local y no afecta al negocio |
| D12 | Abrir un segundo navegador o dispositivo | Se comunica que no comparte agenda; no se utiliza esta prueba como garantía de concurrencia |
| D13 | Revisar consola y solicitudes de red | Sin errores que impidan el flujo; ninguna clave secreta ni envío de datos personales |
| D14 | Revisar color, logos e imágenes | Paleta original respetada; marca provisional e imágenes conceptuales identificadas donde corresponda |

La ejecución y el resultado de estas comprobaciones se deben registrar al entregar. La existencia del documento no significa que todas hayan pasado.

## 3. Primera versión comercial

La primera versión comercial necesita resolver la compra completa y el trabajo diario. El alcance propuesto incluye:

1. Web pública con contenido real, identidad final, tarifas y condiciones aprobadas.
2. Motor central para un local y sus franjas, bloqueos y márgenes de preparación/cierre.
3. Alta de solicitudes y reservas por web y por personal autorizado, con la misma disponibilidad.
4. Presupuesto calculado en servidor y cobro de la señal mediante un proveedor de pagos del negocio.
5. Confirmación basada en cobro y asignación verificados, con tratamiento de errores.
6. Panel con inicio de sesión, roles, agenda, reservas, saldos, tareas y auditoría.
7. Correos o comunicaciones transaccionales que se hayan implementado y probado.
8. Calendario externo conectado como vista/sincronización controlada, con alertas de fallo.
9. Copias restaurables, exportación, monitorización y procedimiento de soporte.

WhatsApp automatizado y publicación directa en redes pueden incorporarse después sin impedir una primera versión comercial con atención manual. Si no están activos, la interfaz debe mostrarlo y orientar al proceso disponible.

### No se incorpora por defecto

- Venta simultánea de salas o zonas: el supuesto actual es un único local por franja.
- Catering, animación, bebidas o decoración personalizada sin servicio y proveedor confirmados.
- Venta de entradas, discoteca, control de acceso autónomo o funcionamiento nocturno por el hecho de aparecer Social.
- Herramientas completas de anuncios de Meta, gestión de campañas o todas las funciones de sus bandejas.
- Contabilidad completa, nóminas o facturación fiscal avanzada sin un alcance específico.
- Aplicación móvil nativa: el panel web adaptable cubre la necesidad inicial.
- Migración de todos los datos históricos sin inspeccionar su formato y calidad.

## 4. Modelo mínimo de datos y estados

| Entidad | Información esencial | Regla de diseño |
|---|---|---|
| Recurso | Local, zona si se añadiera más adelante, calendario y horario | Un único recurso inicial confirmado por propiedad |
| Franja/regla | Inicio/fin local, día de semana, excepciones, preparación y cierre | Una regla versionada genera intervalos inequívocos |
| Tarifa | Importe, moneda, impuestos, inclusiones, vigencia y excepciones | Cálculo en servidor; la reserva conserva la versión aceptada |
| Solicitud | Ocasión, fecha deseada, grupo, estado y contacto mínimo | No bloquea ni confirma salvo acción explícita definida |
| Bloqueo temporal | Recurso, intervalo, caducidad, reserva y sesión de pago | Alta atómica; expiración coordinada con el proveedor de pago |
| Reserva | Referencia, responsable, intervalo, formato, aforo permitido, estado, importes y condiciones | Referencia única y auditoría de cambios |
| Pago/devolución | Referencia del proveedor, importe, moneda, estado y eventos procesados | Idempotencia; no inferir pago por redirección del navegador |
| Comunicación | Canal, destinatario, motivo, estado de entrega y permiso aplicable | No mezclar consentimiento comercial con información de reserva |
| Tarea/incidencia | Evento, asignación, vencimiento y resolución | Fallos de integración generan tareas visibles |
| Conexión | Proveedor, autorización, caducidad y última sincronización | Secretos en servidor; mostrar el estado real |
| Usuario/auditoría | Rol, acciones y marca temporal | Acceso mínimo y trazabilidad sin registrar secretos |

**Estados comerciales propuestos:** solicitud, pendiente de revisión, bloqueo temporal, confirmada, celebrada, cancelada y caducada. El estado de pago se mantiene separado: no iniciado, pendiente, pagado, fallido, devolución pendiente y devuelto, según los medios realmente habilitados. La devolución no se da por realizada al pulsar «cancelar».

Todos los importes se guardan en unidades monetarias enteras, con moneda explícita. Las condiciones y el total aceptados quedan asociados a la reserva. Un cambio de tarifa posterior no modifica una reserva existente de forma silenciosa.

Las fechas se presentan en `Europe/Madrid`. Los intervalos guardados deben ser inequívocos y conservar el contexto de hora local, con cambios de hora contemplados. La disponibilidad incorpora el intervalo de uso más preparación y cierre que corresponda. La relación entre franjas parciales y día completo se define mediante intervalos, no solo comparando nombres.

## 5. El requisito crítico: impedir dos reservas del mismo local

El servidor debe asignar el intervalo mediante una operación transaccional respaldada por una restricción o mecanismo equivalente en la base de datos. Consultar disponibilidad y guardar después, sin exclusión atómica, permite que dos personas compren lo mismo.

En PostgreSQL se puede estudiar una exclusión de rangos sobre los estados que ocupan el recurso; las transiciones y liberaciones deben mantener la misma garantía. La especificación operativa recoge [la documentación primaria del mecanismo](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT). La elección exacta se valida en la arquitectura técnica.

### Aceptación del motor y del pago

Estas son pruebas de integración con servidor y base de datos reales del entorno de pruebas. Un bloqueo de interfaz o una prueba exclusivamente en `localStorage` no sirve para aceptarlas.

| ID | Caso | Criterio de aprobación |
|---|---|---|
| R01 | Dos clientes independientes solicitan simultáneamente el mismo recurso/intervalo | Exactamente uno obtiene un bloqueo válido; el otro recibe indisponibilidad; la base de datos no contiene dos ocupaciones activas |
| R02 | Dos procesos pasan una consulta previa de disponibilidad antes de intentar guardar | La garantía se mantiene en la escritura; no depende de la consulta inicial |
| R03 | Repetir una misma solicitud con la misma clave de idempotencia | Se recupera la misma operación y referencia, sin duplicar bloqueo ni cobro |
| R04 | Día completo contra mañana/tarde en ambos órdenes | El intervalo conflictivo no se vende dos veces |
| R05 | Dos franjas adyacentes y márgenes de preparación/cierre | Se permiten solo cuando los intervalos efectivos no se solapan; límites documentados |
| R06 | Alta de personal en el panel contra reserva web simultánea | Ambas usan el mismo mecanismo y solo una puede ocupar la franja |
| R07 | Bloqueo caducado con sesión de pago todavía abierta | No se libera una franja mientras permanezca un camino de pago que pueda confirmarla sin control |
| R08 | Pago completado justo al vencer un bloqueo | Existe un único resultado consistente; ningún pago confirma silenciosamente una franja ya reasignada; cualquier excepción genera resolución visible |
| R09 | Notificación de pago duplicada o reintentada | Se registra una vez el efecto; una confirmación y una reserva |
| R10 | Notificaciones fuera de orden y retraso de confirmación | Las transiciones no retroceden a un estado incorrecto; se consulta al proveedor cuando sea necesario |
| R11 | Manipular precio, descuento, señal o referencia desde el cliente | El servidor recalcula y valida; no acepta el importe del navegador como autoridad |
| R12 | Abrir manualmente la página de éxito sin un pago válido | No confirma la reserva ni envía una confirmación de pago |
| R13 | Pago rechazado o abandonado | Estado correcto, ausencia de cobro confirmado y liberación coordinada conforme al flujo |
| R14 | Cancelar y devolver, incluyendo fallo de devolución | Reserva y dinero tienen estados separados; el fallo se muestra y puede resolverse sin duplicar devoluciones |
| R15 | Cambiar fecha de una reserva | El cambio es atómico o mantiene una transición protegida; no pierde la reserva original antes de asegurar la nueva |
| R16 | Reservar fechas durante cambios de hora y desde un dispositivo en otra zona | Se mantiene la fecha y franja de Madrid, sin desplazamientos ni duración incorrecta |
| R17 | Cambiar aforo o reglas de una actividad | Los límites se validan en servidor; las reservas previas conservan condiciones y requieren una gestión explícita si hay conflicto |
| R18 | Introducir una fecha pasada o un intervalo no comercializado | El servidor rechaza la petición aunque el formulario se haya manipulado |

Para R01/R02/R06 conviene usar dos conexiones independientes y una barrera de sincronización que obligue a competir por el mismo intervalo. Se comprueba la respuesta y el estado final de la base de datos. La cantidad de peticiones de una prueba de carga se decide según tráfico esperado; no sustituye demostrar la exclusión correcta.

## 6. Integraciones y operación degradada

| Integración | Alcance inicial | Aceptación y tratamiento de fallos |
|---|---|---|
| Shifter / puente de calendario por verificar | Identificar producto, exportación y capacidad de sincronización; Google Calendar sería una alternativa de puente, no la agenda actual confirmada | Alta/actualización/cancelación trazable; reintentos sin duplicados; alerta de desconexión y reconciliación |
| Pagos | Señal mediante cuenta propia del negocio | Verificación de firma, importe/moneda y referencia; idempotencia; conciliación y devolución probadas |
| Correo | Confirmación y guía de reserva si se implementa | Estado de envío/entrega según proveedor, reintentos y tarea si falla |
| WhatsApp manual | Enlace público y atención por el equipo | Mensaje no equivale a reserva; toda confirmación se registra en el panel |
| WhatsApp automatizado | API oficial, permisos y plantillas aprobadas en la fase correspondiente | Ventanas, permisos, bajas, errores y atención humana contemplados; ninguna campaña por defecto |
| Redes | Calendario editorial y acceso a herramientas nativas | Permisos reales y estado de publicación visible si llega a implementarse publicación directa |
| Analítica | Medición mínima de consulta, avance, reserva y origen permitido | No envía datos personales innecesarios; distingue entorno demo/pruebas y producción |

**Regla del calendario:** no puede ser una segunda caja de reservas sin coordinación. El negocio decide si el personal registra todos los bloqueos en el panel —opción preferente— o si se admiten altas externas con un proceso explícito de reconciliación. Una consulta a Calendar seguida de un alta no garantiza por sí misma exclusión entre peticiones.

**Regla de fallo:** un pago ya confirmado no desaparece porque falle un correo o Calendar. Se conserva el registro y se crea una tarea de resolución. Si no se puede conocer la disponibilidad con la fiabilidad exigida, se muestra consulta pendiente; no se inventa un hueco.

**Regla de mensajes:** los borradores son contenido, no conexiones. La gestión de consentimiento, plantillas, ventana de atención y bajas se implementa antes de activar cada automatización. Las condiciones vigentes y las fuentes oficiales están referenciadas en [operaciones.md](operaciones.md).

## 7. Acceso, datos y continuidad

Antes de admitir clientes reales, el panel requiere inicio de sesión y roles. Una URL difícil de adivinar y el almacenamiento del navegador no sustituyen autorización en servidor. Los endpoints de clientes, reservas, cobros y exportaciones deben comprobar permisos en cada operación.

| ID | Comprobación de producción | Aceptación |
|---|---|---|
| S01 | Entrar al panel o solicitar datos sin sesión | Acceso denegado; no se filtran datos en HTML ni respuestas de API |
| S02 | Usuario con rol limitado intenta cambiar tarifas, devolver pagos o exportar clientes | Operación denegada según matriz de permisos |
| S03 | Intentar leer/modificar una reserva por identificador desde un contexto no autorizado | El servidor verifica autorización y no revela datos ajenos |
| S04 | Revisar código público, descargas, registros y almacenamiento cliente | No contienen secretos, datos reales de demostración ni información personal innecesaria |
| S05 | Restaurar una copia en un entorno controlado | Recuperación demostrada, tiempo medido y procedimiento documentado |
| S06 | Revocar una conexión o credencial | Cesa el acceso y se muestra su estado; no siguen operando trabajos con permisos revocados |
| S07 | Gestionar una baja de marketing | La preferencia queda registrada y se respeta en próximos envíos comerciales |
| S08 | Incidencia de soporte o eliminación/exportación legítima | Existe responsable, trazabilidad y proceso definido; no se improvisa la conservación |

La propiedad define, con asesoramiento cuando proceda, conservación, contratos con proveedores y textos de privacidad aplicables. Las fotografías de menores no se usan por defecto. La primera producción puede trabajar con el local vacío y montajes reales, evitando depender de material de clientes.

## 8. Backlog priorizado y fases

| Fase | Prioridad | Trabajo | Dependencias | Criterio para pasar |
|---|---|---|---|---|
| 0 · Demo revisable | Ahora | Tres páginas, identidad, reserva ilustrativa, panel ficticio y documentos | Material facilitado y dirección creativa | D01–D14 ejecutadas y límites visibles |
| 1 · Cierre de operación | P0 | Actividad, capacidad, horarios, tarifas completas, señales, condiciones y responsables | Documentos y decisiones de propiedad | Ficha de operación y oferta aprobada, sin reglas de cobro ambiguas |
| 2 · Núcleo comercial | P0 | Backend, base de datos, disponibilidad, bloqueo, precio, pagos, panel autenticado y comunicaciones básicas | Fase 1, cuenta de pago, hosting y dominio | R01–R18 y S01–S05 aplicables aprobadas; pruebas de cliente completas |
| 3 · Puesta en marcha controlada | P0 | Migrar reservas futuras, formar al equipo, verificar integración Calendar y soporte | Núcleo estable y agenda existente reconciliada | Reservas reales trazables; procedimiento diario y contingencia entendidos |
| 4 · Automatización | P1 | WhatsApp oficial, recordatorios, seguimiento de saldos y mejora de tareas | Permisos, plantillas, cuentas y volumen justificado | Envíos autorizados, bajas y fallos probados; revisión humana disponible |
| 5 · Optimización comercial | P1 | Analítica por ocasión/franja, campañas medidas y mejoras de conversión | Datos fiables y proceso estable | Cambios decididos por reservas y margen, con atribución documentada |
| 6 · Servicios ampliados | P2 | Proveedores, eventos preparados y publicación social integrada si aporta valor | Oferta comprobada, contratos, permisos y capacidad | Servicio ejecutable con alcance, precio y margen claros |

P0 significa necesario para vender mediante el flujo anunciado; P1 mejora operación o crecimiento; P2 requiere justificar valor y capacidad. Las fases no son precios ni fechas comprometidas. El calendario empresarial de noventa días es una orientación en la estrategia; la estimación de desarrollo se cierra tras definir P0.

### Dependencias que la demo no resuelve

- Acceso titular a dominio, correo, hosting, perfiles y cuentas del negocio.
- Confirmación de disponibilidad y registro de la marca elegida antes de adoptarla.
- Documentación de actividad, capacidad y condiciones reales del local.
- Agenda futura y datos existentes con permiso y formato de migración.
- Reglas completas de impuestos, festivos/vísperas, señales, limpieza, cancelaciones y saldo.
- Cuenta de pagos verificada, cuenta de Calendar autorizada y proveedor de correo.
- Cuenta/número aptos para WhatsApp oficial si se incorpora esa fase.
- Fotografías reales actualizadas y autorizaciones para imágenes/personas.
- Elección de alojamiento, presupuesto de mantenimiento y persona responsable del soporte.

## 9. RACI de puesta en marcha

**A:** responsable último de la decisión; **R:** ejecuta el trabajo; **C:** consultado; **I:** informado. Una persona puede cubrir varios papeles; cada fila conserva un único A. La tabla distribuye responsabilidad del proyecto y no sustituye las obligaciones de cada profesional.

| Entrega / decisión | Propiedad | Desarrollo | Operación / atención | Marca / marketing | Técnico / asesor según materia |
|---|---|---|---|---|---|
| Nombre final y sistema de marca | A | I | C | R | C |
| Actividad, capacidad y condiciones comerciales | A | C | R | I | C |
| Catálogo y tarifas completas | A | C | R | C | C |
| Fotografías y material gráfico | A | I | C | R | C |
| Arquitectura e implementación técnica | C | A/R | C | I | C |
| Pruebas del motor, pagos y permisos | I | A/R | C | I | C |
| Validación del recorrido real de cliente | A | R | R | C | C |
| Carga y conciliación de agenda futura | A | R | R | I | I |
| Formación y procedimiento diario | A | C | R | I | C |
| Publicación comercial | A | R | R | C | C |
| Campañas y seguimiento de resultados | A | C | C | R | I |
| Mantenimiento y respuesta técnica | C | A/R | C | I | I |
| Incidencias del evento y atención al cliente | A | C | R | I | C |

El nombre de la persona y su sustitución se añaden antes de publicar. «Lo lleva la agencia» o «lo hace el sistema» no identifican quién resuelve una incidencia.

## 10. Acta de aceptación y cierre de cada fase

Para cada entrega se registra: versión/fecha, entorno probado, alcance, casos ejecutados, resultado, incidencias pendientes, datos de prueba utilizados y responsable. Los casos que no aplican se justifican; los que faltan no se marcan como aprobados.

**Una demo se acepta por claridad, diseño y funcionamiento de su simulación. Una versión comercial se acepta por la operación real del flujo anunciado, sus datos, cobros, permisos y recuperación.** No se utiliza una captura de pantalla para afirmar que un proceso servidor está resuelto.

Antes de abrir reservas reales deben existir, como mínimo:

1. Oferta y actividad validadas para las opciones que aparecen a la venta.
2. Reservas futuras reconciliadas y origen único de disponibilidad definido.
3. Exclusión de solapamientos demostrada con clientes independientes.
4. Pago, estados, errores, cancelación y devolución probados.
5. Panel protegido, secretos fuera del cliente y copia restaurada con éxito.
6. Confirmaciones y comunicaciones activas comprobadas, con estados reales.
7. Atención, soporte e incidencias asignados a personas concretas.
8. Documentos y condiciones del recorrido preparados para el servicio real.

Los puntos pendientes quedan en un backlog visible con responsable y siguiente acción. El crecimiento de marketing empieza cuando el negocio puede atender y confirmar con confianza lo que la web ofrece.
