// Detección de deslizamientos (swipe) y toques, funciona con dedo y con ratón.
// Uso en una escena:
//   Swipe.attach(this, {
//     onSwipe: (dir, info) => { ... },   // dir: 'left' | 'right' | 'up' | 'down'
//     onTap:   (pointer) => { ... },
//     onDrag:  (dx, dy) => { ... },      // opcional: mientras el dedo se mueve (para que algo lo siga)
//     onCancel: () => { ... },           // opcional: se soltó sin llegar a ser swipe
//   });
const Swipe = {
  attach(scene, { onSwipe = () => {}, onTap = () => {}, onDrag = null, onCancel = null } = {}) {
    let start = null;

    scene.input.on('pointerdown', (p) => {
      start = { x: p.x, y: p.y, time: p.downTime };
    });

    scene.input.on('pointermove', (p) => {
      if (start && p.isDown && onDrag) onDrag(p.x - start.x, p.y - start.y);
    });

    scene.input.on('pointerup', (p) => {
      if (!start) return;
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(p.upTime - start.time, 1);
      start = null;

      // Cuenta como swipe si recorre suficiente distancia, o si es corto pero muy rápido (un "flick").
      const isSwipe = dist >= CONFIG.SWIPE_MIN_DISTANCE * 2
        || (dist >= CONFIG.SWIPE_MIN_DISTANCE && dt <= CONFIG.SWIPE_MAX_TIME);

      if (isSwipe) {
        const dir = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
        onSwipe(dir, { dx, dy, dist, dt, speed: dist / dt });
      } else if (dist < CONFIG.SWIPE_MIN_DISTANCE / 2) {
        onTap(p);
      } else if (onCancel) {
        onCancel();
      }
    });

    // Para probar en el ordenador: flechas izquierda/derecha simulan un swipe
    scene.input.keyboard?.on('keydown-LEFT', () => onSwipe('left', { speed: 2 }));
    scene.input.keyboard?.on('keydown-RIGHT', () => onSwipe('right', { speed: 2 }));
    scene.input.keyboard?.on('keydown-SPACE', () => onTap({ x: CONFIG.WIDTH / 2, y: CONFIG.HEIGHT / 2 }));
  },
};
