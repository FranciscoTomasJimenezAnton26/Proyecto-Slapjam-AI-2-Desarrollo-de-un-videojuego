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
    this.makeSilhouettes();

    // Esperar a las fuentes web para que los textos no aparezcan con la fuente por defecto
    if (ASSETS.fonts.length && document.fonts) {
      try {
        await Promise.race([
          Promise.all(ASSETS.fonts.flatMap((f) => [document.fonts.load(`48px "${f}"`), document.fonts.load(`600 48px "${f}"`)])),
          new Promise((r) => setTimeout(r, 3000)),
        ]);
      } catch (e) { /* se usa la fuente de respaldo */ }
    }

    this.scene.launch('Debug');
    this.scene.start('Menu');
  }

  // Sombra negra de cada visitante (lo que revela la bombilla). Se genera aquí para no depender de "tint",
  // que no funciona en el modo Canvas.
  makeSilhouettes() {
    for (const v of VISITORS) {
      for (const t of ['kid', 'monster']) {
        const key = `${v.id}-${t}`;
        if (!this.textures.exists(key)) continue;
        const src = this.textures.get(key).getSourceImage();
        const ct = this.textures.createCanvas(`${key}-sil`, src.width, src.height);
        const ctx = ct.getContext();
        ctx.drawImage(src, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = '#05030a';
        ctx.fillRect(0, 0, src.width, src.height);
        ct.refresh();
      }
    }
  }

  makePlaceholderTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Partícula redonda
    g.fillStyle(0xffffff).fillCircle(8, 8, 8);
    g.generateTexture('dot', 16, 16);
    g.clear();

    // Murciélago (silueta)
    g.fillStyle(0x140a20);
    g.fillEllipse(40, 22, 22, 18);                                   // cuerpo
    g.fillTriangle(34, 14, 38, 4, 40, 14).fillTriangle(46, 14, 42, 4, 40, 14); // orejas
    g.fillTriangle(30, 18, 0, 8, 10, 30).fillTriangle(10, 30, 18, 22, 30, 26); // ala izquierda
    g.fillTriangle(50, 18, 80, 8, 70, 30).fillTriangle(70, 30, 62, 22, 50, 26); // ala derecha
    g.fillStyle(0xffd27a).fillCircle(36, 20, 2).fillCircle(44, 20, 2);
    g.generateTexture('bat', 80, 40);
    g.clear();

    // Caramelos envueltos (iconos del Sugar Rush), con el color ya pintado: en modo Canvas no se puede teñir
    const candy = (key, color) => {
      g.fillStyle(color);
      g.fillTriangle(4, 6, 4, 34, 18, 20).fillTriangle(56, 6, 56, 34, 42, 20);
      g.fillCircle(30, 20, 15);
      g.lineStyle(4, 0x2a0f3d).strokeCircle(30, 20, 15);
      g.lineStyle(3, 0x2a0f3d).strokeTriangle(4, 6, 4, 34, 17, 20).strokeTriangle(56, 6, 56, 34, 43, 20);
      g.fillStyle(0xffffff, 0.55).fillCircle(25, 14, 4);
      g.generateTexture(key, 60, 40);
      g.clear();
    };
    candy('candy-off', 0x4a3d63);
    [0xff8a1f, 0xff5fa2, 0xffe14a, 0x6cff8a, 0x7ad7ff].forEach((c, i) => candy(`candy-${i}`, c));

    // Confeti rectangular
    g.fillStyle(0xffffff).fillRect(0, 0, 14, 8);
    g.generateTexture('confetti', 14, 8);
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
