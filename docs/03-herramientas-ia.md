# Herramientas de IA

Una herramienta por tarea, decidida de antemano, para no perder tiempo el jueves. **Apunta en la tabla de créditos (al final) cada herramienta que uses de verdad.**

## Licencias: lo importante
Hay premios en dinero, así que trata el juego como uso comercial. Varios planes gratuitos **no permiten uso comercial**:
- **Suno (música):** el plan gratuito no permite usar las canciones en juegos. Hace falta como mínimo el plan Pro (unos 10 $/mes).
- **ElevenLabs (voces y efectos):** el plan gratuito no permite uso comercial y exige atribución. El plan Starter (unos 6 $/mes) sí lo permite.

Estos datos vienen de artículos de terceros, no de las condiciones oficiales. **Antes del jueves, revisa las condiciones de cada herramienta en su web oficial** y marca la casilla correspondiente abajo.

Presupuesto mínimo recomendado: un mes de ElevenLabs Starter (voces + efectos). Para música, Suno Pro o una alternativa con licencia clara.

## Por tarea

### Código
- **Claude**: todo el código del juego, escrito directamente en el repo.

### Imágenes (personajes, puerta, fondos, pantallas de rango)
El reto es la **coherencia**: el mismo estilo en todos los personajes, y la versión "monstruo" de cada niño igual que la "niño" salvo la pista.

Lo que funciona mejor según las comparativas: herramientas que **editan a partir de una imagen ancla** o usan **imagen de referencia**, en lugar de generar cada personaje de cero.

**✅ Decisión: Gemini (plan de pago) como herramienta principal.**
- Con plan de pago usa el modelo **Nano Banana 2.1**, que Google presenta como su mejor modelo de generación y edición, con **coherencia de personajes**, edición de imágenes e imágenes de referencia. Es justo lo que necesita nuestro flujo: una imagen ancla y luego "misma imagen, pero con cola de lobo".
- Si una imagen no convence, en el menú de tres puntos está **"Redo with Pro"** (Nano Banana Pro).
- **Uso comercial:** según un resumen de terceros de los términos de Google, las imágenes de Gemini pueden usarse comercialmente y Google no reclama su propiedad. Confírmalo en los términos oficiales.
- **⚠️ Marca de agua visible:** desde agosto de 2026 se puede desactivar en **Ajustes → Media Watermark**. **Desactívala antes de generar**: la marca está en una esquina, encima del fondo, y `tools/sprites.html` no la quitaría. La marca invisible SynthID se mantiene siempre; no molesta, pero es un motivo más para declarar Gemini en los créditos.

**Canva Pro: herramienta de apoyo, no generador principal**
- **Quitar fondos difíciles** (pelo, humo, bordes finos) si `tools/sprites.html` no da buen resultado.
- **Página de itch.io:** portada de 630×500, capturas con marco y el logotipo del título.
- No lo usamos como generador de los personajes: no he podido confirmar sus condiciones para imágenes de IA en juegos, y mezclar dos generadores rompe la coherencia del estilo.

Otras opciones (por si Gemini falla):
- **Leonardo AI**: tiene Character Reference y un plan gratuito diario.
- **Scenario.gg**: pensado para assets de juego.

### Efectos de sonido
- **ElevenLabs Sound Effects**: el más recomendado para efectos de juego (golpes, clics, puertas).
- **Stable Audio**: mejor para ambientes y texturas.
- Consejos: prompts concretos ("portazo de madera pesada, eco corto"), generar 3–4 variantes y quedarse con la mejor, recortar el silencio inicial, usar .wav o .ogg cortos.

### Música
- **Suno** (plan de pago) o **Eleven Music** de ElevenLabs.
- Necesitamos 2 pistas: bucle de juego (tenso y divertido, 60–90 s) y jingle de fin de partida.

### Voces
- **ElevenLabs** (texto a voz). Frases cortas para visitantes ("¡Truco o trato!" con voces distintas) y la frase de cada rango.

## Checklist antes del jueves
- [x] Cuenta en itch.io creada
- [ ] Plantilla subida a itch.io como borrador y probada en el móvil
- [x] Herramienta de imágenes elegida: **Gemini** (apoyo: Canva Pro)
- [ ] Marca de agua visible de Gemini desactivada (Ajustes → Media Watermark)
- [ ] Condiciones comerciales de Gemini revisadas en los términos oficiales
- [ ] Cuenta de ElevenLabs (plan con uso comercial si se usa)
- [ ] Herramienta de música elegida y licencia revisada: ________
- [ ] Unido al Discord de Slapjam para ver el tema al momento
- [ ] Probado `tools/empaquetar.bat` en Windows (crea `build/juego-itch.zip`)
- [ ] Probado `tools/sprites.html` con una imagen de prueba de la herramienta elegida

## Créditos (rellenar durante la jam)
| Herramienta | Para qué | Plan |
|---|---|---|
| Claude (Anthropic) | Código, diseño y documentación | |
| Gemini (Nano Banana 2.1) | Personajes, fondos e ilustraciones | Pago |
| Canva Pro | Recorte de fondos y página de itch (si se usa) | Pro |
| | | |

## Fuentes
- [Generación de imágenes en Gemini (Google)](https://gemini.google/overview/image-generation/)
- [Términos de Gemini sobre las imágenes generadas (terms.law)](https://terms.law/es/ai-output-rights/gemini/)
- [Marca de agua visible opcional en Gemini (AI Haven)](https://aihaven.com/news/google-gemini-visible-watermark-toggle-optional/)
- [Comparativa de herramientas de personajes coherentes (Neolemon)](https://www.neolemon.com/blog/best-ai-character-generator-for-consistent-characters/)
- [Efectos de sonido con IA para juegos (Summer Engine)](https://www.summerengine.com/blog/ai-sound-effect-generator-for-games)
- [Derechos de la música de Suno (terms.law)](https://terms.law/ai-output-rights/suno/)
- [Plan gratuito de ElevenLabs (Dupple)](https://dupple.com/learn/is-elevenlabs-free)
