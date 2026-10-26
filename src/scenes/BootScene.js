// Carga de recursos: lee la lista de src/assets.js y genera texturas provisionales por código.
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;

    // Barra de carga
    this.add.rectangle(W / 2, H / 2, 404, 24).setStrokeStyle(2, 0xffffff, 0.4);
    const bar = this.add.rectangle(W / 2 - 200, H / 2, 0, 18, COLORS.accentHex).setOrigin(0, 0.5);
    const pct = this.add.text(W / 2, H / 2 + 50, '0%', {
      fontFamily: FONT, fontSize: '32px', color: COLORS.muted,
    }).setOrigin(0.5);
    this.load.on('progress', (v) => { bar.width = 400 * v; pct.setText(Math.round(v * 100) + '%'); });

    // Un archivo que falla no detiene el juego
    this.load.on('loaderror', (file) => console.warn(`[assets] No se pudo cargar "${file.key}" (${file.src})`));

    for (const [key, path] of Object.entries(ASSETS.images)) this.load.image(key, path);
    for (const [key, s] of Object.entries(ASSETS.spritesheets)) {
      this.load.spritesheet(key, s.path, { frameWidth: s.frameWidth, frameHeight: s.frameHeight });
    }
    for (const [key, paths] of Object.entries(ASSETS.audio)) this.load.audio(key, paths);
  }

  async create() {
    this.makePlaceholderTextures();

    // Esperar a las fuentes web para que los textos no aparezcan con la fuente por defecto
    if (ASSETS.fonts.length && document.fonts) {
      try {
        await Promise.race([
          Promise.all(ASSETS.fonts.map((f) => document.fonts.load(`48px "${f}"`))),
          new Promise((r) => setTimeout(r, 3000)),
        ]);
      } catch (e) { /* se usa la fuente de respaldo */ }
    }

    this.scene.launch('Debug');
    this.scene.start('Menu');
  }

  makePlaceholderTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Partícula redonda
    g.fillStyle(0xffffff).fillCircle(8, 8, 8);
    g.generateTexture('dot', 16, 16);
    g.clear();

    // Tarjeta provisional
    g.fillStyle(0xffffff).fillRoundedRect(0, 0, 300, 420, 32);
    g.generateTexture('card', 300, 420);
    g.destroy();
  }
}
