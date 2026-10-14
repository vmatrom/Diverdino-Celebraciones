# Gran Plan / Diverdino · Reservas y gestión desde un único punto

Propuesta operativa y técnica contrastada el **14 de octubre de 2026**. Especificación para desarrollar la solución; no acredita que existan conexiones activas, pagos operativos ni permisos para nuevas actividades.

## Decisión recomendada

Crear una web propia con identidad visual potente y un **panel Gran Plan para Diverdino** que concentre agenda, reservas, clientes, señales, tareas del evento y comunicaciones. El registro central de reservas será la autoridad de disponibilidad. Google Calendar servirá como calendario conectado y vista móvil; Stripe procesará la señal; WhatsApp Business Platform permitirá comunicaciones autorizadas. Las herramientas nativas de Meta seguirán disponibles para las funciones avanzadas de publicidad y redes.

Esta combinación permite que la marca y el recorrido de compra sean propios sin desarrollar un procesador de pagos o depender de automatizaciones de WhatsApp no oficiales. “Un único punto” debe significar una ficha de evento y una agenda compartida, con estados de conexión reales. No se debe prometer que todas las funciones de Google, Meta y Stripe estarán reproducidas dentro del panel.

**Supuesto de diseño por confirmar:** el local se alquila en exclusiva y representa un único recurso reservable. Si se comercializan zonas simultáneas o actividades abiertas, hay que redefinir capacidad, recursos y reglas antes de programar la venta.

## El recorrido de una reserva

1. El cliente elige tipo de celebración, fecha, franja y asistentes. Solo se ofrecen actividades, capacidad y horarios previamente validados por el propietario.
2. El servidor calcula disponibilidad considerando reservas, bloqueos, limpieza, preparación y márgenes entre eventos. Los horarios mostrados usan `Europe/Madrid` y el almacenamiento conserva fechas inequívocas para los cambios de hora.
3. El cliente ve el precio total, lo incluido, extras, señal, saldo y condiciones aplicables. La señal y la fianza por daños son conceptos diferentes y deben figurar por separado si se utilizan.
4. El servidor vuelve a comprobar disponibilidad y crea un bloqueo temporal mediante una operación indivisible en la base de datos. Dos clientes no pueden obtener el mismo espacio y tiempo.
5. Se abre una sesión de pago de Stripe vinculada al identificador de la reserva. Se recomienda comenzar con un bloqueo de 30 minutos, alineado con la expiración mínima configurable de Checkout; el tiempo exacto será una decisión comercial. Stripe admite expiración entre 30 minutos y 24 horas. [Crear una sesión de Checkout](https://docs.stripe.com/api/checkout/sessions/create).
6. El servidor verifica la notificación de pago y el estado pagado antes de confirmar. La página de “gracias” por sí sola no confirma un cobro. Se evita procesar dos veces la misma notificación. Si se habilitan medios de pago diferidos, sus estados pendientes requieren un flujo explícito y no deben tratarse como pago inmediato. [Confirmación de pagos y fulfillment](https://docs.stripe.com/checkout/fulfillment.md?payment-ui=stripe-hosted).
7. La reserva confirmada genera su evento de calendario y confirmación al cliente. Cada integración puede reintentarse sin duplicar la reserva. Un fallo de envío no anula silenciosamente un evento ya pagado: crea una tarea visible para resolverlo.
8. Los bloqueos impagados se liberan cuando el pago ya no puede completarse. La caducidad de la reserva y la de Checkout se coordinan; no se deja un enlace de pago vivo para una franja liberada.

Para eventos especiales, cenas o celebraciones de adolescentes que necesiten revisión, el recorrido será **solicitud → validación → oferta → bloqueo y señal**, con la advertencia visible de que una solicitud no garantiza disponibilidad.

### Protección real frente a solapamientos

La comprobación debe ejecutarse en el servidor y reforzarse en la base de datos, por ejemplo con restricciones de exclusión de rangos en PostgreSQL. La documentación oficial muestra este mecanismo para impedir reservas coincidentes. No basta con desactivar un botón en la web. [Restricciones de rangos en PostgreSQL](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT).

La garantía requiere que **todas las reservas y bloqueos comerciales se creen en el motor central**, incluso las recibidas por teléfono o WhatsApp. Google Calendar no debe convertirse en una segunda caja de reservas independiente. Consultar `freeBusy` y crear después un evento son operaciones separadas: entre ambas puede entrar otra petición. Esa es una inferencia de arquitectura a partir de las operaciones disponibles, no una función anti-solape que Google prometa.

Google permite consultar intervalos ocupados y crear eventos con autorización. Se conectará un calendario específico del negocio, con el acceso mínimo necesario. Los bloqueos externos se incorporarán con reglas claras, sin importar datos personales al calendario público. Si se permiten altas manuales fuera del panel, se necesita reconciliación y revisión del conflicto; no puede anunciarse una garantía absoluta de confirmación instantánea entre dos sistemas que aceptan cambios por separado. [Consulta freeBusy](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query), [crear eventos](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert).

Las notificaciones de cambios permiten sincronizar sin consultar continuamente. Sus canales requieren gestión y renovación; además se programará una reconciliación periódica y alertas de desconexión. Si no puede verificarse un bloqueo relevante, la web debe mostrar “consultar disponibilidad” en vez de inventar huecos. [Notificaciones de Google Calendar](https://developers.google.com/workspace/calendar/api/guides/push).

## Qué tendrá el panel

| Módulo | Trabajo cotidiano |
|---|---|
| Hoy | Próximo evento, tareas de preparación, pagos pendientes e incidencias |
| Agenda | Mes/semana, franjas, cierres, limpieza, altas manuales y bloqueos |
| Reserva | Cliente responsable, evento, asistentes, extras, condiciones aceptadas, señal y saldo |
| Clientes | Contacto, histórico, canal de captación y preferencias autorizadas |
| Conversaciones | Mensajes de WhatsApp si la conexión está implementada; asignación y respuesta humana |
| Contenido | Calendario editorial, borradores y materiales de campañas; acceso a herramientas nativas |
| Informes | Ocupación por franja, solicitudes, conversión, ingresos cobrados y saldo pendiente |
| Ajustes | Horarios válidos, precios aprobados, capacidad, condiciones, usuarios e integraciones |

Cada reserva tendrá una línea de actividad: quién la creó o cambió, cuándo se cobró, qué se envió y qué queda pendiente. Estados comerciales propuestos: solicitud, pendiente de revisión, bloqueo temporal, señal pagada, confirmada, celebrada, cancelada y caducada. Los estados de pago, devolución y conexión serán campos separados, para no confundir una reserva cancelada con un reembolso efectuado.

El diseño técnico puede resolverse con una aplicación web, backend, PostgreSQL gestionado, autenticación de administración, almacenamiento privado y trabajos de sincronización. No hacen falta microservicios para un local. Habrá roles de propietario/personal, copias restaurables, protección de secretos, registro de acciones y exportación de datos. La elección concreta de alojamiento y proveedor se hará con presupuesto y residencia de datos definidos.

## WhatsApp y redes con expectativas claras

WhatsApp tendrá dos niveles:

- **Inicio sencillo:** botón de contacto que abre una conversación iniciada por el cliente y WhatsApp Business para atención manual. Abrir un chat no consulta la agenda ni confirma una reserva.
- **Automatización posterior:** WhatsApp Business Platform oficial, directamente o a través de un proveedor autorizado, conectado al panel. Número, cuenta de empresa, permisos, plantillas y condiciones del proveedor se validan antes de contratar. No se da por supuesta la migración o coexistencia con el número actual.

La política vigente exige permiso para los contactos posteriores. Para iniciar conversaciones o escribir fuera de la ventana de atención de 24 horas se necesitan plantillas aprobadas. La automatización debe ofrecer una vía clara de atención humana. El panel conservará el origen del permiso y una baja sencilla; el permiso para promociones se recogerá separado de los mensajes operativos. [Política de mensajes de WhatsApp, actualizada el 23 de septiembre de 2026](https://business.whatsapp.com/policy).

Automatizaciones útiles, una vez activadas: confirmación de reserva, recordatorio de saldo, información de acceso, recordatorio previo y petición de valoración posterior. Las campañas de cumpleaños siguientes o descuentos exigen su propio tratamiento comercial; no se consideran incluidas por haber reservado una vez. Las plantillas mostradas en un prototipo serán borradores, pendientes de aprobación y configuración.

Para Facebook e Instagram se recomienda empezar con **Meta Business Suite**: planificación de publicaciones e historias, atención de mensajes e información de resultados. El panel Gran Plan organizará los contenidos y enlazará cada campaña con solicitudes/reservas. La publicación directa desde software propio se valorará como una integración adicional según permisos y funciones realmente disponibles, sin prometer todos los formatos. [Formación oficial de Meta Business Suite](https://www.facebookblueprint.com/student/path/248709-meta-business-suite-customer-connection).

## Prototipo, pruebas y producción

| Área | Prototipo revisable | Requisito para operar |
|---|---|---|
| Disponibilidad | Fechas y reservas de ejemplo, identificadas como demo | Motor servidor, datos reales, reglas y concurrencia verificados |
| Calendario | Simulación o interfaz de conexión | Autorización del propietario, calendario elegido, sincronización y alertas probadas |
| Señal | Resumen sin cargo o modo de prueba | Cuenta del negocio verificada, condiciones, claves protegidas y webhooks válidos |
| WhatsApp | Enlace de contacto y borradores | Cuenta/número autorizados, permisos, plantillas, registro de bajas y prueba de entrega |
| Redes | Calendario editorial y creatividades | Accesos del propietario, activos vinculados y permisos concedidos |
| Panel | Datos ficticios sin acceso a operaciones reales | Inicio de sesión, roles, auditoría, copias y procedimiento de recuperación |

Antes de abrir ventas se comprobarán dos intentos simultáneos sobre la misma franja, caducidad de pago, notificación duplicada, pago rechazado, cancelación, reembolso, fallo de calendario, cambio de hora, baja de comunicaciones y restauración de copia. No se solicitarán claves privadas por chat: las credenciales se introducirán en el entorno de despliegue.

## Costes contrastados y partidas a presupuestar

La tarifa pública estándar de Stripe España consultada es **1,5 % + 0,25 € por pago con tarjeta estándar del EEE**. Como ejemplo puramente aritmético, cobrar una señal de 50 € implicaría 1 € a esa tarifa; otras tarjetas y servicios pueden tener precios distintos. No constituye un presupuesto del proyecto ni fija el importe de señal. [Tarifas de Stripe España](https://stripe.com/es/pricing).

WhatsApp aplica precios según país y categoría de mensaje; el proveedor de bandeja o automatización puede sumar sus propios costes. Se presupuestará con el volumen previsto y la tabla vigente al contratar, sin prometer mensajería ilimitada o gratuita. [Precios oficiales de WhatsApp Business Platform](https://business.whatsapp.com/products/platform-pricing).

Google indica que el uso estándar de Calendar API está disponible sin coste adicional dentro de sus umbrales; su documentación actualizada en septiembre de 2026 anuncia cargos futuros por exceso. Revisar las condiciones al activar. Una suscripción de Workspace, alojamiento o mantenimiento son partidas independientes. [Cuotas y precios de Google Calendar API](https://developers.google.com/workspace/calendar/api/guides/quota).

Se deberán presupuestar por separado desarrollo y puesta en marcha, dominio, alojamiento/base de datos/copias, correo transaccional, proveedor de WhatsApp si procede, mantenimiento, fotografía, impresión y gasto publicitario. No hay una cifra global fiable sin alcance y datos de operación.

## Confirmaciones del propietario antes de comercializar nuevas líneas

Se necesita el documento de actividad y las condiciones del local para validar con técnico competente/Ayuntamiento el uso autorizado, aforo, horarios, aislamiento acústico, karaoke, cocina/catering, seguros y supervisión. Tener cocina y karaoke no demuestra por sí mismo que cenas o fiestas nocturnas estén permitidas. El Ayuntamiento dispone de una ordenanza de actividades y la Generalitat de un procedimiento de compatibilidad cuando varían público, horario o dotaciones. [Ordenanza de actividades de Elche](https://www.elche.es/wp-content/uploads/download-manager-files/ORDENANZA_ACTIVIDADES_AYUNTAMIENTO_ELCHE.pdf), [compatibilidad de actividades en la Generalitat](https://sede.gva.es/es/detall-tramit?id_proc=17762).

La Ley valenciana 14/2010, artículo 34, en el texto consolidado consultado, prevé acompañamiento autorizado para menores de 16, autorización escrita para 16–18 y medidas de admisión y protección en su ámbito de aplicación. El encaje concreto de una fiesta privada y de la actividad de Diverdino requiere comprobación; no se resuelve por etiquetar un pack “16” o “18”. La web solo publicará condiciones y franjas aprobadas para esa actividad. [Texto consolidado oficial](https://boe.es/buscar/act.php?id=BOE-A-2010-20014).

Las fotografías para publicidad necesitan una base válida y un proceso documentado. La imagen es un dato personal; se recomienda trabajar inicialmente con el local vacío, detalles y modelos autorizados. No se debe asumir que quien reserva puede autorizar por todos los invitados. El consentimiento de imagen y el de marketing estarán separados de la contratación. [AEPD: imágenes y vídeos en internet](https://www.aepd.es/areas-de-actuacion/internet-y-redes-sociales/eliminar-fotos-y-videos-de-internet).

Datos imprescindibles para cerrar el desarrollo: titular y contacto comercial, licencia/condiciones vigentes, capacidad, franjas con preparación y limpieza, servicios realmente incluidos, precios e impuestos, señal, saldo, cancelación/cambios, fianza si existe, política de comidas, edad y supervisión, cuentas actuales y responsables de atención. Con estos datos se puede pasar del diseño demostrable a una operación real sin rehacer la marca.
