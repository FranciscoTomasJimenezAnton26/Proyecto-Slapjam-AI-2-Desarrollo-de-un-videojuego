# Herramientas de producción

Se abren con **Live Server** igual que el juego (clic derecho → Open with Live Server). Funcionan sin internet y no suben nada a ningún sitio: todo se procesa en tu navegador.

## sprites.html — imágenes de IA listas para el juego
1. Genera las imágenes con el **fondo verde croma** (o magenta si el personaje lleva verde) de la guía de estilo (`docs/04-guia-de-estilo-y-prompts.md`).
2. Arrastra a la herramienta **una pareja (o grupo) cada vez**: el niño y su versión monstruo juntos, con **Mismo recorte para todas** marcado. Así las dos salen del mismo tamaño y en la misma posición, y la pista no "mueve" al personaje.
3. Revisa el resultado sobre el fondo de cuadros:
   - ¿Queda un halo verde? Sube la **tolerancia**.
   - ¿Se borran partes del personaje? Bájala.
4. **Descargar todas**, mueve los PNG a `assets/img/` y pulsa **Vaciar** antes de la siguiente pareja.

Ajustes útiles:
- **Altura final 600** para personajes: todos salen al mismo tamaño y encajan igual en la puerta.
- Para fondos de escenario, desmarca **Quitar fondo** y pon la altura a 1280.
- Si sale el aviso "Ampliada", la imagen original era pequeña: genera una más grande.

## generador-sfx.html — crear efectos y voces desde cero
1. Elige un tipo (portazo, timbre, caramelos, voz de balbuceo…).
2. Pulsa **🎲 Variar** (o la tecla V) hasta que te guste. Ajusta **tono**, **duración** y **eco**.
3. Ponle nombre y pulsa **Guardar en la lista** (o la tecla G).
4. **Descargar todos** y mueve los WAV a `assets/sfx/`.

Los sonidos ya salen recortados y con el volumen igualado: no hace falta pasarlos por `sonidos.html`.

## sonidos.html — procesar sonidos o música de otras herramientas
1. Arrastra los sonidos generados.
2. Escucha **Original** y **Procesado** para comparar.
3. **Descargar todos** y mueve los WAV a `assets/sfx/`.

Ajustes útiles:
- Efectos: mono, volumen máximo −1 dB, fundido 30 ms.
- Música: desmarca mono, volumen −6 dB, desmarca "Recortar silencio final" si el bucle debe durar exacto. Para música larga, mejor usar el MP3 original y no el WAV (pesa mucho menos).

## empaquetar — zip para itch.io
- **Windows:** doble clic en `empaquetar.bat`.
- **Mac/Linux:** `bash tools/empaquetar.sh`.

Crea `build/juego-itch.zip` con `index.html` en la raíz, sin `docs/` ni `tools/`. Súbelo en itch.io como proyecto HTML.

## Después de procesar: añadir al juego
Abre `src/assets.js` y añade una línea por archivo:
```js
images: {
  puerta: 'assets/img/puerta.png',
},
audio: {
  bad: ['assets/sfx/portazo.wav'],   // sustituye al sonido provisional 'bad'
},
```
Si te equivocas en una ruta, el juego no se rompe: avisa en la consola (F12).
