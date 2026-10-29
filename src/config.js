// Ajustes globales del juego. Todo lo "tocable" vive aquí para cambiarlo rápido durante la jam.
const CONFIG = {
  WIDTH: 720,            // resolución vertical recomendada por la jam
  HEIGHT: 1280,
  SWIPE_COMMIT_DISTANCE: 140, // al recorrer esto, el swipe se dispara sin esperar a soltar el dedo
  SWIPE_MIN_DISTANCE: 60,     // distancia mínima de un "flick" corto y rápido
  SWIPE_MAX_TIME: 400,        // duración máxima de ese flick (ms)
  STORAGE_KEY: 'doorbell-dash-15', // cambia la clave si cambian las reglas, para no comparar con récords viejos

  COLORS: {
    bg: 0x0d0a14,
    street: 0x3b2463,
    text: '#f5ecff',
    accent: '#ff8a1f',     // naranja calabaza
    accentHex: 0xff8a1f,
    light: 0xffd27a,       // luz del porche
    good: 0x6cff8a,
    goodCss: '#6cff8a',
    bad: 0xff4d6d,
    badCss: '#ff4d6d',
    muted: '#9a8fb0',
  },

  FONT: '"Fredoka", "Trebuchet MS", "Segoe UI", sans-serif',          // textos
  FONT_DISPLAY: '"Luckiest Guy", "Impact", "Arial Black", sans-serif',  // títulos y números

  // ---------- Reglas de Doorbell Dash ----------
  GAME: {
    VISITORS: 15,             // visitantes por partida
    MONSTER_CHANCE: 0.45,     // probabilidad de que el visitante sea un monstruo
    PENALTY_MS: 3000,         // segundos que suma cada error al cronómetro

    // Paciencia: cuánto espera cada visitante antes de actuar solo (ms)
    PATIENCE_START: 3200,     // el primero
    PATIENCE_END: 1500,       // el último
    // Pausa entre un visitante y el siguiente (ms). El Sugar Rush la acorta.
    GAP_MS: 520,
    DOOR_OPEN_MS: 150,

    // Sugar Rush: cada RUSH_STEP aciertos seguidos sube un nivel (máximo RUSH_MAX)
    RUSH_STEP: 3,
    RUSH_MAX: 5,
    RUSH_SPEEDUP: 0.12,       // cada nivel acorta pausas y animaciones un 12 %
    RUSH_PATIENCE: 0.05,      // y la paciencia un 5 %

    // Rangos según el tiempo final (ms). Ajustar jugando.
    RANKS: [
      { rank: 'S', max: 24000, title: 'King of Halloween', color: '#ffd27a' },
      { rank: 'A', max: 30000, title: 'Monster Hunter', color: '#6cff8a' },
      { rank: 'B', max: 37000, title: 'Brave Neighbor', color: '#7ad7ff' },
      { rank: 'C', max: 46000, title: 'Clumsy Candy Giver', color: '#c9a0ff' },
      { rank: 'D', max: Infinity, title: 'Haunted House', color: '#ff4d6d' },
    ],
  },
};
