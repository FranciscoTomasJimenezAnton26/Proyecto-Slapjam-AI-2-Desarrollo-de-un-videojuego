# Slapjam #2 — plantilla base

📚 **Toda la planificación está en [`docs/`](docs/README.md).**

Plantilla vacía en **Phaser 3** para un juego de navegador en formato móvil vertical (720×1280) con controles táctiles. No contiene el juego: solo la base técnica, para empezar a construir en cuanto se anuncie el tema (jueves 29 de octubre, 16:00 hora de Madrid).

## Cómo probarlo

1. Abre la carpeta en **VS Code**.
2. Instala la extensión **Live Server** (de Ritwick Dey) si no la tienes.
3. Clic derecho en `index.html` → **Open with Live Server**.
4. En el navegador, abre las herramientas de desarrollador (F12) y activa la vista de móvil para verlo en vertical.

Para probarlo **en tu móvil**: con el móvil en la misma red wifi, abre la dirección IP de tu ordenador con el puerto de Live Server (por ejemplo `http://192.168.1.20:5500`).

En el ordenador puedes usar las flechas **← →** como si deslizaras, y **espacio** como toque.

## Recomendado antes del jueves

Descarga `phaser.min.js` (versión 3.88.2) desde https://cdn.jsdelivr.net/npm/phaser@3.88.2/dist/phaser.min.js y guárdalo en `lib/phaser.min.js`. Así el juego no depende de internet para cargar Phaser. Si no está, se carga automáticamente desde la CDN.

## Estructura

```
index.html              → página que carga todo
tools/                  → herramientas: procesar imágenes y sonidos de IA, crear el zip para itch
docs/                   → plan, reglas, herramientas, guía de estilo, guion de la jam y página de itch
lib/                    → Phaser (opcional, ver arriba)
assets/                 → imágenes y sonidos del juego
src/config.js           → ajustes: tamaño, tiempos, colores, fuente
src/assets.js           → lista de imágenes y sonidos que se cargan al empezar
src/audio.js            → sonidos (archivos reales o provisionales), música, silencio y desbloqueo en móvil
src/fx.js               → "juice": temblor, destello, rebote, textos, partículas, hit stop
src/swipe.js            → detección de deslizamientos y toques
src/ui.js               → botón de sonido y botones con rebote
src/scenes/BootScene.js     → carga de recursos (lee src/assets.js)
src/scenes/DebugScene.js    → panel de depuración (tecla D o index.html?debug)
src/scenes/MenuScene.js     → pantalla de título
src/scenes/PlayScene.js     → juego (ahora: demo de prueba con tarjetas)
src/scenes/GameOverScene.js → fin de partida, récord y reintento
src/main.js             → configuración de Phaser y lista de escenas
```

Cada **escena** es una pantalla del juego. Su método `create()` se ejecuta al entrar y `update()` (si existe) se ejecuta en cada fotograma.

## Publicar en itch.io

1. Crea el zip con `tools/empaquetar.bat` (doble clic en Windows). Se guarda en `build/juego-itch.zip`.
2. En itch.io: **Upload new project** → *Kind of project*: **HTML** → sube el zip y marca **This file will be played in the browser**.
3. En *Embed options*:
   - Viewport: **720 × 1280** (o algo más pequeño con la misma proporción, como 450 × 800, para que quepa en pantallas de ordenador).
   - Marca **Mobile friendly** con orientación **Portrait**.
   - Marca **Fullscreen button**.
4. Envía el juego a la jam desde la página de Slapjam #2 antes de las **16:00 del sábado 31 (hora de Madrid)**.
5. Recuerda listar en la página **todas las herramientas de IA usadas** (es obligatorio).

## Herramientas de IA usadas

- Claude (Anthropic) — código y diseño
- _(añadir el resto durante la jam: arte, música, voces…)_
