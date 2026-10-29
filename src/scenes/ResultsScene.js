// Resultados: tiempo final, rango (S–D), cuánto falta para el siguiente y récord personal.
class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }

  init(data) {
    this.result = {
      time: data.time || 0,
      mistakes: data.mistakes || 0,
      bestCombo: data.bestCombo || 0,
      splits: data.splits || [],
    };
  }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;
    const r = this.result;
    Fx.fadeIn(this);
    Sfx.musicRate(1);

    const prevPb = Records.load();
    const isPb = Records.submit(r.time, r.splits);
    const rank = Records.rankFor(r.time);
    const next = Records.nextRank(r.time);

    this.add.text(W / 2, 90, 'DOORBELL DASH', {
      fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: COLORS.muted,
    }).setOrigin(0.5);

    // Tiempo
    this.add.text(W / 2, 200, formatTime(r.time), {
      fontFamily: FONT, fontSize: '120px', fontStyle: 'bold', color: COLORS.text, stroke: '#000', strokeThickness: 12,
    }).setOrigin(0.5);

    if (isPb) {
      const pbText = this.add.text(W / 2, 300, prevPb ? `NEW BEST!  −${((prevPb.time - r.time) / 1000).toFixed(2)}s` : 'NEW BEST!', {
        fontFamily: FONT, fontSize: '44px', fontStyle: 'bold', color: COLORS.accent, stroke: '#000', strokeThickness: 8,
      }).setOrigin(0.5);
      this.tweens.add({ targets: pbText, scale: 1.12, duration: 380, yoyo: true, repeat: -1 });
    } else if (prevPb) {
      this.add.text(W / 2, 300, `Best: ${formatTime(prevPb.time)}`, {
        fontFamily: FONT, fontSize: '40px', color: COLORS.muted,
      }).setOrigin(0.5);
    }

    // Rango: aparece con un golpe
    const letter = this.add.text(W / 2, 560, rank.rank, {
      fontFamily: FONT, fontSize: '340px', fontStyle: 'bold', color: rank.color, stroke: '#000', strokeThickness: 20,
    }).setOrigin(0.5).setScale(3).setAlpha(0);
    this.tweens.add({
      targets: letter, scale: 1, alpha: 1, duration: 260, delay: 250, ease: 'Back.Out',
      onStart: () => this.time.delayedCall(200, () => {
        Sfx.play(this, rank.rank === 'S' || rank.rank === 'A' ? 'rush' : 'slam');
        Fx.shake(this, 0.015, 180);
        Fx.burst(this, W / 2, 560, Phaser.Display.Color.HexStringToColor(rank.color).color, 30);
      }),
    });

    this.add.text(W / 2, 770, rank.title.toUpperCase(), {
      fontFamily: FONT, fontSize: '52px', fontStyle: 'bold', color: rank.color, stroke: '#000', strokeThickness: 8,
    }).setOrigin(0.5);

    if (next) {
      this.add.text(W / 2, 845, `${(next.missing / 1000).toFixed(2)}s faster for rank ${next.rank}!`, {
        fontFamily: FONT, fontSize: '36px', color: COLORS.text,
      }).setOrigin(0.5);
    }

    // Estadísticas
    const stats = `Mistakes: ${r.mistakes}  (+${(r.mistakes * CONFIG.GAME.PENALTY_MS / 1000)}s)      Best streak: ${r.bestCombo}`;
    this.add.text(W / 2, 930, stats, {
      fontFamily: FONT, fontSize: '28px', color: COLORS.muted,
    }).setOrigin(0.5);

    const again = this.add.text(W / 2, 1070, 'Tap to dash again', {
      fontFamily: FONT, fontSize: '50px', fontStyle: 'bold', color: COLORS.text,
    }).setOrigin(0.5);
    this.tweens.add({ targets: again, alpha: 0.35, duration: 600, yoyo: true, repeat: -1 });

    this.add.text(W / 2, H - 70, 'Made with AI for Slapjam #2', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.muted,
    }).setOrigin(0.5);

    UI.muteButton(this, W - 44, H - 44);

    // Pausa para que un toque accidental no reinicie al instante
    this.time.delayedCall(800, () => {
      this.input.once('pointerdown', () => { Sfx.play(this, 'tap'); Fx.goTo(this, 'Play'); });
      this.input.keyboard?.once('keydown-SPACE', () => Fx.goTo(this, 'Play'));
    });
  }
}
