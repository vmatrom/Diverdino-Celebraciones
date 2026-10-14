# Diverdino · Tu lugar de celebraciones

Web de celebraciones de Elche y portal privado de administración.

- Web pública: https://vmatrom.github.io/Diverdino-Celebraciones/
- Administración: https://gran-plan-diverdino-propuesta.amusedfir32.chatgpt.site/admin
- Negocio: Carrer Francisco Vicente Rodríguez, 38, 03202 Elche. WhatsApp +34 644 580 495. Aforo conjunto de 75 personas.

## Estructura y publicación

`public/` contiene la web final con material real aportado por el negocio. `scripts/build-pages.mjs` prepara únicamente el contenido público para GitHub Pages. El workflow `pages.yml` lo publica al actualizar `main`. No copia bases de datos, archivos de clientes, claves, formularios del panel ni su contenido.

`build/sites-worker.ts` conserva la integración oficial de Sites y enruta el backend de `lib/backend.ts`. D1 guarda reservas, ocupación, códigos, contactos adultos, contenido editorial, tareas, estadísticas agregadas y auditoría. R2 guarda las fotos y vídeos subidos desde administración. Las migraciones están en `drizzle/`.

Pages es alojamiento estático: calcula precios y prepara consultas por WhatsApp. La agenda, el acceso, la biblioteca y los datos privados se ejecutan en el servidor de Sites. En ese servidor, el formulario consulta los turnos registrados antes de preparar la consulta. Una solicitud por WhatsApp no confirma ni bloquea la fecha.

## Acceso y configuración

El inicio de sesión utiliza la identidad de ChatGPT proporcionada por Sites. Cada ruta administrativa valida la identidad y el rol en el servidor. `ADMIN_EMAIL`, configurado como secreto en el alojamiento, permite registrar el identificador estable de la cuenta propietaria como administrador. No hay contraseñas predeterminadas ni secretos en el repositorio.

Para desarrollo local, copia `.env.example` a `.dev.vars` y usa el correo local que anuncia el servidor. El simulador de identidad del starter solo funciona en loopback y se elimina del despliegue de producción.

```sh
npm ci
npm run build
# Aplica cada SQL de drizzle/ a la base local con Wrangler (no a producción).
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_red_susan_delgado.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_booking_guards.sql
npm run dev -- --hostname 127.0.0.1 --port 43167
```

En Windows, si la envoltura de npm del equipo falla, invoca su `npm-cli.js` con Node. No cambies la configuración global para resolverlo.

## Gestión

- Reservas por mañana, tarde o día completo. Unicidad de ocupación y operaciones atómicas impiden dobles reservas. Cancelar libera el turno.
- Códigos en euros o porcentaje, vigencia, límite de usos, pausa, recomendaciones y segundo cumpleaños. Un código por reserva y descuento solo sobre el alquiler. El administrador verifica el cumpleaños previo; los referidos no admiten autorrecomendación.
- Perfil con importes preferidos para nuevos códigos. Los códigos existentes no cambian al editar el perfil.
- Biblioteca privada con validación de tipo y firma de archivo, hasta 25 MB. Publicar un evento exige confirmar permisos; los borradores y sus archivos no se sirven anónimamente.
- Compositor editorial común para Instagram, Facebook y TikTok con texto, archivo, fecha y hora deseadas. **Los envíos automáticos aún requieren integrar y autorizar las cuentas; guardar una fecha no programa un envío real.**
- Estadísticas propias agregadas únicamente con consentimiento, sin almacenar IP ni identificadores de visitantes. Cuentan páginas y acciones, no personas únicas. No incluyen el tráfico de GitHub Pages mientras este no disponga de un backend público autorizado.
- Temas de conversación a partir de menciones introducidas con su fuente. No se accede a mensajes privados ni se simula escucha automática.
- Ayuda en cada sección: hover, foco de teclado y botón para móvil.

## Conexiones pendientes de configuración externa

Shifter es **Work Shift Calendar de LRHSoft**, `com.lrhsoft.shiftercalendar`. La exportación a Google Calendar depende de la versión/plan. No se ha verificado una API ni sincronización bidireccional. Hay que trasladar y comprobar las reservas existentes antes de considerar completa la agenda.

Instagram y Facebook requieren cuentas profesionales, autorización Meta y un servicio de publicación. TikTok requiere autorización y una integración aprobada de Content Posting API. WhatsApp automático requiere Business Platform. Los enlaces públicos y el trabajo editorial manual funcionan sin estas autorizaciones. Nunca se presenta un envío pendiente como publicado.

## Animación y accesibilidad

Transiciones WebGL de iris y ondas adaptadas de HyperFrames con licencia Apache 2.0 y atribución en `public/vendor/`. Invitaciones expansibles con traslado de imagen y curva de resorte, menús de móvil con expansión circular, confeti y globos en las interacciones. Se respeta `prefers-reduced-motion`; sin WebGL se cambia la imagen directamente. Los diálogos mantienen el foco y se cierran con Escape.

Referencias: https://github.com/heygen-com/hyperframes, https://github.com/appssemble/appstore-card-transition y https://github.com/HeroTransitions/Hero. Los dos últimos inspiran la interacción; no se incorporan bibliotecas iOS. Roket inspira la separación por celebraciones e instalaciones; no se copian textos ni servicios ajenos.

Las imágenes de entrada, mesas, juegos y detalle se extrajeron de los vídeos originales de `Material/` y se optimizaron a WebP. No se inventaron instalaciones ni se sustituyeron por espacios generados. Los originales se conservan en el proyecto local.

## SEO y comprensión por asistentes

HTML semántico, título y descripción locales, un H1, textos alternativos, contacto consistente, preguntas frecuentes visibles, datos JSON-LD de negocio y FAQ, sitemap, robots, Open Graph y resumen `llms.txt`. El archivo de resumen es opcional y no garantiza recomendaciones. No se inventan reseñas ni puntuaciones.

Pages genera su propia URL canónica. Al conectar `www.diverdinoelche.com` al nuevo alojamiento, actualiza la URL de `scripts/build-pages.mjs`, canonical, sitemap, datos estructurados y URLs de imagen; evita publicar dos copias indexables. Después verifica Search Console y la ficha de Google Business Profile. La publicación privada de Sites no se indexa.

Fuentes: [Google: funciones de IA y tu web](https://developers.google.com/search/docs/appearance/ai-features?hl=es), [guía de imágenes](https://developers.google.com/search/docs/appearance/google-images), [Shifter](https://www.lrhsoft.com/wsc.html).

## Pruebas

```sh
node scripts/check-public.mjs
npx tsc --noEmit
node scripts/test-backend.mjs
node scripts/build-pages.mjs
npm run build
```

`test-backend.mjs` rechaza destinos que no sean localhost y ejecuta pruebas E2E sobre D1 y R2 locales: acceso, suplantación de cabeceras, CSRF, aforo, concurrencia, solapamiento, cancelación, códigos, archivos y visibilidad de borradores. Los datos de prueba nunca se despliegan. `backend.yml` repite estas verificaciones en una base aislada de GitHub Actions. La revisión del navegador cubre escritorio y móvil, invitaciones, formularios, ayudas y consola. No equivale a un estudio con clientes reales ni a pruebas en todos los dispositivos.
