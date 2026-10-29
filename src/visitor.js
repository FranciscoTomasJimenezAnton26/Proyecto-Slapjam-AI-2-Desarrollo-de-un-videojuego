// Un visitante en la puerta. Si existe la imagen assets/img/<id>-kid.png (o -monster.png) la usa;
// si no, dibuja un personaje provisional con formas para poder jugar desde el primer minuto.
// El punto (x, y) del visitante son SUS PIES.
const VISITOR_HEIGHT = 560;

class Visitor extends Phaser.GameObjects.Container {
  constructor(scene, x, y, def, isMonster, clueSize = 1) {
    super(scene, x, y);
    this.def = def;
    this.isMonster = isMonster;
    this.clueSize = clueSize;

    const key = `${def.id}-${isMonster ? 'monster' : 'kid'}`;
    this.usesArt = scene.textures.exists(key);
    if (this.usesArt) {
      this.art = scene.add.image(0, 0, key).setOrigin(0.5, 1);
      this.art.setScale(VISITOR_HEIGHT / this.art.height);
      this.add(this.art);
    } else {
      this.drawPlaceholder();
    }
    this.silhouette = this.buildSilhouette(key);
    this.silhouette.setAlpha(0);
    this.add(this.silhouette);

    scene.add.existing(this);
  }

  // ---------- Personaje provisional ----------
  drawPlaceholder() {
    const g = this.scene.add.graphics();
    const c = this.def.color, s = this.clueSize, clue = this.isMonster ? this.def.clue : null;
    const lift = clue === 'float' ? 40 * s + 10 : 0;
    const skin = 0xf2c7a5, outline = 0x120c1c;

    // Sombra en el suelo (si flota, queda separada de los pies: esa es la pista)
    g.fillStyle(0x000000, 0.35).fillEllipse(0, 0, 200, 34);
    g.translateCanvas(0, -lift);

    // Piernas y zapatos
    g.fillStyle(outline).fillRoundedRect(-62, -70, 44, 70, 12);
    if (clue === 'tentacle') {
      g.fillStyle(0x9b3fd0).fillRoundedRect(18, -95, 44, 95, 22);
      g.fillStyle(0xd59cff);
      for (let i = 0; i < 4; i++) g.fillCircle(30, -80 + i * 20, 6);
    } else {
      g.fillStyle(outline).fillRoundedRect(18, -70, 44, 70, 12);
    }
    g.fillStyle(0xff8a1f).fillRoundedRect(-70, -18, 58, 18, 8).fillRoundedRect(12, -18, 58, 18, 8);

    // Cola (detrás del cuerpo)
    if (clue === 'tail') {
      g.fillStyle(0x6b5a4a);
      g.fillTriangle(-80, -120, -80 - 120 * s, -40, -60, -60);
      g.fillCircle(-80 - 110 * s, -46, 22 * s + 6);
    }

    // Cuerpo con el disfraz
    g.fillStyle(outline).fillRoundedRect(-118, -432, 236, 372, 70);
    g.fillStyle(c).fillRoundedRect(-110, -424, 220, 356, 64);

    // Manos (o garras / pelo)
    const hands = [[-118, -230], [118, -230]];
    hands.forEach(([hx, hy]) => {
      if (clue === 'fur') { g.fillStyle(0x7a4a22).fillCircle(hx, hy, 34 * s + 12); }
      else { g.fillStyle(skin).fillCircle(hx, hy, 26); }
      if (clue === 'claws') {
        g.fillStyle(0x3a3a46);
        for (let k = -1; k <= 1; k++) g.fillTriangle(hx + k * 14 - 6, hy + 18, hx + k * 14 + 6, hy + 18, hx + k * 16, hy + 18 + 40 * s);
      }
    });

    // Bolsa de caramelos
    g.fillStyle(0xff8a1f).fillRoundedRect(-50, -200, 100, 90, 14);
    g.fillStyle(outline).fillRect(-30, -218, 60, 8);

    // Cabeza
    g.fillStyle(outline).fillCircle(0, -480, 86);
    g.fillStyle(skin).fillCircle(0, -480, 78);
    if (clue === 'horns') {
      g.fillStyle(0xd02a2a);
      g.fillTriangle(-50, -540, -26, -548, -48 - 6 * s, -548 - 50 * s);
      g.fillTriangle(50, -540, 26, -548, 48 + 6 * s, -548 - 50 * s);
    }

    // Ojos
    if (clue === 'eyes') {
      g.fillStyle(0xfff04a, 0.35).fillCircle(-28, -492, 20 * s + 6).fillCircle(28, -492, 20 * s + 6);
      g.fillStyle(0xfff04a).fillCircle(-28, -492, 11).fillCircle(28, -492, 11);
    } else {
      g.fillStyle(outline).fillCircle(-28, -492, 10).fillCircle(28, -492, 10);
    }

    // Boca sonriente (y colmillos)
    g.lineStyle(7, outline).beginPath().arc(0, -462, 30, 0.15 * Math.PI, 0.85 * Math.PI).strokePath();
    if (clue === 'fangs') {
      g.fillStyle(0xffffff);
      g.fillTriangle(-20, -440, -8, -440, -14, -440 + 26 * s);
      g.fillTriangle(8, -440, 20, -440, 14, -440 + 26 * s);
    }

    this.add(g);

    // Nombre del disfraz (solo en la versión provisional)
    const label = this.scene.add.text(0, -320 - lift, this.def.name.toUpperCase(), {
      fontFamily: CONFIG.FONT, fontSize: '28px', fontStyle: 'bold',
      color: this.def.color < 0x555555 ? '#f5ecff' : '#120c1c',
    }).setOrigin(0.5);
    this.add(label);
  }

  // ---------- Sombra verdadera (lo que revela la bombilla) ----------
  buildSilhouette(key) {
    const box = this.scene.add.container(0, 0);
    if (this.usesArt) {
      const sh = this.scene.add.image(0, 0, key).setOrigin(0.5, 1).setScale(this.art.scale).setTintFill(0x05030a);
      box.add(sh);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(0x05030a);
      g.fillRoundedRect(-118, -432, 236, 432, 70);
      g.fillCircle(0, -480, 86);
      box.add(g);
    }
    if (this.isMonster) {
      // El monstruo de verdad: cuernos enormes, garras y ojos rojos
      const m = this.scene.add.graphics();
      m.fillStyle(0x05030a);
      m.fillTriangle(-70, -520, -20, -550, -120, -700);
      m.fillTriangle(70, -520, 20, -550, 120, -700);
      for (let i = 0; i < 5; i++) {
        m.fillTriangle(-118, -300 + i * 50, -118, -270 + i * 50, -170, -290 + i * 50);
        m.fillTriangle(118, -300 + i * 50, 118, -270 + i * 50, 170, -290 + i * 50);
      }
      m.fillStyle(0xff2030).fillCircle(-28, -492, 12).fillCircle(28, -492, 12);
      box.add(m);
    }
    return box;
  }

  // La bombilla del porche: muestra la sombra verdadera un momento
  reveal(duration = 650) {
    this.scene.tweens.killTweensOf(this.silhouette);
    this.silhouette.setAlpha(0.92);
    this.scene.tweens.add({ targets: this.silhouette, alpha: 0, delay: duration * 0.6, duration: duration * 0.4 });
  }
}
