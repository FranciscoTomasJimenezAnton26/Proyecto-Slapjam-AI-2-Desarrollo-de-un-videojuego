// Elementos de interfaz reutilizables.
const UI = {
  // Botón de sonido en una esquina. Llama a UI.muteButton(this) en el create() de una escena.
  muteButton(scene, x = CONFIG.WIDTH - 60, y = CONFIG.HEIGHT - 60) {
    Sfx.applyMute(scene);
    const label = () => (Sfx.isMuted() ? '🔇' : '🔊');
    const btn = scene.add.text(x, y, label(), { fontSize: '48px' })
      .setOrigin(0.5)
      .setDepth(2000)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', (pointer, lx, ly, event) => {
      event.stopPropagation();          // que no cuente como toque del juego
      Sfx.unlock();
      Sfx.toggleMute(scene);
      btn.setText(label());
      Fx.punch(scene, btn, 0.3);
    });
    return btn;
  },

  // Botón de texto genérico con rebote al pulsar
  button(scene, x, y, text, onClick, size = 44) {
    const btn = scene.add.text(x, y, text, {
      fontFamily: CONFIG.FONT, fontSize: size + 'px', fontStyle: 'bold',
      color: CONFIG.COLORS.text, backgroundColor: '#3b2463',
      padding: { x: 32, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', (pointer, lx, ly, event) => {
      event.stopPropagation();
      Sfx.play(scene, 'tap');
      Fx.punch(scene, btn, 0.15);
      scene.time.delayedCall(120, onClick);
    });
    return btn;
  },
};
