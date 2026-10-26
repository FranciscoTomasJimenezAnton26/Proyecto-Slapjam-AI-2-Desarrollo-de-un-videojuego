// Escena de juego DE PRUEBA: solo demuestra la plantilla (swipe, juice, temporizador, puntuación).
// Aparece una tarjeta de color: verde → deslizar a la derecha, roja → deslizar a la izquierda.
// El jueves sustituiremos esto por el juego real.
class PlayScene extends Phaser.Scene {
  constructor() { super('Play'); }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;
    Fx.fadeIn(this);

    this.score = 0;
    this.timeLeft = CONFIG.ROUND_SECONDS;

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

    // Tarjeta: sigue al dedo mientras arrastras y sale volando al deslizar
    this.card = this.add.image(W / 2, H / 2, 'card');
    this.nextCard();

    UI.muteButton(this, W - 60, 160);

    // Entrada
    Swipe.attach(this, {
      onSwipe: (dir) => this.handleSwipe(dir),
      onDrag: (dx) => this.card.setPosition(W / 2 + dx, H / 2).setAngle(dx * 0.05),
      onCancel: () => this.tweens.add({ targets: this.card, x: W / 2, angle: 0, duration: 150, ease: 'Back.Out' }),
    });

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
    this.tweens.killTweensOf(this.card);
    this.card
      .setPosition(W / 2, H / 2 + 40)
      .setAngle(0)
      .setAlpha(0.3)
      .setScale(0.85)
      .setTint(this.cardIsGood ? COLORS.good : COLORS.bad);
    // La nueva tarjeta acepta gestos desde el primer instante: la animación es solo visual
    this.tweens.add({ targets: this.card, y: H / 2, alpha: 1, scale: 1, duration: 160, ease: 'Back.Out' });
  }

  handleSwipe(dir) {
    if (dir !== 'left' && dir !== 'right') return;

    const correct = (dir === 'right') === this.cardIsGood;
    const { WIDTH: W } = CONFIG;

    // Una copia sale volando desde donde está el dedo y la tarjeta real se recicla al momento
    const flying = this.add.image(this.card.x, this.card.y, 'card')
      .setTint(this.card.tintTopLeft).setAngle(this.card.angle).setScale(this.card.scale);
    this.tweens.add({
      targets: flying,
      x: dir === 'right' ? W + 300 : -300,
      angle: dir === 'right' ? 30 : -30,
      duration: 200, ease: 'Quad.In',
      onComplete: () => flying.destroy(),
    });

    Sfx.play(this, 'whoosh');
    if (correct) {
      this.score++;
      this.scoreText.setText(String(this.score));
      Fx.punch(this, this.scoreText, 0.3);
      Fx.popText(this, flying.x, flying.y - 260, '+1', '#6cff8a');
      Fx.burst(this, flying.x, flying.y, CONFIG.COLORS.good);
      Sfx.play(this, 'good');
    } else {
      Fx.shake(this, 0.02, 220);
      Fx.flash(this, CONFIG.COLORS.bad, 150);
      Fx.popText(this, flying.x, flying.y - 260, '¡FALLO!', '#ff4d6d');
      Sfx.play(this, 'bad');
    }
    this.nextCard();
  }

  endRound() {
    this.time.removeAllEvents();
    this.input.removeAllListeners();
    Fx.goTo(this, 'GameOver', { score: this.score });
  }
}
