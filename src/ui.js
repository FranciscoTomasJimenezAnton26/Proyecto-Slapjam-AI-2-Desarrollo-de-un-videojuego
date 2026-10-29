// Elementos de interfaz reutilizables.
const UI = {
  // Fondo de recibidor con la puerta cerrada (si existe el arte) y un velo oscuro para que se lea el texto.
  backdrop(scene, dim = 0.55) {
    const { WIDTH: W, HEIGHT: H } = CONFIG;
    if (scene.textures.exists('fg-wall')) {
      if (scene.textures.exists('door')) scene.add.image(DOOR.x, DOOR.cy, 'door').setDisplaySize(DOOR.width, DOOR.height);
      scene.add.image(W / 2, H / 2, 'fg-wall').setDisplaySize(W, H);
    }
    scene.add.rectangle(W / 2, H / 2, W, H, 0x0d0a14, dim);
  },

  // Panel redondeado semitransparente detrás de un bloque de texto
  panel(scene, x, y, w, h, alpha = 0.78) {
    const g = scene.add.graphics();
    g.fillStyle(0x0d0a14, alpha).fillRoundedRect(x - w / 2, y - h / 2, w, h, 28);
    g.lineStyle(3, 0x3b2463, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 28);
    return g;
  },

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
