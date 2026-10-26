// Detección de deslizamientos (swipe) y toques, funciona con dedo y con ratón.
// Uso en una escena:
//   Swipe.attach(this, {
//     onSwipe: (dir, info) => { ... },   // dir: 'left' | 'right' | 'up' | 'down'
//     onTap:   (pointer) => { ... },
//   });
const Swipe = {
  attach(scene, { onSwipe = () => {}, onTap = () => {} } = {}) {
    let start = null;

    scene.input.on('pointerdown', (p) => {
      start = { x: p.x, y: p.y, time: p.downTime };
    });

    scene.input.on('pointerup', (p) => {
      if (!start) return;
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      const dist = Math.hypot(dx, dy);
      const dt = p.upTime - start.time;
      start = null;

      if (dist >= CONFIG.SWIPE_MIN_DISTANCE && dt <= CONFIG.SWIPE_MAX_TIME) {
        const dir = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
        onSwipe(dir, { dx, dy, dist, dt, speed: dist / Math.max(dt, 1) });
      } else if (dist < CONFIG.SWIPE_MIN_DISTANCE / 2) {
        onTap(p);
      }
    });

    // Para probar en el ordenador: flechas izquierda/derecha simulan un swipe
    scene.input.keyboard?.on('keydown-LEFT', () => onSwipe('left', { speed: 2 }));
    scene.input.keyboard?.on('keydown-RIGHT', () => onSwipe('right', { speed: 2 }));
    scene.input.keyboard?.on('keydown-SPACE', () => onTap({ x: CONFIG.WIDTH / 2, y: CONFIG.HEIGHT / 2 }));
  },
};
