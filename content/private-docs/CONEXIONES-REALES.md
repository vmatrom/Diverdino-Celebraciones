# Conexiones de Diverdino

## Estado y accesos necesarios

- La agenda, el importador de bloqueos y los archivos pertenecen al backend privado de Sites.
- GitHub Pages publica la web estática. Su calculadora consulta la fecha por WhatsApp: no tiene acceso público al backend privado. No publicar un token de acceso al backend en Pages.
- Las cuentas profesionales de Instagram y Facebook están vinculadas, según confirma la propiedad. Falta autorizar el proveedor de publicación y comprobar las cuentas de destino.
- TikTok: `@diverdino44`. No hay autorización de publicación verificada.
- El dominio `diverdinoelche.com` pertenece actualmente a un tercero y no hay acceso a DNS. No modificar CNAME ni configurar el dominio en GitHub hasta recuperar el control.

## Shifter sin perder la aplicación actual

La ficha oficial de LRHSoft anuncia exportación a Google Calendar. No se ha encontrado documentación de una API pública de Shifter. Exportar no demuestra sincronización continua o bidireccional.

1. Usar un calendario dedicado exclusivamente a las reservas del local en Shifter y exportarlo a Google Calendar.
2. En Google Calendar para ordenador: Configuración → Importar y exportar → Exportar. Extraer el `.ics` del calendario de reservas del ZIP. No importar el calendario personal completo.
3. Panel Diverdino → Conexiones → Trae tu agenda de Shifter. Subir `.ics` (hasta 55 KB y 100 eventos) y revisar fechas y turnos.
4. Resolver todos los avisos y conflictos antes de confirmar. Los eventos de un día completo bloquean ambos turnos. Los parciales ocupan el turno completo con el que solapan. UTC se interpreta en Europe/Madrid, incluido el cambio de hora.
5. Confirmar la importación y revisar los bloqueos en Agenda. No generan clientes, ingresos ni confirmaciones de pago.

El UID del evento evita duplicados y permite cambiar fecha o turno al reimportar. Una cancelación explícita con el mismo UID libera el bloqueo. La ausencia de un evento en otra exportación **no lo elimina**: así no se liberan fechas por exportar solo un mes. Si Google elimina por completo el evento, liberar su bloqueo manualmente en el panel. Cambios de UID o de calendario de origen pueden crear bloqueos distintos; revisar antes de confirmar. No importar dos veces el mismo calendario con UIDs regenerados.

Los eventos recurrentes, zonas distintas de Madrid/UTC y eventos nocturnos o de varios días requieren revisión manual. Si un archivo contiene avisos, no se importa parcialmente. Los conflictos se validan también en SQL dentro de la operación atómica, evitando carreras con reservas nuevas. Los títulos permanecen privados.

## Publicación en redes

Opción de proveedor: Metricool. Su integración MCP permite trabajar con el asistente, pero no convierte por sí sola el panel de Diverdino en cliente de publicación. El panel necesitaría su API, disponible en planes Advanced y Custom, y un token guardado únicamente como secreto de servidor. No contratar ni activar un plan automáticamente.

Antes de habilitar envíos: autorizar Facebook/Instagram y TikTok en la marca Diverdino; verificar los IDs de cuentas, permisos, formatos y zona horaria; enviar únicamente publicaciones aprobadas por el administrador. El proveedor debe devolver un identificador de programación/publicación y leerse de vuelta. Guardar una fecha editorial o pulsar «Publicada» manualmente no prueba un envío. No usar publicaciones reales como pruebas sin autorización sobre el contenido concreto.

Opción directa: aplicación Meta con permisos de publicación y aplicación TikTok con Content Posting API aprobada. En TikTok, un cliente no auditado limita la visibilidad a privado. Necesitaríamos OAuth autorizado, tokens de servidor, renovación, cola persistente, programación, estados por canal, prevención de duplicados y comprobación posterior. No sustituir la autorización por contraseñas guardadas ni automatización de sesiones del navegador.

## Estadísticas de Pages y Search Console

`public/integrations.json` contiene solo identificadores públicos:

- `ga4MeasurementId`: ID real `G-...` del flujo web de GA4. Vacío significa sin conexión. No añadir secretos.
- `googleSiteVerification`: valor `content` de la etiqueta HTML de Google. Vacío significa que no se inserta ninguna etiqueta. Publicar la etiqueta no implica verificación conseguida.
- `publicUrl`: Pages actual; cambiar al dominio definitivo únicamente cuando el DNS y GitHub estén listos.

GA4: elegir o crear la propiedad Diverdino y el flujo de la URL actual, configurar Europe/Madrid y EUR. Desactivar la medición mejorada automática del flujo (formularios, clics salientes, historial) para usar únicamente nuestros eventos controlados y no transmitir parámetros de enlaces de WhatsApp. El sitio carga gtag solo tras consentimiento. Eventos: `page_view`, `calculate_price`, `contact_whatsapp`, `open_celebration`. No enviar fecha, asistentes, códigos ni datos del formulario. Verificar Tiempo real con consentimiento y ausencia de medición al rechazar. Las cifras agregadas de D1 en el panel no son cifras de GA4: integrar sus informes requiere además lectura autorizada de GA4 (por ejemplo, Windsor.ai).

Search Console puede activarse ya sin DNS del dominio de un tercero: crear una propiedad de **prefijo de URL** `https://vmatrom.github.io/Diverdino-Celebraciones/`, copiar el contenido de la etiqueta HTML, publicarlo, volver a Google y verificar. Enviar `https://vmatrom.github.io/Diverdino-Celebraciones/sitemap.xml`. Mantener la etiqueta tras verificar.

## Cuando se recupere el dominio

1. Verificar titularidad y guardar los DNS existentes; preservar MX/TXT de correo y verificaciones. Confirmar si la web anterior debe seguir accesible durante el cambio.
2. Verificar el dominio en GitHub y configurar `www.diverdinoelche.com` como dominio personalizado según los registros oficiales vigentes de Pages. No asignar la IP del backend privado a Pages.
3. Cuando el DNS resuelva correctamente, cambiar `publicUrl`, generar CNAME, revisar canonical, imágenes sociales y sitemap, habilitar HTTPS y comprobar redirecciones de apex/www.
4. Crear/verificar la propiedad de dominio de Search Console mediante TXT cuando haya acceso; enviar el nuevo sitemap. Conservar la propiedad de Pages y los datos anteriores.
5. Actualizar el flujo GA4 y sus dominios, y comprobar eventos y consentimiento. La configuración de dominio no da acceso al panel administrativo ni a su API.

Fuentes oficiales consultadas:

- https://play.google.com/store/apps/details?id=com.lrhsoft.shiftercalendar
- https://support.google.com/calendar/answer/37111
- https://help.metricool.com/plans-add-ons-and-api-access-explained-xux1u
- https://developers.tiktok.com/doc/content-posting-api-get-started
- https://support.google.com/webmasters/answer/9008080
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- https://developers.google.com/analytics/devguides/collection/ga4/reference/config
