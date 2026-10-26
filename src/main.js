// Punto de entrada: crea el juego en formato vertical 720×1280 que se escala a cualquier pantalla.
const game = new Phaser.Game({
  type: Phaser.AUTO,
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
  scene: [BootScene, MenuScene, PlayScene, GameOverScene],
});
