// Elementos de interfaz reutilizables: estilo visual común de todo el juego.
//   UI.display(...)  texto grande de dibujos animados (Luckiest Guy) con degradado, contorno y sombra
//   UI.label(...)    texto normal redondeado (Fredoka)
//   UI.pill(...)     cápsula redondeada de fondo
//   UI.button(...)   botón con sombra, rebote al pulsar y pulso opcional
//   UI.timer(...)    cronómetro con cifras de ancho fijo (no "baila" al cambiar los números)
//   UI.backdrop(...) recibidor de fondo · UI.muteButton(...) botón de sonido
const UI = {
  INK: '#2a0f3d',          // contorno morado muy oscuro, mejor que el negro puro para el estilo cartoon
  INK_HEX: 0x2a0f3d,

  // Degradados de relleno para los títulos
  GRADIENTS: {
    candy: ['#fff1a8', '#ffb43a', '#ff6a00'],   // naranja calabaza
    lime: ['#e9ffd0', '#8dff6a', '#2fcf5a'],
    blood: ['#ffd0d8', '#ff6a85', '#d61f45'],
    ghost: ['#ffffff', '#efe6ff', '#c9b6ff'],
  },

  display(scene, x, y, text, size = 80, opts = {}) {
    const t = scene.add.text(x, y, text, {
      fontFamily: CONFIG.FONT_DISPLAY, fontSize: size + 'px', align: 'center',
      color: opts.color || '#ffffff', stroke: opts.stroke || UI.INK, strokeThickness: Math.round(size * (opts.strokeRatio || 0.16)),
      padding: { x: size * 0.15, y: size * 0.12 }, lineSpacing: opts.lineSpacing ?? -size * 0.12,
    }).setOrigin(opts.originX ?? 0.5, opts.originY ?? 0.5);
    t.setShadow(0, Math.round(size * 0.09), '#0d0a14', 0, true, true);
    if (opts.gradient) UI.applyGradient(t, UI.GRADIENTS[opts.gradient] || opts.gradient);
    return t;
  },

  applyGradient(t, stops) {
    const h = t.height || 100;
    const grad = t.context.createLinearGradient(0, h * 0.15, 0, h * 0.85);
    stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
    t.setFill(grad);
  },

  label(scene, x, y, text, size = 28, opts = {}) {
    return scene.add.text(x, y, text, {
      fontFamily: CONFIG.FONT, fontSize: size + 'px', fontStyle: opts.bold === false ? 'normal' : '600',
      color: opts.color || CONFIG.COLORS.text, align: opts.align || 'center',
      stroke: opts.stroke || null, strokeThickness: opts.stroke ? Math.round(size * 0.2) : 0,
      wordWrap: opts.wrap ? { width: opts.wrap } : undefined, lineSpacing: 2,
    }).setOrigin(opts.originX ?? 0.5, opts.originY ?? 0.5);
  },

  // Cápsula: fondo, borde y un brillo arriba
  pill(scene, x, y, w, h, color = 0x1a1033, opts = {}) {
    const g = scene.add.graphics();
    const r = opts.radius ?? h / 2, a = opts.alpha ?? 0.92;
    if (opts.shadow !== false) g.fillStyle(0x000000, 0.35).fillRoundedRect(x - w / 2, y - h / 2 + 6, w, h, r);
    g.fillStyle(color, a).fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    if (opts.shine !== false) g.fillStyle(0xffffff, 0.1).fillRoundedRect(x - w / 2 + 8, y - h / 2 + 5, w - 16, h * 0.38, Math.max(4, r - 8));
    g.lineStyle(opts.border ?? 4, opts.borderColor ?? UI.INK_HEX, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, r);
    return g;
  },

  // Botón grande: devuelve un contenedor interactivo
  button(scene, x, y, text, onClick, opts = {}) {
    const w = opts.w || 420, h = opts.h || 110, color = opts.color ?? CONFIG.COLORS.accentHex;
    const c = scene.add.container(x, y).setDepth(opts.depth ?? 500);
    const base = scene.add.graphics();
    const dark = Phaser.Display.Color.IntegerToColor(color).darken(35).color;
    base.fillStyle(0x000000, 0.35).fillRoundedRect(-w / 2, -h / 2 + 14, w, h, h / 2);
    base.fillStyle(dark).fillRoundedRect(-w / 2, -h / 2 + 8, w, h, h / 2);       // canto inferior (efecto 3D)
    base.fillStyle(color).fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
    base.fillStyle(0xffffff, 0.25).fillRoundedRect(-w / 2 + 14, -h / 2 + 8, w - 28, h * 0.34, h * 0.2);
    base.lineStyle(5, UI.INK_HEX).strokeRoundedRect(-w / 2, -h / 2, w, h + 8, h / 2);
    const label = UI.display(scene, 0, -4, text, opts.size || Math.round(h * 0.5), { strokeRatio: 0.14 });
    c.add([base, label]);
    c.setSize(w, h + 8).setInteractive({ useHandCursor: true });
    c.on('pointerdown', (p, lx, ly, ev) => {
      ev.stopPropagation();
      Sfx.unlock();
      Sfx.play(scene, 'tap');
      scene.tweens.killTweensOf(c);
      scene.tweens.add({ targets: c, scale: 0.92, duration: 70, yoyo: true, onComplete: () => onClick() });
    });
    if (opts.pulse) scene.tweens.add({ targets: c, scale: 1.06, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    return c;
  },

  // Flecha gruesa con contorno (las fuentes no traen flechas bonitas). dir: 1 derecha, -1 izquierda
  arrow(scene, x, y, dir = 1, size = 30, color = 0xffffff) {
    const g = scene.add.graphics({ x, y });
    const pts = [[-0.5, -0.22], [0.05, -0.22], [0.05, -0.5], [0.55, 0], [0.05, 0.5], [0.05, 0.22], [-0.5, 0.22]]
      .map(([px, py]) => new Phaser.Math.Vector2(px * size * dir, py * size));
    g.fillStyle(0x0d0a14, 1).fillPoints(pts.map((p) => new Phaser.Math.Vector2(p.x, p.y + size * 0.1)), true);
    g.fillStyle(color, 1).fillPoints(pts, true);
    g.lineStyle(Math.max(3, size * 0.12), UI.INK_HEX).strokePoints(pts, true);
    return g;
  },

  // Chip de control: texto + flecha. dir 1 → la flecha va a la derecha del texto, -1 a la izquierda
  controlChip(scene, x, y, text, dir, color, w = 210, h = 58, size = 32, depth = 101) {
    UI.pill(scene, x, y, w, h, color, { border: 4 }).setDepth(depth);
    const t = UI.display(scene, x - dir * size * 0.45, y - 2, text, size, { strokeRatio: 0.18 }).setDepth(depth + 1);
    UI.arrow(scene, x + dir * (t.width / 2 - size * 0.05), y, dir, size * 0.95).setDepth(depth + 1);
  },

  // Cronómetro "0:00.00" con cada carácter en una casilla fija
  timer(scene, x, y, size = 76, opts = {}) {
    const c = scene.add.container(x, y);
    const digitW = size * 0.6, sepW = size * 0.3;
    const pattern = '0:00.00';
    const total = [...pattern].reduce((s, ch) => s + (/\d/.test(ch) ? digitW : sepW), 0);
    let cx = -total / 2;
    const cells = [...pattern].map((ch) => {
      const w = /\d/.test(ch) ? digitW : sepW;
      const t = UI.display(scene, cx + w / 2, 0, ch, size, { strokeRatio: 0.14, gradient: opts.gradient });
      cx += w;
      c.add(t);
      return t;
    });
    c.setValue = (str) => {
      const chars = [...str].slice(-cells.length);
      cells.forEach((cell, i) => { if (cell.text !== chars[i]) cell.setText(chars[i]); });
    };
    c.setTint = (css) => cells.forEach((cell) => cell.setColor(css));
    c.clearTint = () => cells.forEach((cell) => (opts.gradient ? UI.applyGradient(cell, UI.GRADIENTS[opts.gradient]) : cell.setColor('#ffffff')));
    return c;
  },

  // Fondo de recibidor. open=true muestra la puerta abierta con la calle detrás.
  backdrop(scene, dim = 0.55, open = false) {
    const { WIDTH: W, HEIGHT: H } = CONFIG;
    if (scene.textures.exists('fg-wall')) {
      if (open && scene.textures.exists('bg-street')) scene.add.image(DOOR.x, DOOR.cy, 'bg-street');
      if (scene.textures.exists('door')) {
        const d = scene.add.image(DOOR.x - DOOR.width / 2, DOOR.cy, 'door').setOrigin(0, 0.5).setDisplaySize(DOOR.width, DOOR.height);
        if (open) d.scaleX *= 0.06;
        scene.backdropDoor = d;
      }
      scene.backdropWall = scene.add.image(W / 2, H / 2, 'fg-wall').setDisplaySize(W, H);
    }
    scene.backdropDim = scene.add.rectangle(W / 2, H / 2, W, H, 0x0d0a14, dim);
  },

  // Murciélagos que cruzan la pantalla de vez en cuando
  bats(scene, count = 4, depth = 5) {
    for (let i = 0; i < count; i++) {
      const bat = scene.add.image(-80, 0, 'bat').setDepth(depth).setAlpha(0.85);
      const fly = () => {
        const fromLeft = Math.random() < 0.5, y = Phaser.Math.Between(140, 900), s = Phaser.Math.FloatBetween(0.5, 1);
        bat.setPosition(fromLeft ? -60 : CONFIG.WIDTH + 60, y).setScale(s).setFlipX(!fromLeft);
        scene.tweens.add({ targets: bat, x: fromLeft ? CONFIG.WIDTH + 60 : -60, duration: Phaser.Math.Between(3500, 6500),
          delay: Phaser.Math.Between(0, 4000), onComplete: fly });
        scene.tweens.add({ targets: bat, y: y + Phaser.Math.Between(-60, 60), duration: 700, yoyo: true, repeat: 6, ease: 'Sine.InOut' });
      };
      fly();
      scene.tweens.add({ targets: bat, scaleY: { from: bat.scaleY, to: bat.scaleY * 0.55 }, duration: 120, yoyo: true, repeat: -1 });
    }
  },

  // Panel redondeado semitransparente detrás de un bloque de texto
  panel(scene, x, y, w, h, alpha = 0.82) {
    return UI.pill(scene, x, y, w, h, 0x140c24, { radius: 32, alpha, border: 5, borderColor: 0x3b2463, shine: false });
  },

  // Botón de sonido en una esquina. Llama a UI.muteButton(this) en el create() de una escena.
  muteButton(scene, x = CONFIG.WIDTH - 60, y = CONFIG.HEIGHT - 60) {
    Sfx.applyMute(scene);
    const label = () => (Sfx.isMuted() ? '🔇' : '🔊');
    const bg = scene.add.circle(x, y, 34, 0x140c24, 0.85).setStrokeStyle(4, 0x3b2463).setDepth(1999);
    const btn = scene.add.text(x, y, label(), { fontSize: '36px' })
      .setOrigin(0.5)
      .setDepth(2000)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', (pointer, lx, ly, event) => {
      event.stopPropagation();          // que no cuente como toque del juego
      Sfx.unlock();
      Sfx.toggleMute(scene);
      btn.setText(label());
      Fx.punch(scene, btn, 0.3);
      Fx.punch(scene, bg, 0.2);
    });
    return btn;
  },
};
