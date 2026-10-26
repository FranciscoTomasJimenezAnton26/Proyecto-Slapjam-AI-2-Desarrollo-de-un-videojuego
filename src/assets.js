// Lista de recursos del juego. BootScene los carga todos automáticamente.
// Para añadir uno: copia el archivo a assets/ y añade una línea aquí con su clave.
// Si un archivo falta o tiene un error, el juego sigue funcionando y avisa en la consola (F12).
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
  // Usa las claves 'tap', 'good', 'bad' y 'whoosh' para sustituir los sonidos provisionales.
  audio: {
    // bad: ['assets/sfx/portazo.wav'],
    // musica: ['assets/music/juego.mp3'],
  },

  // Fuentes de Google Fonts: se cargan en index.html; aquí solo se espera a que estén listas.
  fonts: [
    // 'Creepster',
  ],
};
