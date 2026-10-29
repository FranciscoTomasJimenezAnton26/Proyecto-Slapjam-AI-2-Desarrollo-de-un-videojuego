// Pantalla de título: cómo jugar en 4 líneas, récord y "toca para empezar".
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;
    Fx.fadeIn(this);
    this.starting = false;
    UI.backdrop(this, 0.45);
    UI.panel(this, W / 2, 725, 660, 470);

    const title = this.add.text(W / 2, 250, 'DOORBELL\nDASH', {
      fontFamily: FONT, fontSize: '108px', fontStyle: 'bold', align: 'center', lineSpacing: -10,
      color: COLORS.accent, stroke: '#000', strokeThickness: 16,
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, angle: { from: -2, to: 2 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.add.text(W / 2, 430, `Serve ${CONFIG.GAME.VISITORS} trick-or-treaters as fast as you can.\nSome of them are REAL monsters.`, {
      fontFamily: FONT, fontSize: '30px', color: COLORS.text, align: 'center', wordWrap: { width: 640 },
    }).setOrigin(0.5);

    const rows = [
      ['TREAT →', 'Swipe right to give candy to kids', COLORS.goodCss],
      ['← SLAM', 'Swipe left to slam the door on monsters', COLORS.badCss],
      ['💡', 'Tap the light to see their true shadow', COLORS.accent],
      ['🍬', 'Streaks start a SUGAR RUSH: everything speeds up', COLORS.accent],
      ['+3s', 'Every mistake adds 3 seconds', COLORS.badCss],
    ];
    rows.forEach(([key, text, color], i) => {
      const y = 560 + i * 82;
      this.add.text(70, y, key, { fontFamily: FONT, fontSize: '36px', fontStyle: 'bold', color, stroke: '#000', strokeThickness: 6 }).setOrigin(0, 0.5);
      this.add.text(250, y, text, { fontFamily: FONT, fontSize: '27px', color: COLORS.text, wordWrap: { width: 430 } }).setOrigin(0, 0.5);
    });

    const pb = Records.load();
    if (pb) {
      const rank = Records.rankFor(pb.time);
      this.add.text(W / 2, 1000, `Your best: ${formatTime(pb.time)}  ·  Rank ${rank.rank}`, {
        fontFamily: FONT, fontSize: '34px', fontStyle: 'bold', color: rank.color,
      }).setOrigin(0.5);
    }

    const start = this.add.text(W / 2, 1100, 'Tap to start', {
      fontFamily: FONT, fontSize: '56px', fontStyle: 'bold', color: COLORS.text, stroke: '#000', strokeThickness: 8,
    }).setOrigin(0.5);
    this.tweens.add({ targets: start, scale: 1.08, duration: 500, yoyo: true, repeat: -1 });

    this.add.text(W / 2, H - 60, 'Made with AI for Slapjam #2', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.muted,
    }).setOrigin(0.5);

    UI.muteButton(this, W - 44, H - 44);

    this.input.once('pointerdown', () => this.begin());
    this.input.keyboard?.once('keydown-SPACE', () => this.begin());
  }

  begin() {
    if (this.starting) return;
    this.starting = true;
    Sfx.unlock();
    Sfx.play(this, 'tap');
    Sfx.music(this, 'music', 0.45);
    Fx.goTo(this, 'Play');
  }
}
