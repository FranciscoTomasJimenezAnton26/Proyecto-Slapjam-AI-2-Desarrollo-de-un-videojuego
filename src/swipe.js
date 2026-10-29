// Detección de deslizamientos (swipe) y toques, funciona con dedo y con ratón.
// Uso en una escena:
//   Swipe.attach(this, {
//     onSwipe: (dir, info) => { ... },   // dir: 'left' | 'right' | 'up' | 'down'
//     onTap:   (pointer) => { ... },
//     onDrag:  (dx, dy) => { ... },      // opcional: mientras el dedo se mueve (para que algo lo siga)
//     onCancel: () => { ... },           // opcional: se soltó sin llegar a ser swipe
//   });
//
// Para que se sienta inmediato, el swipe se dispara EN CUANTO el dedo recorre
// CONFIG.SWIPE_COMMIT_DISTANCE, sin esperar a que lo levantes. Si lo levantas antes,
// también cuenta si fue un gesto corto y rápido (un "flick").
const Swipe = {
  attach(scene, { onSwipe = () => {}, onTap = () => {}, onDrag = null, onCancel = null } = {}) {
    let start = null;   // gesto en curso
    let fired = false;  // el gesto actual ya disparó un swipe

    const direction = (dx, dy) => (Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'right' : 'left')
      : (dy > 0 ? 'down' : 'up'));

    const fire = (dx, dy, dt) => {
      fired = true;
      const dist = Math.hypot(dx, dy);
      onSwipe(direction(dx, dy), { dx, dy, dist, dt, speed: dist / Math.max(dt, 1) });
    };

    scene.input.on('pointerdown', (p) => {
      start = { x: p.x, y: p.y, time: p.downTime };
      fired = false;
    });

    scene.input.on('pointermove', (p) => {
      if (!start || !p.isDown || fired) return;
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      if (onDrag) onDrag(dx, dy);
      if (Math.hypot(dx, dy) >= CONFIG.SWIPE_COMMIT_DISTANCE) fire(dx, dy, p.moveTime - start.time);
    });

    scene.input.on('pointerup', (p) => {
      if (!start) return;
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(p.upTime - start.time, 1);
      start = null;
      if (fired) return; // ya se resolvió durante el movimiento

      if (dist >= CONFIG.SWIPE_MIN_DISTANCE && dt <= CONFIG.SWIPE_MAX_TIME) {
        fire(dx, dy, dt);                 // flick corto y rápido
      } else if (dist < CONFIG.SWIPE_MIN_DISTANCE / 2) {
        onTap(p);
      } else if (onCancel) {
        onCancel();                       // arrastró un poco y soltó: volver a su sitio
      }
    });

    // Para probar en el ordenador: flechas izquierda/derecha simulan un swipe
    scene.input.keyboard?.on('keydown-LEFT', () => onSwipe('left', { speed: 2 }));
    scene.input.keyboard?.on('keydown-RIGHT', () => onSwipe('right', { speed: 2 }));
    scene.input.keyboard?.on('keydown-SPACE', () => onTap({ x: CONFIG.WIDTH / 2, y: CONFIG.HEIGHT / 2, keyboard: true }));
  },
};
