// Carga de recursos. Por ahora genera texturas provisionales por código.
// Durante la jam aquí cargaremos las imágenes y sonidos reales:
//   this.load.image('puerta', 'assets/puerta.png');
//   this.load.audio('portazo', 'assets/portazo.mp3');
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    // Barra de carga sencilla
    const { WIDTH: W, HEIGHT: H } = CONFIG;
    const bar = this.add.rectangle(W / 2 - 200, H / 2, 0, 16, CONFIG.COLORS.accentHex).setOrigin(0, 0.5);
    this.add.rectangle(W / 2, H / 2, 404, 20).setStrokeStyle(2, 0xffffff, 0.4);
    this.load.on('progress', (v) => { bar.width = 400 * v; });
  }

  create() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Partícula redonda
    g.fillStyle(0xffffff).fillCircle(8, 8, 8);
    g.generateTexture('dot', 16, 16);
    g.clear();

    // Tarjeta provisional (el "visitante" de prueba)
    g.fillStyle(0xffffff).fillRoundedRect(0, 0, 300, 420, 32);
    g.generateTexture('card', 300, 420);
    g.destroy();

    this.scene.start('Menu');
  }
}
