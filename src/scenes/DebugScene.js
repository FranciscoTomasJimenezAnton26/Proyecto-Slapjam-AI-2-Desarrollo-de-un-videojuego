// Panel de depuración: FPS, pantalla activa y objetos en escena.
// Se muestra con la tecla D, o abriendo el juego con ?debug en la dirección (index.html?debug).
// Siempre está por encima del resto de escenas y no recibe toques.
class DebugScene extends Phaser.Scene {
  constructor() { super({ key: 'Debug', active: false }); }

  create() {
    this.visibleNow = new URLSearchParams(location.search).has('debug');
    this.text = this.add.text(12, CONFIG.HEIGHT - 12, '', {
      fontFamily: 'monospace', fontSize: '22px', color: '#6cff8a',
      backgroundColor: '#000000aa', padding: { x: 8, y: 6 },
    }).setOrigin(0, 1).setDepth(10000).setVisible(this.visibleNow);

    this.input.enabled = false; // que no robe toques al juego
    this.input.keyboard?.on('keydown-D', () => {
      this.visibleNow = !this.visibleNow;
      this.text.setVisible(this.visibleNow);
    });
    this.scene.bringToTop();
  }

  update() {
    if (!this.visibleNow) return;
    const active = this.game.scene.getScenes(true).filter((s) => s !== this);
    const objs = active.reduce((n, s) => n + s.children.length, 0);
    this.text.setText([
      `FPS ${Math.round(this.game.loop.actualFps)}`,
      `Escena: ${active.map((s) => s.scene.key).join(', ')}`,
      `Objetos: ${objs}`,
    ]);
    this.scene.bringToTop();
  }
}
