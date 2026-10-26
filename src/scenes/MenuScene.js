// Pantalla de título: un toque desbloquea el audio y empieza la partida.
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const { WIDTH: W, HEIGHT: H, COLORS, FONT } = CONFIG;

    this.add.text(W / 2, H * 0.32, 'TÍTULO\nDEL JUEGO', {
      fontFamily: FONT, fontSize: '88px', fontStyle: 'bold', align: 'center',
      color: COLORS.accent, stroke: '#000', strokeThickness: 12,
    }).setOrigin(0.5);

    const start = this.add.text(W / 2, H * 0.68, 'Toca para empezar', {
      fontFamily: FONT, fontSize: '44px', color: COLORS.text,
    }).setOrigin(0.5);

    this.tweens.add({ targets: start, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    this.add.text(W / 2, H - 60, 'Slapjam #2 · hecho con IA', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.muted,
    }).setOrigin(0.5);

    UI.muteButton(this);

    this.input.once('pointerdown', () => this.begin());
    this.input.keyboard?.once('keydown-SPACE', () => this.begin());
  }

  begin() {
    if (this.starting) return;
    this.starting = true;
    Sfx.unlock();
    Sfx.play(this, 'tap');
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Play'));
  }
}
