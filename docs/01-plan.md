# Plan del juego

## Equipo y tecnología
- Francisco (desarrollador web, en solitario) + Claude (programación, diseño y explicaciones).
- Phaser 3 con JavaScript plano, sin herramientas de build. VS Code + Live Server.
- Formato vertical 720×1280, controles táctiles, jugable en el navegador de itch.io.

## La idea: ¿Truco o trato?
Es la noche de Halloween y tú repartes caramelos. Llaman a la puerta, abres y aparece un visitante. Algunos son niños disfrazados; otros son **monstruos de verdad** que quieren colarse en tu casa.

**Control con un dedo**
- Deslizar a la **derecha** → das caramelo, el visitante pasa.
- Deslizar a la **izquierda** → portazo.
- **Tocar la bombilla del porche** → ves la sombra real del visitante, pero gastas tiempo.

**Pistas de que es un monstruo** (de más obvias a más sutiles)
1. Cola asomando bajo el disfraz.
2. Ojos que brillan.
3. Pies que no tocan el suelo.
4. Garras en vez de manos.
5. La sombra no coincide con el disfraz (solo se ve con la bombilla).
6. No se refleja en el cristal de la puerta.
7. Respiración que empaña / dientes afilados al sonreír.

**Errores**
- Dejar pasar a un monstruo: sale una animación ridícula del monstruo colándose en casa.
- Echar a un niño de verdad: el niño llora o sus padres protestan.

## Sistema de puntuación
- **Contrarreloj de 30 visitantes.** La partida termina al despachar 30. Cuenta el tiempo final: cuanto más rápido, mejor.
- **Penalización:** cada fallo suma +3 s, con portazo, temblor y sonido. Así deslizar a lo loco no compensa.
- **Rangos finales** según el tiempo (los segundos exactos se ajustan jugando el viernes):

| Rango | Título |
|---|---|
| S | Rey de Halloween |
| A | Cazador de monstruos |
| B | Vecino valiente |
| C | Repartidor despistado |
| D | Casa encantada |

- Cada rango tiene ilustración y una frase con voz de IA.
- Al terminar se muestra cuánto falta para el siguiente rango: "¡A 2,4 s del rango A!".
- **Récord personal** guardado en el navegador.
- **Ranking online:** solo como extra el sábado si vamos sobrados. itch.io no lo trae y depender de un servicio externo es arriesgado.

## Cómo adaptar la idea al tema
El tema se anuncia el jueves a las 16:00. Esta vez **el tema cuenta un tercio de la nota**, así que tiene que notarse desde la primera pantalla: en el título, en la mecánica y en el final.

Proceso (máximo 30 minutos):
1. Escribir 5 interpretaciones del tema, incluida una literal y una sorprendente.
2. Para cada una, preguntarse: ¿cambia la mecánica o solo la decoración? Preferimos las que cambian la mecánica.
3. Elegir la que mantenga el swipe de la puerta y se entienda en 5 segundos.

Ejemplos de giros:
- **"Escondido / Disfraces / Apariencias"**: encaja tal cual.
- **"Transformación"**: a medianoche los niños empiezan a transformarse; un niño puede volverse monstruo mientras lo miras.
- **"Bucle / Repetición"**: la misma noche se repite y los monstruos recuerdan cómo los echaste.
- **"Solo uno / Último"**: solo te queda un caramelo; hay que decidir quién lo merece.
- **"Fuera de control / Caos"**: los visitantes llegan en grupos y la puerta se atasca.
- **"Pequeño / Grande"**: los visitantes cambian de tamaño; las pistas están en la escala.
- **"Luz / Oscuridad"**: la bombilla pasa a ser la mecánica central y se va fundiendo.
- **"Conexión / Juntos"**: ciertos visitantes vienen en pareja y hay que acertar con los dos.

Si el tema no encaja de ninguna forma con la puerta, tenemos de reserva **El caldero de la bruja** (fusión con físicas) y **Exorcismo con el dedo** (dibujar símbolos).

## Alcance: qué es imprescindible y qué es extra
**Imprescindible (versión jugable el jueves por la noche)**
- Puerta, visitante, swipe izquierda/derecha, 2–3 pistas, contador de 30, tiempo y rango final.

**Importante (viernes)**
- 8–10 visitantes con su versión niño y su versión monstruo.
- Bombilla del porche, animaciones de entrada y salida, juice, dificultad creciente.

**Pulido (sábado)**
- Música, voces, pantalla de rangos ilustrada, récord, página de itch.

**Solo si sobra tiempo**
- Ranking online, varias noches, visitantes especiales.
