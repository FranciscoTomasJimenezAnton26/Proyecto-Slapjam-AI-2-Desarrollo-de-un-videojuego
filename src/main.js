// Punto de entrada: crea el juego en formato vertical 720×1280 que se escala a cualquier pantalla.
// index.html?canvas fuerza el modo Canvas (útil en ordenadores sin aceleración gráfica)
const game = new Phaser.Game({
  type: new URLSearchParams(location.search).has('canvas') ? Phaser.CANVAS : Phaser.AUTO,
  parent: 'game',
  backgroundColor: CONFIG.COLORS.bg,
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,              // mantiene la proporción y ajusta al tamaño de la pantalla
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: { activePointers: 2 },
  render: { antialias: true },
  scene: [BootScene, MenuScene, PlayScene, ResultsScene, DebugScene],
});

// Cada toque reactiva el audio: los iPhone lo suspenden al cambiar de app o bloquear la pantalla.
['pointerdown', 'touchend', 'keydown'].forEach((ev) =>
  document.addEventListener(ev, () => {
    Sfx.unlock();
    const ctx = game.sound && game.sound.context;
    if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  }, { passive: true }));

// Sin menú contextual (clic derecho o pulsación larga) encima del juego
document.addEventListener('contextmenu', (e) => e.preventDefault());
