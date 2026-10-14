# Repositorios aportados: uso en el proyecto

## Incorporación vigente: CodeX y HyperFrames

Se revisaron [codex-team](https://github.com/codex-team), [su web](https://codex.so), [CodeX Docs](https://github.com/codex-team/codex.docs) y [CodeX Media](https://github.com/codex-team/codex.media). Se elige como referencia el patrón de [tarjetas de eventos de CodeX Media](https://github.com/codex-team/codex.media/blob/master/www/public/app/css/components/event-card.css): imagen de portada, borde fino, título breve y acción separada. Se adapta con CSS propio a las ocasiones del local, la paleta original, el Dino de Material y esquinas amplias. Es una adaptación visual; no se instala el CMS ni se traslada su código de servidor.

De [HyperFrames](https://github.com/heygen-com/hyperframes) se incorporan fragment shaders de `sdf-iris` y `ripple-waves`, adaptados a un selector de imágenes WebGL en la portada. Fuente fijada al commit `d65eefad5ed351e9d36d2caeb6049878be0aba85`, archivos `packages/shader-transitions/src/shaders/common.ts` y `registry.ts`. La copia seleccionada, cambios y licencia Apache-2.0 del repositorio se incluyen en `site/dist/vendor/`. El motor de presentación es propio: dibuja únicamente durante los cambios solicitados por el visitante, con límite de resolución y retorno a imágenes estáticas si WebGL falla.

Los titulares tienen entrada escalonada; las tarjetas aparecen al entrar en pantalla; el panel anima el cambio de pestaña. Se incluye transición circular entre páginas en navegadores con View Transitions. El contenido permanece disponible si falla JavaScript. `prefers-reduced-motion` desactiva estas animaciones y permite seguir seleccionando imágenes. No hay reproducción automática continua ni cambios de escena mientras el visitante lee.

Se retiran «demo» y «360» del texto visible. El formulario comercial calcula el importe y abre una consulta de WhatsApp preparada, que el visitante decide enviar. No presenta disponibilidad automática ni genera reservas confirmadas. El panel identifica su agenda como local y conserva visibles las conexiones pendientes.

Revisión del 14/10/2026. El texto aportado mezclaba recursos para construir webs y temas para cambiar la aplicación Codex. El objetivo aquí es mejorar la web del local; las decisiones de la propiedad sobre colores y público prevalecen sobre los presets externos.

| Recurso verificado | Aplicación concreta |
|---|---|
| [vipulgupta2048/codex-skills](https://github.com/vipulgupta2048/codex-skills/tree/master/skills/frontend-design) | Se leyó la guía y sus patrones vanilla. Se aplican escalas de espacio, composición asimétrica, tamaño de controles y movimiento con alternativa reducida. La paleta se adapta a Diverdino. |
| [Ilm-Alan/frontend-design](https://github.com/Ilm-Alan/frontend-design) | Disciplina de contenido, tokens e iconos. Se mantienen datos reales, estados demo explícitos y SVG coherentes. Sus ocho paletas no se adoptan porque la propiedad exige sus colores. |
| [Wikimedia/design-codex](https://github.com/wikimedia/design-codex) | Referencia para estructura de controles, foco y accesibilidad. No se afirma que la web esté certificada ni que utilice el paquete Vue. |
| [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) | Referencia de revisión del diseño y tratamiento responsive; se consultó el recurso web-design-engineer. |
| [marvkr/better-design](https://github.com/marvkr/better-design) | Se contrastó su propuesta de tokens, jerarquía y revisión. No se ha instalado su MCP ni adoptado una identidad de otra marca. |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | Se verificó que es un entorno de diseño completo; no se añade como dependencia de una web estática. |
| `mcpso/good-css` | La URL aportada devolvió 404 en la consulta. No se presenta como dependencia instalada ni como fuente comprobada. |
| Temas de la aplicación Codex | Se revisaron [awesome-codex-themes](https://github.com/mcpso/awesome-codex-themes) y [codex-themes](https://github.com/freestylefly/codex-themes). No se aplican a la web de un local ni se modifica la aplicación del usuario. |

La implementación sigue siendo HTML/CSS/JS sin dependencias de ejecución. `site/dist/refinements.css` contiene CSS propio que aplica estas referencias: jerarquía infantil prioritaria dentro de una marca amplia, marco del personaje, escala de espacios, adaptación móvil, foco y transiciones moderadas. No se copió un tema completo ni se ejecutaron scripts de instalación de esos repositorios.

Las copias de lectura local están en `references/design/`. Son documentación de consulta; no forman parte de los archivos servidos por la web. Esta revisión no sustituye una auditoría de seguridad o licencia de las herramientas completas.
