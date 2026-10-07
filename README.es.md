# LLM Output Clarity: una habilidad para agentes inspirada en Karpathy

**Comprende la conclusión. Revisa la evidencia. Decide el siguiente paso.**

[English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

[Instalación](./docs/installation.md) | [Diseño](./docs/design.md) | [Evaluación](./evals/README.md)

Esta habilidad organiza explicaciones complejas de IA en texto claro, diagramas,
HTML interactivo o vídeos explicativos. El objetivo no es reducir palabras a toda
costa, sino facilitar la comprensión sin perder hechos, condiciones ni incertidumbre.

Se inspira en la [publicación de Andrej Karpathy del 2 de octubre de 2026](https://x.com/karpathy/status/2105819303471976479).
Cuando los agentes hacen más trabajo, las personas necesitan entenderlo y revisarlo.
Karpathy propone escritura cercana a ASD-STE100, diagramas, páginas interactivas
y vídeos hechos para una pregunta concreta.

Este proyecto es independiente: no está afiliado a Karpathy ni a ASD, ni cuenta
con su respaldo. No certifica el cumplimiento de ASD-STE100 ni verifica hechos.

## Elegir el formato

| Formato | Cuándo ayuda | Qué incluye |
| --- | --- | --- |
| Texto claro | Conclusiones, explicaciones y recomendaciones | Reglas de claridad y conservación de la evidencia |
| Diagramas e imágenes | Relaciones, bifurcaciones, secuencias o estructura espacial | Selección de diagramas, hipótesis señaladas y alternativa textual |
| HTML interactivo | Comparar estados, cambiar parámetros o explorar detalles | Guía para páginas accesibles que funcionen sin conexión |
| Vídeo explicativo | Aprender procesos mediante movimiento y narración | Guion, storyboard, renderizado y comprobación |

Una pregunta sencilla no necesita un diagrama. El HTML y el vídeo requieren una
petición explícita o un acuerdo. La habilidad no instala navegadores, motores de
vídeo, modelos de voz ni servicios de pago.

## Ejemplo ficticio

Datos: tres de veinte solicitudes devolvieron HTTP 429. Tanto la pasarela como
el servicio posterior pueden limitar solicitudes. No hay cabeceras de respuesta.

**Engañoso:** «La cuota de la pasarela es insuficiente. Aumenta la concurrencia».

**Más claro:** «No aumentes todavía la concurrencia. Tres solicitudes devolvieron
429, pero se desconoce qué servicio impuso el límite. Revisa las cabeceras y los
registros correspondientes antes de decidir un cambio de cuota o concurrencia».

Es un ejemplo del comportamiento deseado, no un resultado medido de un modelo.
Las reglas también conservan la atribución de las fuentes, revisan las hipótesis
ante nuevas pruebas y respetan formatos exactos como JSON sin texto adicional.
Una revisión de código sigue presentando primero los hallazgos más graves, sin
imponer la misma plantilla a todas las tareas.

## Instalar

Instala directamente desde el repositorio de GitHub:

```sh
npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy
```

La misma carpeta estándar Agent Skills sirve para Claude Code, Codex, Cursor,
Gemini CLI, OpenCode, GitHub Copilot y otros entornos admitidos por el instalador.
Skills CLI detecta herramientas y pide una selección cuando hace falta. Revisa
los destinos en su resumen. En instalaciones desatendidas, indica `--agent`
explícitamente; no uses `--all` como sustituto de elegir tus herramientas.
El instalador externo Skills CLI necesita Node.js, red y permiso de escritura.
La habilidad no necesita que ejecutes `npm install` para usarla. Para instalación
manual sin conexión y para desactivar la telemetría del instalador, consulta la
[guía de instalación](./docs/installation.md). La habilidad no tiene telemetría propia.

Para limitar los destinos, añade uno o varios identificadores. Por ejemplo:

```sh
npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy --agent claude-code codex
```

La guía de instalación incluye otros identificadores y rutas manuales. Que el
instalador admita un entorno no demuestra que esta habilidad se haya probado allí.

El código está en [stoneboy100200/llm-output-clarity](https://github.com/stoneboy100200/llm-output-clarity).
Para instalar una copia local revisada, sustituye el identificador del repositorio
por `.` y ejecuta desde su raíz. Este proyecto no publica un paquete npm.

## Usar

Tras instalarla, pide la habilidad por su nombre sin depender de un prefijo:

```text
Usa llm-output-clarity para analizar este fallo en español. Separa observaciones de hipótesis.
Usa llm-output-clarity para dibujar el flujo de solicitudes y señalar las relaciones no confirmadas.
Usa llm-output-clarity para crear un HTML sin conexión que compare el antes y el después.
Usa llm-output-clarity para preparar el storyboard de un vídeo. No instales software todavía.
```

Los atajos explícitos varían: Claude Code usa `/llm-output-clarity`, Codex usa
`$llm-output-clarity` y Copilot usa `/llm-output-clarity`. En otras herramientas,
consulta el menú de habilidades o su documentación. El entorno debe cargar la
habilidad; una API de modelo por sí sola no descubre archivos locales.
Un entorno compatible puede seleccionarla por relevancia, pero la activación
automática no está garantizada.

Por defecto se aplica a la petición actual. Puedes pedir «Usa esta habilidad
durante el resto de la sesión». «Stop clarity mode» indica al agente que no la
reactive en esa conversación hasta que vuelvas a pedirlo. Una nueva conversación
sigue las reglas de selección del entorno: no se guarda un interruptor persistente.
La compresión del contexto puede debilitar el seguimiento. Son instrucciones,
no un control obligatorio implementado en software. Instalarla no cambia otras
habilidades ni las instrucciones permanentes.

## Verificar, actualizar y desinstalar

```sh
npx skills list --global
```

Comprueba también la lista de habilidades o los ajustes de tu herramienta;
recarga o inicia una sesión nueva cuando sea necesario. El registro del instalador
no prueba que el entorno la haya cargado, ni eso demuestra que cumpla las reglas.
Prueba una tarea breve con una causa desconocida. La guía incluye comprobaciones por entorno.

Para actualizar una instalación local, revisa los cambios del origen y repite
el comando de instalación. Conserva una copia de tus modificaciones antes de
reemplazarlas. La guía de instalación explica las actualizaciones remotas.

Para eliminar una instalación de usuario gestionada por Skills CLI:

```sh
npx skills remove llm-output-clarity --global
```

Sin `--agent`, la eliminación puede afectar a esta habilidad en varios entornos.
Añade `--agent` para limitar el destino y revisa el alcance antes de confirmar.

Si la copiaste manualmente, elimina solo el directorio de esta habilidad. Retira
por separado cualquier preferencia permanente que hayas añadido y abre una
conversación nueva.

## Idiomas y límites

**La salida no está limitada a cinco idiomas.** Las instrucciones están escritas
en inglés, pero las respuestas siguen el idioma solicitado sin una lista cerrada.
Puedes pedir francés, alemán o portugués, por ejemplo; la calidad depende del
modelo y no está validada aquí. No se trasladan mecánicamente los límites de palabras o los tiempos
verbales ingleses a otros idiomas. Hay casos ficticios en inglés, chino,
español, japonés y árabe.

- Tener casos de prueba o una traducción no demuestra calidad lingüística.
- Las traducciones del README son borradores pendientes de revisión por personas
  con dominio del idioma. El inglés es la versión de referencia; las guías
  avanzadas enlazadas siguen en inglés.
- Una explicación clara no demuestra que el diagnóstico sea correcto.
- Para HTML o vídeo se necesitan herramientas del entorno; aquí solo se incluyen
  las instrucciones de generación y comprobación.
- No se ha demostrado superioridad frente a otras habilidades. Consulta el
  [estado de validación](./docs/validation.md) y evita estilos permanentes incompatibles.

## Por qué no usar STE estricto por defecto

ASD-STE100 regula documentación técnica en inglés mediante reglas de escritura,
un diccionario controlado y terminología del sector. Reduce ambigüedades, pero
no prueba la veracidad de los hechos ni de un diagnóstico. Tampoco es una gramática
para otros idiomas. Karpathy menciona que a veces relaja el estándar hasta un
«80%» por su rigidez. Es una preferencia de estilo, no una puntuación de conformidad.

El modo predeterminado conserva los principios de claridad, las condiciones,
las excepciones y la incertidumbre. Puedes pedir inglés de estilo STE más estricto
para procedimientos, pero la memoria del modelo no demuestra cumplimiento completo.
El uso formal exige revisar el estándar aplicable, el diccionario y el glosario
del proyecto. No se incluye el estándar, el diccionario ni un modo de certificación.

## Desarrollo y evaluación

Solo para desarrollo: Node.js 22 o posterior y npm.

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run eval:validate
```

Las utilidades preparan entradas comparables, ocultan los nombres de las condiciones
a los revisores y agregan puntuaciones. No llaman a modelos, envían datos ni gastan
créditos de API. Consulta el [protocolo de evaluación](./evals/README.md).

## Código abierto

Licencia [MIT](./LICENSE). Las atribuciones y los avisos originales están en
[THIRD_PARTY_NOTICES](./THIRD_PARTY_NOTICES.md). No se incluye la especificación
ni el diccionario controlado de ASD.
Lee la [guía de contribución](./CONTRIBUTING.md), la [política de seguridad](./SECURITY.md)
y la [lista previa a la publicación](./docs/publishing.md).