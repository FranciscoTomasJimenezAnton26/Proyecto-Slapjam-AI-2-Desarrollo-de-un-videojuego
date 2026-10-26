# Guía de estilo y prompts

El atractivo visual vale un tercio de la nota. La clave no es que cada imagen sea espectacular, sino que **todas parezcan del mismo juego**.

## Dirección de arte
- **Estilo:** ilustración cartoon 2D, líneas gruesas, formas redondeadas, expresiones exageradas. Gracioso más que terrorífico (Halloween de dibujos animados, apto para todos).
- **Encuadre:** siempre el mismo. El visitante de cuerpo entero, de frente, centrado, mirando a cámara, en el umbral de una puerta. Así todos los personajes encajan en la misma escena.
- **Luz:** noche, luz cálida del porche desde arriba, contraluz frío morado de la calle.
- **Fondo:** los personajes se generan sobre fondo liso para recortarlos.

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
2D cartoon illustration for a mobile game, thick clean outlines, rounded shapes,
bold flat colors with soft cel shading, exaggerated cute expressions,
full body, front view, centered, looking at the camera,
warm porch light from above, plain solid dark purple background (#3b2463),
no text, no frame
```

### Visitante: versión niño
```
[BLOQUE DE ESTILO]
A child about 8 years old wearing a homemade [DISFRAZ] costume for Halloween,
holding an empty candy bag, standing on a doorstep, happy and excited.
```

### Visitante: versión monstruo
Mejor **editando la imagen del niño** que generando otra desde cero:
```
Same image, same character, same pose, same costume, same colors.
Only change: [PISTA].
```
Pistas para sustituir en [PISTA]:
- `a hairy wolf tail is sticking out from under the costume`
- `the eyes glow bright yellow`
- `the feet float a few centimeters above the ground`
- `the hands are green claws`
- `when smiling, the teeth are sharp fangs`

### Disfraces para los visitantes
fantasma de sábana, vampiro, bruja, momia, calabaza, esqueleto, superhéroe casero, pirata, zombi, gato negro.

### Escena de la puerta (fondo)
```
[BLOQUE DE ESTILO, cambiando "full body... looking at the camera" por "view from inside a house"]
View from inside a cozy house looking out through an open front door at night,
Halloween decorations, jack-o'-lanterns on the porch, purple misty street behind,
empty doorway in the center, vertical 9:16 composition.
```

### Consejos
- Empezar por **una imagen ancla** (el primer niño) y no seguir hasta que el estilo guste.
- Personajes simples, con 1–2 rasgos distintivos.
- Comparar cada imagen nueva con la ancla; si no encaja, regenerar.
- Todas las imágenes al mismo tamaño de exportación.

## Prompts de sonido
- `heavy wooden front door slammed shut, short echo, cartoon`
- `doorbell ding dong, old house, slightly spooky`
- `candy pieces dropping into a plastic bag`
- `cartoon whoosh, quick swipe`
- `monster growl, funny, short`
- `child's disappointed "awww", cartoon`
- `success chime, magical, short`

## Prompts de música
- Juego: `playful spooky Halloween loop, pizzicato strings, theremin, light percussion, upbeat, 120 bpm, seamless loop, instrumental`
- Fin de partida: `short Halloween victory jingle, cartoon, 5 seconds, instrumental`

## Voces
- Visitantes: "¡Truco o trato!" con 4–5 voces distintas (niño, niña, voz grave de monstruo que intenta sonar a niño).
- Rangos: una frase por rango, por ejemplo S → "¡Eres el rey de Halloween!".
- Decidir el jueves si las voces van en español, en inglés o sin texto (los jueces son internacionales: el inglés llega a más gente).
