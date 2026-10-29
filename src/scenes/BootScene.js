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

    // Carga automática por nombre de archivo
    for (const v of VISITORS) {
      this.load.image(`${v.id}-kid`, `assets/img/${v.id}-kid.png`);
      this.load.image(`${v.id}-monster`, `assets/img/${v.id}-monster.png`);
    }
    for (const key of ASSETS.autoImages) this.load.image(key, `assets/img/${key}.png`);
    for (const key of ASSETS.autoSfx) this.load.audio(key, [`assets/sfx/${key}.wav`]);
    this.load.audio('music', ['assets/music/music.mp3']);

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

    // Puerta provisional de madera (solo si no hay assets/img/door.png)
    if (!this.textures.exists('door')) {
      g.fillStyle(0x6b3f22).fillRect(0, 0, 420, 720);
      g.fillStyle(0x8a5530);
      for (let i = 0; i < 4; i++) g.fillRect(14 + i * 101, 14, 90, 692);
      g.fillStyle(0x5a321a).fillRect(40, 90, 340, 220).fillRect(40, 400, 340, 230);
      g.fillStyle(0x8a5530).fillRect(56, 106, 308, 188).fillRect(56, 416, 308, 198);
      g.fillStyle(0xffd27a).fillCircle(372, 380, 16);
      g.lineStyle(10, 0x2b1a0e).strokeRect(0, 0, 420, 720);
      g.generateTexture('door', 420, 720);
    }
    g.destroy();
  }
}
