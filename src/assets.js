// Recursos del juego.
//
// CARGA AUTOMÁTICA (no hace falta tocar este archivo): basta con copiar el archivo con su nombre exacto.
//   assets/img/<visitante>-kid.png y <visitante>-monster.png   (ghost, vampire, witch… ver src/data/visitors.js)
//   assets/img/bg-street.png   calle vista por la puerta (720×1280)
//   assets/img/fg-wall.png     pared del recibidor con el hueco de la puerta transparente (720×1280)
//   assets/img/door.png        la hoja de la puerta (vertical)
//   assets/sfx/<clave>.wav     tap, bell, slam, candy, growl, cry, laugh, count, go, rush, bad, whoosh
//   assets/music/music.mp3     música en bucle de la partida
// Si un archivo no existe, el juego usa la versión provisional y avisa en la consola (F12).
//
// Aquí abajo puedes añadir recursos EXTRA con cualquier nombre.
const ASSETS = {
  // clave: 'ruta'
  images: {
    // fondo: 'assets/img/fondo.png',
  },

  // clave: { path, frameWidth, frameHeight }  → para animaciones en una sola imagen
  spritesheets: {
    // personaje: { path: 'assets/img/personaje-sheet.png', frameWidth: 256, frameHeight: 256 },
  },

  // clave: ['ruta.ogg', 'ruta.mp3']  → el navegador elige el formato que entienda
  audio: {
    // bad: ['assets/sfx/portazo.wav'],
    // musica: ['assets/music/juego.mp3'],
  },

  // Claves que se buscan automáticamente (ver arriba)
  autoImages: ['bg-street', 'fg-wall', 'door'],
  autoSfx: ['tap', 'bell', 'slam', 'candy', 'growl', 'cry', 'laugh', 'count', 'go', 'rush', 'bad', 'whoosh'],

  // Fuentes de Google Fonts: se cargan en index.html; aquí solo se espera a que estén listas.
  fonts: [
    // 'Creepster',
  ],
};
