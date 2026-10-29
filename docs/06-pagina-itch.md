# Página de itch.io y entrega

Todo el material está en la carpeta [`itch/`](../itch/):

| Archivo | Para qué |
|---|---|
| `cover.png` (630×500) | **Cover image**: lo que se ve en la lista de juegos de la jam |
| `banner.png` | Cabecera de la página (en *Edit theme*) |
| `screenshot-1…5.png` (720×1280) | **Screenshots** |
| `gameplay.gif` (12 s, 3 MB) | Primera captura: es lo que más convence para jugar |
| `gameplay-full.mp4` | Partida completa, por si quieres subirla a YouTube como tráiler |
| `description.html` | Descripción en inglés lista para copiar y pegar |

Para regenerar la portada o el banner: `tools/itch/cover.html` (y `?banner`).

---

## 1 · Subir la versión final del juego
1. `git pull` y doble clic en `tools/empaquetar.bat` → `build/juego-itch.zip`.
2. En itch.io → tu proyecto → **Edit game** → en *Uploads* borra el zip viejo (icono de papelera) y sube el nuevo.
3. Marca **This file will be played in the browser**.

## 2 · Datos del proyecto (Edit game)
| Campo | Qué poner |
|---|---|
| **Title** | `Doorbell Dash` |
| **Project URL** | `doorbell-dash` |
| **Short description or tagline** | `Kid or monster? Swipe fast! A Halloween speedrun at your front door.` |
| **Classification** | Games |
| **Kind of project** | HTML |
| **Release status** | Released |
| **Pricing** | No payments |
| **Embed options** | Embed in page · Manually set size **450 × 800** · Mobile friendly **Portrait** · Fullscreen button ✔ · Automatically start ✘ · Scrollbars ✘ |
| **Description** | Abre `itch/description.html` en el navegador → Ctrl+A → Ctrl+C → pega aquí. Cambia `[YOUR NAME]` por tu nombre y borra la nota morada |
| **Genre** | Action |
| **Tags** (máx. 10) | `halloween`, `speedrun`, `casual`, `arcade`, `mobile`, `swipe`, `cute`, `funny`, `touch-friendly`, `short` |
| **AI generation disclosure** | **Yes** → marca *Graphics*, *Sound* (la música), *Code* y *Text* |
| **Community** | Comments activados (los jueces a veces dejan opiniones) |
| **Cover image** | `itch/cover.png` |
| **Gameplay video** | Opcional: sube `gameplay-full.mp4` a YouTube y pega el enlace |
| **Screenshots** | Sube en este orden: `gameplay.gif`, `screenshot-2-play`, `screenshot-3-bulb`, `screenshot-4-busted`, `screenshot-5-results`, `screenshot-1-menu` |
| **Metadata → Made with** | Phaser |
| **Metadata → Inputs** | Touchscreen, Mouse, Keyboard |
| **Metadata → Average session** | A few minutes |
| **Metadata → Languages** | English |
| **Visibility** | **Public** (al entregar) |

Pulsa **Save**.

## 3 · Tema de la página (Edit theme)
En la página del juego, arriba, pulsa **Edit theme**:

| Opción | Valor |
|---|---|
| **Banner** | sube `itch/banner.png` |
| **Background** (fondo) | `#0D0A14` |
| **Background 2** (columna) | `#140C24` |
| **Text** | `#F5ECFF` |
| **Link** | `#FF8A1F` |
| **Button** | `#FF8A1F` |
| **Font** | la más redondeada que te ofrezca (p. ej. *Nunito* o *Quicksand*) |
| **Screenshots** | en la columna lateral |

Pulsa **Save theme**.

## 4 · Entregar a la jam
1. Ve a la página de la jam → **Submit your project** → elige *Doorbell Dash*.
2. Rellena el **email privado de contacto para premios** (solo lo ven los organizadores).
3. Rellena la **lista de herramientas** del formulario: Claude, Google Gemini, Phaser.
4. Envía. Puedes **sustituir el zip del juego todas las veces que quieras hasta el sábado a las 16:00** (hora de Madrid).

## 5 · Comprobación final (en el móvil y con otra cuenta o en incógnito)
- [ ] La página se ve con el banner, la portada y el GIF
- [ ] **Run game** abre el juego en vertical y se ve entero
- [ ] Suena después del primer toque
- [ ] Una partida completa funciona de principio a fin
- [ ] Email de premios y lista de herramientas rellenos
- [ ] El proyecto está en **Public** y aparece en la lista de entradas de la jam
