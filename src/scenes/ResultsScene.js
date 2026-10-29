// Resultados: tiempo final, insignia del rango (S–D), cuánto falta para el siguiente, récord y botones.
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
    const { WIDTH: W, HEIGHT: H, COLORS } = CONFIG;
    const r = this.result;
    Fx.fadeIn(this);
    Sfx.musicRate(1);
    UI.backdrop(this, 0.72);
    UI.bats(this, 3, 5);

    const prevPb = Records.load();
    const isPb = Records.submit(r.time, r.splits);
    const rank = Records.rankFor(r.time);
    const next = Records.nextRank(r.time);
    const rankHex = Phaser.Display.Color.HexStringToColor(rank.color).color;

    // ----- Cabecera y tiempo -----
    UI.display(this, W / 2, 78, 'DOORBELL DASH', 46, { gradient: 'candy' }).setAngle(-2);
    UI.pill(this, W / 2, 200, 470, 130, 0x140c24, { alpha: 0.92, borderColor: 0x3b2463, border: 5 });
    UI.label(this, W / 2, 152, 'YOUR TIME', 20, { color: COLORS.muted });
    const timer = UI.timer(this, W / 2, 210, 92, { gradient: 'ghost' });
    timer.setValue(formatTime(r.time));

    if (isPb) {
      const ribbon = this.add.container(W / 2, 300);
      ribbon.add(UI.pill(this, 0, 0, 330, 60, 0xff8a1f, { border: 4 }));
      ribbon.add(UI.display(this, 0, -2, prevPb ? `NEW BEST!  −${((prevPb.time - r.time) / 1000).toFixed(2)}s` : 'NEW BEST!', 34));
      ribbon.setAngle(-3).setScale(0);
      this.tweens.add({ targets: ribbon, scale: 1, duration: 300, delay: 900, ease: 'Back.Out' });
      this.tweens.add({ targets: ribbon, angle: 3, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: 1200 });
    } else if (prevPb) {
      UI.label(this, W / 2, 300, `Best: ${formatTime(prevPb.time)}`, 28, { color: COLORS.muted });
    }

    // ----- Insignia del rango -----
    const cy = 575;
    const rays = this.add.graphics({ x: W / 2, y: cy }).setAlpha(0);
    rays.fillStyle(rankHex, 1);
    for (let i = 0; i < 16; i++) {
      const a0 = (i / 16) * Math.PI * 2, a1 = a0 + Math.PI / 22, RR = 290;
      rays.fillTriangle(0, 0, Math.cos(a0) * RR, Math.sin(a0) * RR, Math.cos(a1) * RR, Math.sin(a1) * RR);
    }
    this.tweens.add({ targets: rays, angle: 360, duration: 14000, repeat: -1 });
    const badge = this.add.container(W / 2, cy);
    const disc = this.add.graphics();
    disc.fillStyle(0x000000, 0.4).fillCircle(0, 14, 165);
    disc.fillStyle(rankHex).fillCircle(0, 0, 165);
    disc.fillStyle(0x140c24).fillCircle(0, 0, 140);
    disc.lineStyle(8, UI.INK_HEX).strokeCircle(0, 0, 165);
    disc.lineStyle(4, rankHex, 0.6).strokeCircle(0, 0, 126);
    const letter = UI.display(this, 0, 6, rank.rank, 250, { color: rank.color, strokeRatio: 0.1 });
    badge.add([disc, letter]);
    badge.setScale(3).setAlpha(0);

    this.tweens.add({
      targets: badge, scale: 1, alpha: 1, duration: 320, delay: 350, ease: 'Back.Out',
      onComplete: () => {
        Sfx.play(this, rank.rank === 'S' || rank.rank === 'A' ? 'rush' : 'slam');
        Fx.shake(this, 0.015, 200);
        Fx.vibrate(40);
        this.tweens.add({ targets: rays, alpha: 0.35, duration: 400 });
        if ('SAB'.includes(rank.rank)) this.confetti(rank.rank === 'S' ? 90 : 50);
        this.tweens.add({ targets: badge, scale: 1.04, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      },
    });

    // Título del rango en una cinta
    const title = this.add.container(W / 2, 790);
    title.add(UI.pill(this, 0, 0, 560, 76, 0x140c24, { borderColor: rankHex, border: 5 }));
    title.add(UI.display(this, 0, -2, rank.title.toUpperCase(), 42, { color: rank.color }));
    title.setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, y: 780, duration: 300, delay: 700 });

    if (next) {
      UI.label(this, W / 2, 860, `${(next.missing / 1000).toFixed(2)}s faster for rank ${next.rank}!`, 30, { stroke: '#0d0a14' });
    } else {
      UI.label(this, W / 2, 860, 'Top rank! Can you go even faster?', 30, { stroke: '#0d0a14' });
    }

    // Estadísticas
    const chip = (x, label, value, color) => {
      UI.pill(this, x, 940, 300, 70, 0x140c24, { borderColor: 0x3b2463, border: 4 });
      UI.label(this, x, 922, label, 18, { color: COLORS.muted });
      UI.display(this, x, 950, value, 34, { color });
    };
    chip(W / 2 - 165, 'MISTAKES', `${r.mistakes}  (+${(r.mistakes * CONFIG.GAME.PENALTY_MS) / 1000}s)`, r.mistakes ? COLORS.badCss : COLORS.goodCss);
    chip(W / 2 + 165, 'BEST STREAK', `${r.bestCombo}`, COLORS.accent);

    // Botones (aparecen tras una pausa para que un toque accidental no reinicie)
    const again = UI.button(this, W / 2, 1075, 'DASH AGAIN', () => Fx.goTo(this, 'Play'), { w: 480, h: 110, pulse: true, size: 54 });
    const menu = UI.button(this, W / 2, 1192, 'MENU', () => Fx.goTo(this, 'Menu'), { w: 240, h: 72, color: 0x5b3a9a, size: 34 });
    [again, menu].forEach((b) => { b.setAlpha(0); b.disableInteractive(); });
    this.time.delayedCall(800, () => {
      [again, menu].forEach((b) => { b.setInteractive(); this.tweens.add({ targets: b, alpha: 1, duration: 200 }); });
      this.input.keyboard?.once('keydown-SPACE', () => Fx.goTo(this, 'Play'));
    });

    UI.muteButton(this, W - 50, 1226);
  }

  confetti(count) {
    const colors = [0xff8a1f, 0xffe14a, 0x6cff8a, 0x7ad7ff, 0xff5fa2, 0xc9a0ff];
    const em = this.add.particles(0, 0, 'confetti', {
      x: { min: 0, max: CONFIG.WIDTH }, y: -20,
      speedY: { min: 250, max: 520 }, speedX: { min: -120, max: 120 },
      rotate: { min: 0, max: 360 }, angle: { min: 0, max: 360 },
      lifespan: 3200, gravityY: 120,
      tint: colors, scale: { min: 0.8, max: 1.4 },
      emitting: false,
    }).setDepth(400);
    em.explode(count);
    this.time.delayedCall(250, () => em.explode(Math.round(count / 2)));
    this.time.delayedCall(3600, () => em.destroy());
  }
}
