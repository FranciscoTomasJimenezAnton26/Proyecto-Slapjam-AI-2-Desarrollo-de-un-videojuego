// Fin de partida: puntuación, récord guardado en el navegador y "otra vez".
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) { this.score = data.score || 0; }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;
    this.cameras.main.fadeIn(200, 0, 0, 0);

    const best = this.saveBest(this.score);
    const isRecord = this.score > 0 && this.score === best;

    this.add.text(W / 2, H * 0.25, 'FIN', {
      fontFamily: FONT, fontSize: '110px', fontStyle: 'bold', color: COLORS.accent,
      stroke: '#000', strokeThickness: 12,
    }).setOrigin(0.5);

    const scoreText = this.add.text(W / 2, H * 0.43, String(this.score), {
      fontFamily: FONT, fontSize: '160px', fontStyle: 'bold', color: COLORS.text,
    }).setOrigin(0.5);
    Fx.punch(this, scoreText, 0.4);

    this.add.text(W / 2, H * 0.55, isRecord ? '¡NUEVO RÉCORD!' : `Récord: ${best}`, {
      fontFamily: FONT, fontSize: '40px', color: isRecord ? COLORS.accent : COLORS.muted,
    }).setOrigin(0.5);

    const again = this.add.text(W / 2, H * 0.75, 'Toca para jugar otra vez', {
      fontFamily: FONT, fontSize: '44px', color: COLORS.text,
    }).setOrigin(0.5);
    this.tweens.add({ targets: again, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    UI.muteButton(this);

    // Pequeña pausa para que un toque accidental no reinicie al instante
    this.time.delayedCall(500, () => {
      this.input.once('pointerdown', () => { Sfx.play(this, 'tap'); this.scene.start('Play'); });
      this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Play'));
    });
  }

  saveBest(score) {
    let best = 0;
    try { best = parseInt(localStorage.getItem(CONFIG.STORAGE_KEY), 10) || 0; } catch (e) {}
    if (score > best) {
      best = score;
      try { localStorage.setItem(CONFIG.STORAGE_KEY, String(best)); } catch (e) {}
    }
    return best;
  }
}
