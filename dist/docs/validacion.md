# Validación de la propuesta · 14/10/2026

## Entorno y método

Se utilizó el navegador integrado de Codex mediante CUA/IAB, sin recurrir a un navegador externo. Origen local comprobado: `http://127.0.0.1:43167`. Las tres páginas devolvieron contenido significativo. Se comprobó la identidad por título y ruta, ausencia de pantalla en blanco y de errores de aplicación en la consola.

Se verificaron tamaños CSS de escritorio **1536 × 1024** y móvil **390 × 844**. El proveedor de capturas del IAB devuelve imágenes de su superficie visible (por ejemplo 1521 × 856 para escritorio), por lo que no permite una comparación de píxel exacto a la resolución nativa del concepto 1536 × 1024. Se inspeccionaron la vista disponible y el diseño con sus dimensiones CSS; esta limitación no se presenta como una verificación de píxel exacto.

## Recorrido probado en la primera versión

Los importes de esta tabla corresponden a la versión inicial y al cartel anterior. La revisión posterior de la propiedad fija limpieza 25 €, hora extra 20 €, aforo 75 y calendario actual Shifter. Las comprobaciones de la revisión vigente se añaden al final de este documento.

| Comprobación | Resultado observado |
|---|---|
| Portada, panel y propuesta | Títulos, rutas, contenido y enlaces internos presentes |
| Reserva L–J mañana con limpieza | 80 € + 20 € = 100 € de referencia |
| Reserva L–J tarde | 100 € de referencia, 16:00–21:00 |
| Fin de semana mañana | 120 € de referencia |
| Fin de semana tarde | 130 € de referencia, 16:00–21:30 |
| Día completo | 190 € de referencia, 10:00–21:00 |
| Festivo simulado en un día L–J | Aplica la tarifa de festivo de referencia |
| Crear reserva de prueba | Registro local y confirmación explícita de demo |
| Repetir turno ocupado | Rechazo comprensible, sin segunda confirmación |
| Mañana ocupada → día completo | Conflicto detectado |
| Día completo ocupado → tarde | Conflicto detectado |
| Social | Solicitud por revisar, sin confirmación ni precio comercial inventado |
| Panel | Refleja reservas del navegador y señal simulada, sin afirmar cobros |
| Calendario | Cambio de mes, ocupación y filtro por día funcionan |
| Cancelar / restaurar | Estado cambia y se puede recuperar la prueba |
| Exportación CSV | Descarga con filas de prueba, importes simulados y estado |
| Marketing | Se copia un borrador; no se publica automáticamente |
| Conexiones | Las cuatro permanecen sin conectar; no hay toggles ficticios |
| Propuesta editorial | El desplegable de la semana 2 abre el contenido correcto |
| Móvil | Portada, propuesta y panel revisados; sin desbordamiento de página al finalizar |
| Consola | Sin errores ni avisos relevantes en los recorridos observados |
| JavaScript | `node --check` superado para data.js, booking.js, panel.js y servidor |

La exportación no contiene nombres ni contactos reales. Los registros usados fueron creados expresamente como pruebas locales, sin afectar al calendario del negocio. No se probaron pagos ni servicios externos porque no están conectados.

## Comparación con la dirección visual

Referencias: `brand/concepts/portada-colores-originales.png`, `experiencias.png`, `reservas.png` y `panel.png`. Se inspeccionaron los conceptos y las capturas de implementación con `view_image`.

| Punto | Evidencia / resolución |
|---|---|
| Texto de portada | Coinciden titular, descripción, navegación y acciones con el concepto revisado. Sin etiquetas decorativas añadidas sobre el titular. |
| Paleta | Se sustituyó la primera exploración bosque/coral/lila por los cinco colores originales, siguiendo la instrucción del usuario. Fondo claro y tinta como soporte. |
| Tipografía | Bricolage Grotesque y DM Sans para la web. Se corrigió el tracking excesivo del titular y se unificó la fuente de los controles del panel. Son fuentes web concretas; la tipografía raster del concepto no tiene un archivo de fuente exacto identificable. |
| Composición | Portada abierta a dos columnas; imagen con marco redondeado y sin velo de color. Tres experiencias en columnas; banda de equipamiento; formulario de reserva; preguntas y pie. |
| Imágenes | Activos independientes regenerados en el mismo lenguaje; se corrigió la altura de las tres imágenes de experiencias para conservar su proporción 4:3. Se identifica su carácter creativo. |
| Interacción | Formulario, reservas, agenda, filtros, pestañas y desplegables son controles reales de la demo. |
| Móvil | Se corrigió un desbordamiento de la tabla causado por un elemento accesible posicionado; la tabla ahora desplaza dentro de su contenedor. Se ajustó la cabecera y el corte del titular del panel. |
| Iconos | Equipamiento con SVG de trazo consistente; panel con símbolos SVG y textos accesibles. |

Desviaciones intencionadas: nombre paraguas Gran Plan tras la elección de arquitectura de marca; colores originales por petición posterior; calendario mensual en el panel para responder al trabajo diario; controles y avisos adicionales para explicar los límites de la demo; eliminación del personaje decorativo del área general de reserva; bloque de material original en la propuesta. La escena de portada es un activo independiente y su encuadre no es idéntico al render de referencia. Se utilizan variantes más oscuras del fucsia en botones pequeños (#c30a6b; blanco 5,87:1) y en el titular sobre turquesa (#a90061; 3,56:1) para mejorar el contraste.

El diseño se ha contrastado con sus referencias para verificar composición, texto, color, tipografía, activos y respuesta móvil. No quedan defectos visuales conocidos que impidan revisar la propuesta. No se afirma coincidencia de píxel exacta ni certificación de accesibilidad completa.

## Pendiente de producción

Motor servidor con exclusión de intervalos; cuentas y autorización de calendario, pagos y WhatsApp; revisión de identidad y disponibilidad del nombre; maestros de marca e impresión; fotografías del espacio real y condiciones comerciales cerradas. La disponibilidad de esta demo no representa disponibilidad real y su almacenamiento local no resuelve concurrencia entre clientes.

## Revisión vigente: marca amplia y prioridad infantil

Se revisaron portada, formulario, panel y propuesta tras las últimas instrucciones. La referencia final es `brand/concepts/portada-familiar.png`, inspeccionada junto con `portada-familiar-escritorio.jpg` mediante `view_image`. El titular, párrafo, acciones y distribución se corresponden con esa dirección; la escena independiente conserva el dinosaurio completo, la tarta y los colores originales. La tipografía web y el encuadre mantienen las diferencias intencionadas descritas arriba. Las tarjetas dan mayor anchura a Kids en escritorio. Se añade un acceso específico para charlas, talleres y otros encuentros, sin limitar la marca a tres formatos.

| Comprobación vigente | Resultado observado |
|---|---|
| Cumpleaños L–J mañana, limpieza y 75 personas | 80 + 25 = 105 €; prueba guardada en la agenda |
| Límite de asistentes | 76 impide el envío mediante la validación del campo; máximo 75 |
| Charla sábado mañana con limpieza | Referencia 120 + 25 = 145 €; guardada «Por revisar», con presupuesto pendiente |
| Persistencia en panel | Aparecen el cumpleaños de 75 personas y la charla de 40; una sola reserva demo activa |
| Acceso «Cuéntanos tu idea» | Abre el formulario seleccionando «Otro encuentro» |
| Calendario actual y canales | Panel identifica Shifter; las conexiones siguen pendientes; TikTok tiene borrador de guion |
| Móvil vigente | Portada, panel y propuesta a 390 × 844 CSS; ancho de contenido 375 px, sin desbordamiento de página |
| Consola vigente | Sin errores ni avisos capturados en los recorridos de revisión |

Capturas guardadas fuera del repositorio en `C:/Users/vmateu/.codex/visualizations/2026/10/14/01a13a4b-0ffb-7f22-a821-2683edff9d58/`: `portada-familiar-escritorio.jpg`, `portada-familiar-movil.jpg`, `reservas-movil-v2.jpg`, `panel-movil-v2.jpg`, `propuesta-movil-v2.jpg`. Las capturas pueden corresponder a un tramo visible y no equivalen a una auditoría de todas las combinaciones de navegador. No se conectó ni modificó Shifter.
