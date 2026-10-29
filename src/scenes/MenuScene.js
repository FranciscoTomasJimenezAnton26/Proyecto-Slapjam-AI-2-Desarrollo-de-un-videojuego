// Pantalla de título: logo animado, la puerta abierta con un visitante, cómo jugar y botón de jugar.
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS } = CONFIG;
    Fx.fadeIn(this);
    this.starting = false;

    // Escenario: puerta abierta con un niño esperando caramelos
    UI.backdrop(this, 0.0, true);
    const kid = Phaser.Utils.Array.GetRandom(VISITORS);
    this.visitor = new Visitor(this, DOOR.x, FEET_Y, kid, false, 1);
    this.children.moveBelow(this.visitor, this.backdropDoor || this.backdropWall);
    this.tweens.add({ targets: this.visitor, y: FEET_Y - 10, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.add.rectangle(W / 2, H / 2, W, H, 0x0d0a14, 0.35);
    // Viñeta: bordes más oscuros para centrar la mirada
    const vig = this.add.graphics();
    vig.fillGradientStyle(0x0d0a14, 0x0d0a14, 0x0d0a14, 0x0d0a14, 0.85, 0.85, 0, 0).fillRect(0, 0, W, 420);
    vig.fillGradientStyle(0x0d0a14, 0x0d0a14, 0x0d0a14, 0x0d0a14, 0, 0, 0.9, 0.9).fillRect(0, H - 560, W, 560);
    UI.bats(this, 4, 50);

    // ----- Logo -----
    const logo = this.add.container(W / 2, 0).setDepth(100);
    const streaks = this.add.graphics();
    [[-300, 250, 150], [-330, 285, 190], [-290, 320, 120]].forEach(([x, y, w]) => {
      streaks.fillStyle(0xffd27a, 0.9).fillRoundedRect(x, y - 7, w, 14, 7);
    });
    const top = UI.display(this, 0, 150, 'DOORBELL', 98, { gradient: 'ghost' }).setAngle(-4);
    const dash = UI.display(this, 20, 272, 'DASH!', 168, { gradient: 'candy' }).setAngle(-4);
    logo.add([streaks, top, dash]);
    logo.y = -420;
    this.tweens.add({ targets: logo, y: 0, duration: 700, ease: 'Bounce.Out', delay: 150 });
    this.tweens.add({ targets: dash, angle: { from: -6, to: -2 }, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.tweens.add({ targets: streaks, x: { from: -18, to: 10 }, alpha: { from: 0.5, to: 1 }, duration: 260, yoyo: true, repeat: -1 });

    UI.pill(this, W / 2, 392, 560, 58, 0x140c24, { alpha: 0.85, borderColor: 0x3b2463 }).setDepth(100);
    UI.label(this, W / 2, 392, 'Spot the monsters. Beat the clock!', 28).setDepth(101);

    // ----- Cómo jugar -----
    UI.panel(this, W / 2, 900, 650, 250).setDepth(100);
    UI.controlChip(this, 165, 820, 'TREAT', 1, 0x2fcf5a);
    UI.label(this, 290, 820, 'Give candy to real kids', 28, { originX: 0 }).setDepth(102);
    UI.controlChip(this, 165, 900, 'SLAM', -1, 0xd61f45);
    UI.label(this, 290, 900, 'Slam the door on monsters', 28, { originX: 0 }).setDepth(102);
    UI.pill(this, 165, 980, 210, 58, 0xff8a1f, { border: 4 }).setDepth(101);
    UI.display(this, 165, 978, '💡 TAP', 32, { strokeRatio: 0.18 }).setDepth(102);
    UI.label(this, 290, 980, 'See their true shadow', 28, { originX: 0 }).setDepth(102);

    // ----- Jugar -----
    UI.button(this, W / 2, 1105, 'PLAY', () => this.begin(), { w: 440, h: 118, pulse: true, size: 64 });

    const pb = Records.load();
    if (pb) {
      const rank = Records.rankFor(pb.time);
      UI.label(this, W / 2, 1205, `BEST  ${formatTime(pb.time)}  ·  RANK ${rank.rank}`, 28, { color: rank.color }).setDepth(101);
    }
    UI.label(this, W / 2, 1250, 'Made with AI for Slapjam #2', 20, { color: COLORS.muted, bold: false }).setDepth(101);

    UI.muteButton(this, W - 50, 1230);

    // Tocar en cualquier sitio también empieza
    this.input.once('pointerdown', () => this.begin());
    this.input.keyboard?.once('keydown-SPACE', () => this.begin());
  }

  begin() {
    if (this.starting) return;
    this.starting = true;
    Sfx.unlock();
    Sfx.play(this, 'bell');
    Sfx.music(this, 'music', 0.45);
    Fx.goTo(this, 'Play');
  }
}
