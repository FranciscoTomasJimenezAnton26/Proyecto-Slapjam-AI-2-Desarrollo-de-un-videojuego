// Escena de juego DE PRUEBA: solo demuestra la plantilla (swipe, juice, temporizador, puntuación).
// Aparece una tarjeta de color: verde → deslizar a la derecha, roja → deslizar a la izquierda.
// El jueves sustituiremos esto por el juego real.
class PlayScene extends Phaser.Scene {
  constructor() { super('Play'); }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;
    this.cameras.main.fadeIn(200, 0, 0, 0);

    this.score = 0;
    this.timeLeft = CONFIG.ROUND_SECONDS;
    this.busy = false;

    // Interfaz
    this.scoreText = this.add.text(40, 40, '0', {
      fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: COLORS.text,
    });
    this.timerText = this.add.text(W - 40, 40, String(this.timeLeft), {
      fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(1, 0);

    this.add.text(W / 2, H - 120, '← rojo        verde →', {
      fontFamily: FONT, fontSize: '36px', color: COLORS.muted,
    }).setOrigin(0.5);

    // Tarjeta
    this.card = this.add.image(W / 2, H / 2, 'card');
    this.nextCard();

    UI.muteButton(this, W - 60, 160);

    // Entrada
    Swipe.attach(this, { onSwipe: (dir) => this.handleSwipe(dir) });

    // Cuenta atrás
    this.time.addEvent({
      delay: 1000, loop: true, callback: () => {
        this.timeLeft--;
        this.timerText.setText(String(this.timeLeft));
        if (this.timeLeft <= 5) Fx.punch(this, this.timerText, 0.3);
        if (this.timeLeft <= 0) this.endRound();
      },
    });
  }

  nextCard() {
    const { WIDTH: W, HEIGHT: H, COLORS } = CONFIG;
    this.cardIsGood = Math.random() < 0.5;
    this.card
      .setPosition(W / 2, H / 2 + 60)
      .setAngle(0)
      .setAlpha(0)
      .setScale(0.8)
      .setTint(this.cardIsGood ? COLORS.good : COLORS.bad);
    this.tweens.add({
      targets: this.card, y: H / 2, alpha: 1, scale: 1, duration: 220, ease: 'Back.Out',
      onComplete: () => { this.busy = false; },
    });
  }

  handleSwipe(dir) {
    if (this.busy || (dir !== 'left' && dir !== 'right')) return;
    this.busy = true;

    const correct = (dir === 'right') === this.cardIsGood;
    const { WIDTH: W } = CONFIG;

    Sfx.play(this, 'whoosh');
    this.tweens.add({
      targets: this.card,
      x: dir === 'right' ? W + 300 : -300,
      angle: dir === 'right' ? 25 : -25,
      duration: 220, ease: 'Quad.In',
      onComplete: () => this.nextCard(),
    });

    if (correct) {
      this.score++;
      this.scoreText.setText(String(this.score));
      Fx.punch(this, this.scoreText, 0.3);
      Fx.popText(this, this.card.x, this.card.y - 260, '+1', '#6cff8a');
      Fx.burst(this, this.card.x, this.card.y, CONFIG.COLORS.good);
      Sfx.play(this, 'good');
    } else {
      Fx.shake(this, 0.02, 220);
      Fx.flash(this, CONFIG.COLORS.bad, 150);
      Fx.hitStop(this, 80);
      Fx.popText(this, this.card.x, this.card.y - 260, '¡FALLO!', '#ff4d6d');
      Sfx.play(this, 'bad');
    }
  }

  endRound() {
    this.time.removeAllEvents();
    this.input.removeAllListeners();
    this.scene.start('GameOver', { score: this.score });
  }
}
