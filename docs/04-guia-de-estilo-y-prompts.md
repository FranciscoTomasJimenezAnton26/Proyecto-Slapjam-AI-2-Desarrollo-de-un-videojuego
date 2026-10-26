# Guía de estilo y prompts

El atractivo visual vale un tercio de la nota. La clave no es que cada imagen sea espectacular, sino que **todas parezcan del mismo juego**.

## Dirección de arte
- **Estilo:** ilustración cartoon 2D, líneas gruesas, formas redondeadas, expresiones exageradas. Gracioso más que terrorífico (Halloween de dibujos animados, apto para todos).
- **Encuadre:** siempre el mismo. El visitante de cuerpo entero, de frente, centrado, mirando a cámara, en el umbral de una puerta. Así todos los personajes encajan en la misma escena.
- **Luz:** noche, luz cálida desde arriba. La lámpara y el cono de luz los dibuja el juego en la escena, **nunca en la imagen del personaje**.
- **Fondo:** los personajes se generan sobre **verde croma puro** para recortarlos limpiamente con `tools/sprites.html`.

### Por qué verde y no morado (prueba del lunes 26)
Con fondo morado oscuro, la herramienta borraba también contornos y sombras oscuras del personaje (y los murciélagos de la bolsa), y Gemini dibujó la lámpara y el cono de luz, que quedaban pegados al personaje. El verde puro no se parece a ningún color del personaje, así que el recorte sale limpio. El estilo y la coherencia entre la versión niño y la monstruo fueron excelentes.

**Excepción:** si un personaje lleva verde (zombi, bruja verde, garras verdes), usa fondo **magenta puro (#FF00FF)** en su lugar.

## Paleta
| Uso | Color |
|---|---|
| Fondo noche | `#0d0a14` |
| Morado de la calle | `#3b2463` |
| Naranja calabaza (acento) | `#ff8a1f` |
| Luz del porche | `#ffd27a` |
| Acierto | `#6cff8a` |
| Fallo | `#ff4d6d` |
| Texto | `#f5ecff` |

Estos colores ya están en `src/config.js`.

## Tipografía
Una sola fuente gruesa y redondeada para títulos (buscar en Google Fonts algo tipo "Halloween cartoon"), y la misma o una legible para el resto. Decidir el jueves.

## Prompts de imagen

La idea es separar la **identidad fija** (que nunca cambia) de lo **variable**. El bloque de estilo se copia tal cual, sin reescribirlo nunca.

### Bloque de estilo (copiar siempre igual)
```
Create a vertical 9:16 image. 2D cartoon illustration for a mobile game, thick clean dark outlines
around the whole character, rounded shapes, bold flat colors with soft cel shading,
exaggerated cute expressions, full body, front view, centered, looking at the camera,
soft warm light coming from above but do NOT draw any lamp, light bulb or light beam.
Isolated character on a perfectly flat, uniform pure green chroma key background (#00FF00),
no gradient, no ground shadow, no floor, no props in the background, no text, no frame.
The character must not contain any green.
```

### Visitante: versión niño
```
[BLOQUE DE ESTILO]
A child about 8 years old wearing a homemade [DISFRAZ] costume for Halloween,
holding an empty candy bag, happy and excited.
```

### Visitante: versión monstruo
Mejor **editando la imagen del niño** que generando otra desde cero:
```
Same image, same character, same pose, same costume, same colors, same pure green background.
Only change: [PISTA].
```
Pistas para sustituir en [PISTA]:
- `a hairy wolf tail is sticking out from under the costume`
- `the eyes glow bright yellow`
- `the feet float a few centimeters above the ground`
- `the hands are long dark grey monster claws`
- `when smiling, the teeth are sharp fangs`

### Disfraces para los visitantes
fantasma de sábana, vampiro, bruja, momia, calabaza, esqueleto, superhéroe casero, pirata, zombi, gato negro.

### Escena de la puerta (fondo)
```
Create a vertical 9:16 image. 2D cartoon illustration for a mobile game, thick clean outlines,
rounded shapes, bold flat colors with soft cel shading (mismo estilo que los personajes, pero esta vez SÍ con fondo completo).
View from inside a cozy house looking out through an open front door at night,
Halloween decorations, jack-o'-lanterns on the porch, purple misty street behind,
empty doorway in the center, vertical 9:16 composition.
```

### Consejos
- Empezar por **una imagen ancla** (el primer niño) y no seguir hasta que el estilo guste.
- Personajes simples, con 1–2 rasgos distintivos.
- Comparar cada imagen nueva con la ancla; si no encaja, regenerar.
- Todas las imágenes al mismo tamaño de exportación.
- En `tools/sprites.html` deja el color de fondo en **Automático**: detecta el verde (o el magenta) de las esquinas.
- Procesa cada **pareja niño/monstruo junta** con **Mismo recorte para todas**. Si Gemini mueve al personaje entre las dos imágenes, regenera la versión monstruo: la única diferencia debe ser la pista.
- Prueba del lunes 26 con fondo verde: recorte limpio, sin restos visibles, y pareja alineada al píxel. ✅

## Efectos de sonido (con `tools/generador-sfx.html`)
| Sonido del juego | Tipo en el generador | Consejo |
|---|---|---|
| Llaman a la puerta | 🔔 Timbre | Eco 20–30 % |
| Portazo (fallo o echar) | 🚪 Portazo | Tono ×0.8, eco 25 % |
| Dar caramelos | 🍬 Caramelos | Tono ×1.0–1.2 |
| Deslizar | 💨 Whoosh | Duración ×0.8 |
| Monstruo descubierto | 👹 Gruñido | Tono ×0.7–0.9 |
| Acierto | ✨ Acierto | |
| Fallo | 💥 Fallo | |
| Botones | 👆 Clic | |
| Aparece visitante | 🎈 Pop | |
| "¡Truco o trato!" del niño | 🗣️ Voz balbuceo | Tono ×1.3–1.6; guardar 3–4 variaciones |
| "¡Truco o trato!" del monstruo | 🗣️ Voz balbuceo | Tono ×0.6–0.7, eco 30 % |
| Monstruo que se cuela | 😈 Risa malvada | |

Usa los nombres `tap`, `good`, `bad` y `whoosh` al guardarlos para que sustituyan automáticamente a los provisionales del juego.

## Música (Gemini Lyria 3, en gemini.google.com/music)
- Juego: `Instrumental only, no vocals. Playful spooky Halloween cartoon music for a mobile game, pizzicato strings, theremin, light percussion, upbeat and bouncy, 120 bpm, should loop seamlessly.`
- Pantalla de rangos: `Instrumental only, no vocals. Short triumphant Halloween cartoon fanfare, playful and spooky, celesta and brass.`
- Las pistas duran 30 s: en el juego van en bucle. Pasa el archivo por `tools/sonidos.html` con volumen −6 dB, sin mono y sin recortar el silencio final.
