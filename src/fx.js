// "Juice": pequeños efectos reutilizables que hacen que cada acción se sienta bien.
const Fx = {
  // Temblor de cámara
  shake(scene, intensity = 0.012, duration = 150) {
    scene.cameras.main.shake(duration, intensity);
  },

  // Destello de pantalla completa
  flash(scene, color = 0xffffff, duration = 120) {
    const c = Phaser.Display.Color.IntegerToColor(color);
    scene.cameras.main.flash(duration, c.red, c.green, c.blue);
  },

  // Un objeto "late": se aplasta y rebota
  punch(scene, target, amount = 0.15) {
    scene.tweens.killTweensOf(target);
    target.setScale(1 + amount, 1 - amount);
    scene.tweens.add({ targets: target, scaleX: 1, scaleY: 1, duration: 260, ease: 'Back.Out' });
  },

  // Texto que salta y se desvanece (p. ej. "+1", "¡FALLO!")
  popText(scene, x, y, text, color = CONFIG.COLORS.text, size = 56) {
    const t = UI.display(scene, x, y, text, size, { color }).setDepth(1000).setScale(0.4);
    scene.tweens.add({ targets: t, scale: 1, duration: 180, ease: 'Back.Out' });
    scene.tweens.add({ targets: t, y: y - 120, alpha: 0, delay: 250, duration: 500, onComplete: () => t.destroy() });
  },

  // Explosión de partículas con la textura 'dot' generada en BootScene
  burst(scene, x, y, tint = 0xffffff, count = 18) {
    const emitter = scene.add.particles(x, y, 'dot', {
      speed: { min: 200, max: 600 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: { min: 300, max: 600 },
      gravityY: 900,
      tint,
      emitting: false,
    }).setDepth(900);
    emitter.explode(count);
    scene.time.delayedCall(800, () => emitter.destroy());
  },

  // Cambio de pantalla con fundido. Uso: Fx.goTo(this, 'GameOver', { score: 10 })
  goTo(scene, key, data = {}, duration = 200) {
    if (scene._leaving) return;
    scene._leaving = true;
    scene.input.enabled = false;
    scene.cameras.main.fadeOut(duration, 0, 0, 0);
    scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(key, data));
  },

  // Entrada con fundido: llamar al principio de create()
  fadeIn(scene, duration = 200) {
    scene._leaving = false;
    scene.input.enabled = true; // goTo la desactiva al salir; al volver a la escena hay que reactivarla
    scene.cameras.main.fadeIn(duration, 0, 0, 0);
  },

  // Vibración del móvil (Android; los iPhone no la permiten en el navegador y se ignora sin error).
  // Uso: Fx.vibrate(30) para un toque corto, Fx.vibrate([40, 30, 40]) para un patrón.
  vibrate(pattern = 25) {
    if (Sfx.isMuted()) return; // si el jugador silenció el juego, tampoco vibra
    try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) {}
  },

  // Congela el juego unos milisegundos para dar peso a un golpe ("hit stop")
  hitStop(scene, ms = 60) {
    scene.time.timeScale = 0.05;
    scene.tweens.timeScale = 0.05;
    setTimeout(() => { scene.time.timeScale = 1; scene.tweens.timeScale = 1; }, ms);
  },
};
