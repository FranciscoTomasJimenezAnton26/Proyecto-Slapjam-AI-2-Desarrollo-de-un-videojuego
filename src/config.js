// Ajustes globales del juego. Todo lo "tocable" vive aquí para cambiarlo rápido durante la jam.
const CONFIG = {
  WIDTH: 720,            // resolución vertical recomendada por la jam
  HEIGHT: 1280,
  ROUND_SECONDS: 30,     // duración de la partida de prueba
  SWIPE_MIN_DISTANCE: 60, // píxeles mínimos para contar como deslizamiento
  SWIPE_MAX_TIME: 600,    // ms máximos que puede durar un deslizamiento
  STORAGE_KEY: 'slapjam2-best',

  COLORS: {
    bg: 0x0d0a14,
    text: '#f5ecff',
    accent: '#ff8a1f',     // naranja calabaza
    accentHex: 0xff8a1f,
    good: 0x6cff8a,
    bad: 0xff4d6d,
    muted: '#9a8fb0',
  },

  FONT: '"Trebuchet MS", "Segoe UI", sans-serif',
};
