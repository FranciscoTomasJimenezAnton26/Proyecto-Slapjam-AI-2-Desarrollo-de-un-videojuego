// DOORBELL DASH — la partida.
// Llegan 30 visitantes. Desliza a la DERECHA para dar caramelos a los niños y a la IZQUIERDA para
// dar un portazo a los monstruos. Cuenta el tiempo total: cada error suma +3 s.
// Los aciertos seguidos activan el SUGAR RUSH: todo va más rápido (y tu tiempo baja más).
// Toca la bombilla para ver la sombra verdadera del visitante.

const DOOR = { x: 360, top: 300, bottom: 1020, width: 420 };
DOOR.cy = (DOOR.top + DOOR.bottom) / 2;
DOOR.height = DOOR.bottom - DOOR.top;
const BULB = { x: 360, y: 255 };
const FEET_Y = DOOR.bottom - 18;

class PlayScene extends Phaser.Scene {
  constructor() { super('Play'); }

  create() {
    Fx.fadeIn(this);

    // ----- Estado de la partida -----
    this.state = 'countdown';  // countdown → ringing → open → resolving → … → done
    this.running = false;
    this.served = 0;
    this.elapsed = 0;          // tiempo real jugado (ms)
    this.penalty = 0;          // tiempo sumado por errores (ms)
    this.mistakes = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.rush = 0;
    this.splits = [];
    this.pb = Records.load();
    this.visitor = null;
    this.lastDef = null;
    this.monsterStreak = { type: null, count: 0 };

    // Solo usamos visitantes con imagen si hay alguno; si no, todos con dibujo provisional
    const withArt = VISITORS.filter((v) => this.textures.exists(`${v.id}-kid`) && this.textures.exists(`${v.id}-monster`));
    this.pool = withArt.length ? withArt : VISITORS;

    this.buildScene();
    this.buildHud();

    Swipe.attach(this, {
      onSwipe: (dir) => this.decide(dir),
      onTap: (p) => this.tap(p),
      onDrag: (dx) => this.drag(dx),
      onCancel: () => this.drag(0),
    });

    this.startCountdown();
  }

  // ---------- Escenario ----------
  buildScene() {
    const { WIDTH: W, HEIGHT: H, COLORS } = CONFIG;

    // Calle (lo que se ve por la puerta)
    if (this.textures.exists('bg-street')) {
      this.add.image(W / 2, H / 2, 'bg-street').setDisplaySize(W, H).setDepth(0);
    } else {
      const g = this.add.graphics().setDepth(0);
      g.fillGradientStyle(0x1a1033, 0x1a1033, COLORS.street, COLORS.street, 1);
      g.fillRect(DOOR.x - DOOR.width / 2, DOOR.top, DOOR.width, DOOR.height);
      g.fillStyle(0xfff3c4).fillCircle(DOOR.x + 120, DOOR.top + 90, 34);                           // luna
      g.fillStyle(0x24163f).fillRect(DOOR.x - DOOR.width / 2, DOOR.bottom - 60, DOOR.width, 60); // suelo del porche
      g.fillStyle(0xff8a1f).fillCircle(DOOR.x - 150, DOOR.bottom - 70, 26);                       // calabaza
    }

    // Líneas de velocidad del Sugar Rush (en los bordes de la pantalla, por encima de la pared)
    this.lines = this.add.graphics().setDepth(90);
    this.lineParts = [];

    // Puerta: gira desde la bisagra izquierda
    this.door = this.add.image(DOOR.x - DOOR.width / 2, DOOR.cy, 'door')
      .setOrigin(0, 0.5).setDisplaySize(DOOR.width, DOOR.height).setDepth(20);
    this.doorScale = this.door.scaleX;

    // Pared del recibidor alrededor de la puerta
    if (this.textures.exists('fg-wall')) {
      this.add.image(W / 2, H / 2, 'fg-wall').setDisplaySize(W, H).setDepth(30);
    } else {
      const g = this.add.graphics().setDepth(30);
      const l = DOOR.x - DOOR.width / 2, r = DOOR.x + DOOR.width / 2;
      g.fillStyle(0x2b1d3d);
      g.fillRect(0, 0, W, DOOR.top).fillRect(0, DOOR.bottom, W, H - DOOR.bottom);
      g.fillRect(0, DOOR.top, l, DOOR.height).fillRect(r, DOOR.top, W - r, DOOR.height);
      g.fillStyle(0x5a3a22).fillRect(l - 26, DOOR.top - 26, DOOR.width + 52, 26)
        .fillRect(l - 26, DOOR.top, 26, DOOR.height).fillRect(r, DOOR.top, 26, DOOR.height);
      g.fillStyle(0x1e1430).fillRect(0, DOOR.bottom, W, 14);
    }

    // Bombilla del porche
    this.bulb = this.add.container(BULB.x, BULB.y).setDepth(31);
    const glow = this.add.circle(0, 0, 44, COLORS.light, 0.18);
    const bulb = this.add.circle(0, 0, 24, COLORS.light);
    const base = this.add.rectangle(0, -30, 22, 14, 0x3a3a46);
    this.bulb.add([glow, bulb, base]);
    this.tweens.add({ targets: glow, scale: 1.25, alpha: 0.32, duration: 700, yoyo: true, repeat: -1 });

    // Cono de luz que aparece al tocar la bombilla
    this.cone = this.add.graphics().setDepth(32).setAlpha(0);
    this.cone.fillStyle(COLORS.light, 0.22);
    this.cone.fillTriangle(BULB.x, BULB.y, DOOR.x - DOOR.width / 2, DOOR.bottom, DOOR.x + DOOR.width / 2, DOOR.bottom);
  }

  buildHud() {
    const { WIDTH: W, COLORS, FONT } = CONFIG;
    const D = 100;

    this.timerText = this.add.text(W / 2, 30, formatTime(0), {
      fontFamily: FONT, fontSize: '84px', fontStyle: 'bold', color: COLORS.text,
      stroke: '#000', strokeThickness: 10,
    }).setOrigin(0.5, 0).setDepth(D);

    this.deltaText = this.add.text(W / 2, 128, '', {
      fontFamily: FONT, fontSize: '30px', fontStyle: 'bold', color: COLORS.muted,
      stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5, 0).setDepth(D);

    this.countText = this.add.text(32, 40, `0/${CONFIG.GAME.VISITORS}`, {
      fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: COLORS.accent,
      stroke: '#000', strokeThickness: 8,
    }).setDepth(D);

    // Sugar Rush: 5 caramelos que se iluminan
    this.rushPips = [];
    for (let i = 0; i < CONFIG.GAME.RUSH_MAX; i++) {
      this.rushPips.push(this.add.circle(W - 40 - (CONFIG.GAME.RUSH_MAX - 1 - i) * 30, 62, 11, 0x3b2463)
        .setStrokeStyle(3, 0x000000).setDepth(D));
    }
    this.rushText = this.add.text(W - 26, 84, 'SUGAR RUSH', {
      fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: COLORS.muted,
    }).setOrigin(1, 0).setDepth(D);

    // Barra de paciencia del visitante (debajo de la puerta)
    this.patienceBg = this.add.rectangle(DOOR.x, DOOR.bottom + 50, 300, 18, 0x000000, 0.5).setDepth(D).setVisible(false);
    this.patienceBar = this.add.rectangle(DOOR.x - 150, DOOR.bottom + 50, 300, 18, COLORS.good).setOrigin(0, 0.5).setDepth(D).setVisible(false);

    // Ayuda de controles
    this.add.text(40, 1150, '← SLAM', {
      fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: COLORS.badCss, stroke: '#000', strokeThickness: 8,
    }).setDepth(D);
    this.add.text(W - 40, 1150, 'TREAT →', {
      fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: COLORS.goodCss, stroke: '#000', strokeThickness: 8,
    }).setOrigin(1, 0).setDepth(D);
    this.add.text(W / 2 - 30, 1222, 'tap the 💡 to see their true shadow', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.muted,
    }).setOrigin(0.5).setDepth(D);

    UI.muteButton(this, W - 44, 1222);
  }

  // ---------- Cuenta atrás ----------
  startCountdown() {
    const steps = ['3', '2', '1', 'GO!'];
    steps.forEach((label, i) => this.time.delayedCall(450 + i * 520, () => {
      const last = i === steps.length - 1;
      Sfx.play(this, last ? 'go' : 'count');
      const t = this.add.text(CONFIG.WIDTH / 2, DOOR.cy, label, {
        fontFamily: CONFIG.FONT, fontSize: last ? '170px' : '200px', fontStyle: 'bold',
        color: last ? CONFIG.COLORS.goodCss : CONFIG.COLORS.text, stroke: '#000', strokeThickness: 14,
      }).setOrigin(0.5).setDepth(200).setScale(1.6).setAlpha(0);
      this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 160, ease: 'Back.Out' });
      this.tweens.add({ targets: t, alpha: 0, scale: 0.8, delay: 360, duration: 150, onComplete: () => t.destroy() });
      if (last) { this.running = true; this.nextVisitor(); }
    }));
  }

  // ---------- Ritmo ----------
  speed() { return 1 - CONFIG.GAME.RUSH_SPEEDUP * this.rush; } // 1 normal · 0.4 en Sugar Rush máximo

  patienceFor(index) {
    const G = CONFIG.GAME;
    const t = index / Math.max(1, G.VISITORS - 1);
    return (G.PATIENCE_START + (G.PATIENCE_END - G.PATIENCE_START) * t) * (1 - G.RUSH_PATIENCE * this.rush);
  }

  pickVisitor() {
    const G = CONFIG.GAME;
    let options = this.pool.filter((v) => v !== this.lastDef);
    if (!options.length) options = this.pool;
    const def = Phaser.Utils.Array.GetRandom(options);
    let isMonster = Math.random() < G.MONSTER_CHANCE;
    // Nunca más de 3 seguidos del mismo tipo
    if (this.monsterStreak.type === isMonster && this.monsterStreak.count >= 3) isMonster = !isMonster;
    this.monsterStreak = this.monsterStreak.type === isMonster
      ? { type: isMonster, count: this.monsterStreak.count + 1 } : { type: isMonster, count: 1 };
    this.lastDef = def;
    return { def, isMonster };
  }

  nextVisitor() {
    if (this.served >= CONFIG.GAME.VISITORS) { this.finish(); return; }
    this.state = 'ringing';
    Sfx.play(this, 'bell');
    this.tweens.add({ targets: this.bulb, angle: { from: -12, to: 12 }, duration: 60, yoyo: true, repeat: 1, onComplete: () => this.bulb.setAngle(0) });
    this.time.delayedCall(CONFIG.GAME.GAP_MS * this.speed(), () => this.openDoor());
  }

  openDoor() {
    const { def, isMonster } = this.pickVisitor();
    const progress = this.served / Math.max(1, CONFIG.GAME.VISITORS - 1);
    this.visitor = new Visitor(this, DOOR.x, FEET_Y, def, isMonster, 1 - 0.45 * progress).setDepth(10);
    this.visitor.setScale(0.94);
    this.tweens.add({ targets: this.visitor, scale: 1, duration: 180, ease: 'Back.Out' });

    this.tweens.killTweensOf(this.door);
    this.tweens.add({ targets: this.door, scaleX: this.doorScale * 0.06, duration: CONFIG.GAME.DOOR_OPEN_MS * this.speed(), ease: 'Quad.Out' });
    Sfx.play(this, 'whoosh');
    // "¡Truco o trato!" balbuceado: la misma voz de niño para todos (los monstruos disimulan)
    if (this.rush < 3) this.time.delayedCall(60, () => Sfx.play(this, `voice${Phaser.Math.Between(1, 3)}`, { volume: 0.6 }));

    this.patienceTotal = this.patienceFor(this.served);
    this.patienceLeft = this.patienceTotal;
    this.patienceBg.setVisible(true);
    this.patienceBar.setVisible(true);
    this.state = 'open';
  }

  closeDoor(fast = false) {
    this.tweens.killTweensOf(this.door);
    this.door.scaleX = this.doorScale * 0.06;
    this.tweens.add({ targets: this.door, scaleX: this.doorScale, duration: (fast ? 90 : 160) * this.speed(), ease: fast ? 'Quad.In' : 'Quad.InOut' });
  }

  // ---------- Entrada ----------
  drag(dx) {
    if (this.state !== 'open' || !this.visitor) return;
    this.visitor.x = DOOR.x + Phaser.Math.Clamp(dx * 0.35, -60, 60); // el visitante se inclina hacia tu dedo
    this.visitor.angle = Phaser.Math.Clamp(dx * 0.02, -5, 5);
  }

  tap(p) {
    const nearBulb = p.keyboard || Phaser.Math.Distance.Between(p.x, p.y, BULB.x, BULB.y) < 110;
    if (!nearBulb || this.state !== 'open' || !this.visitor) return;
    this.visitor.reveal();
    Sfx.play(this, 'tap');
    this.tweens.killTweensOf(this.cone);
    this.cone.setAlpha(1);
    this.tweens.add({ targets: this.cone, alpha: 0, delay: 350, duration: 300 });
    Fx.punch(this, this.bulb, 0.3);
  }

  decide(dir) {
    if (this.state !== 'open' || (dir !== 'left' && dir !== 'right')) return;
    const treat = dir === 'right';
    const v = this.visitor;
    this.state = 'resolving';
    this.hidePatience();
    v.x = DOOR.x; v.angle = 0;

    if (treat && !v.isMonster) this.treatKid(v);
    else if (!treat && v.isMonster) this.slamMonster(v);
    else if (treat && v.isMonster) this.monsterGetsIn(v, 'IT GOT IN!');
    else this.slamKid(v);
  }

  // ---------- Resultados de cada visitante ----------
  treatKid(v) {
    this.hit();
    Sfx.play(this, 'candy');
    Fx.burst(this, v.x, FEET_Y - 160, CONFIG.COLORS.accentHex, 14);
    Fx.popText(this, v.x, DOOR.top + 80, 'TREAT!', CONFIG.COLORS.goodCss, 64);
    const s = this.speed();
    this.tweens.add({ targets: v, y: v.y - 40, duration: 110 * s, yoyo: true, ease: 'Quad.Out' });
    this.tweens.add({ targets: v, x: DOOR.x + 420, delay: 160 * s, duration: 220 * s, ease: 'Quad.In' });
    this.time.delayedCall(260 * s, () => this.closeDoor());
    this.time.delayedCall(420 * s, () => this.done(v));
  }

  slamMonster(v) {
    this.hit();
    this.closeDoor(true);
    const s = this.speed();
    this.time.delayedCall(90 * s, () => {
      Sfx.play(this, 'slam');
      Sfx.play(this, 'growl', { volume: 0.4 });
      Fx.shake(this, 0.012, 140);
      Fx.vibrate(30);
      Fx.burst(this, DOOR.x + DOOR.width / 2 - 20, DOOR.cy, 0xffffff, 10);
      Fx.popText(this, DOOR.x, DOOR.cy, 'BUSTED!', CONFIG.COLORS.goodCss, 80);
    });
    this.time.delayedCall(320 * s, () => this.done(v));
  }

  monsterGetsIn(v, title) {
    this.miss(title, CLUE_HINTS[v.def.clue]);
    Sfx.play(this, 'laugh');
    Fx.flash(this, CONFIG.COLORS.bad, 200);
    Fx.shake(this, 0.03, 300);
    v.setDepth(150);
    this.tweens.add({ targets: v, scale: 1.9, y: v.y + 380, alpha: 0, duration: 420, ease: 'Quad.In' });
    this.time.delayedCall(450, () => this.closeDoor());
    this.time.delayedCall(700, () => this.done(v));
  }

  slamKid(v) {
    this.closeDoor(true);
    this.time.delayedCall(90, () => {
      Sfx.play(this, 'slam');
      Fx.shake(this, 0.012, 140);
      this.time.delayedCall(120, () => Sfx.play(this, 'cry'));
      this.miss('THAT WAS A KID!', 'Only monsters have a clue');
    });
    this.time.delayedCall(700, () => this.done(v));
  }

  timeout() {
    const v = this.visitor;
    this.state = 'resolving';
    this.hidePatience();
    v.x = DOOR.x; v.angle = 0;
    if (v.isMonster) { this.monsterGetsIn(v, 'TOO SLOW!'); return; }
    this.miss('TOO SLOW!', 'The kid got tired of waiting');
    Sfx.play(this, 'cry');
    this.tweens.add({ targets: v, x: DOOR.x - 420, duration: 380, ease: 'Quad.In' });
    this.time.delayedCall(380, () => this.closeDoor());
    this.time.delayedCall(700, () => this.done(v));
  }

  done(v) {
    v.destroy();
    if (this.visitor === v) this.visitor = null;
    this.served++;
    const total = this.total();
    this.splits.push(total);
    this.countText.setText(`${this.served}/${CONFIG.GAME.VISITORS}`);
    Fx.punch(this, this.countText, 0.25);
    this.showDelta(total);
    this.nextVisitor();
  }

  // ---------- Racha y errores ----------
  hit() {
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const level = Math.min(CONFIG.GAME.RUSH_MAX, Math.floor(this.combo / CONFIG.GAME.RUSH_STEP));
    if (level > this.rush) {
      this.rush = level;
      Sfx.play(this, 'rush');
      Fx.popText(this, CONFIG.WIDTH / 2, 260, level === CONFIG.GAME.RUSH_MAX ? 'MAX SUGAR RUSH!' : `SUGAR RUSH x${level}`, CONFIG.COLORS.accent, 54);
      this.updateRush();
    }
  }

  miss(title, hint) {
    const G = CONFIG.GAME;
    this.mistakes++;
    this.penalty += G.PENALTY_MS;
    if (this.rush > 0) Fx.popText(this, CONFIG.WIDTH / 2, 330, 'RUSH LOST', CONFIG.COLORS.muted, 36);
    this.combo = 0;
    this.rush = 0;
    this.updateRush();
    Sfx.play(this, 'bad');
    Fx.vibrate([60, 40, 60]);
    Fx.popText(this, CONFIG.WIDTH / 2, DOOR.cy - 60, title, CONFIG.COLORS.badCss, 76);
    if (hint) {
      const h = this.add.text(CONFIG.WIDTH / 2, DOOR.cy + 40, hint, {
        fontFamily: CONFIG.FONT, fontSize: '36px', fontStyle: 'bold', color: CONFIG.COLORS.text,
        stroke: '#000', strokeThickness: 8, align: 'center', wordWrap: { width: 600 },
      }).setOrigin(0.5).setDepth(200);
      this.tweens.add({ targets: h, alpha: 0, delay: 650, duration: 250, onComplete: () => h.destroy() });
    }
    // "+3s" que vuela al cronómetro
    const p = this.add.text(CONFIG.WIDTH / 2, 230, `+${G.PENALTY_MS / 1000}s`, {
      fontFamily: CONFIG.FONT, fontSize: '56px', fontStyle: 'bold', color: CONFIG.COLORS.badCss, stroke: '#000', strokeThickness: 8,
    }).setOrigin(0.5).setDepth(200);
    this.tweens.add({ targets: p, y: 90, alpha: 0, duration: 600, ease: 'Quad.In', onComplete: () => p.destroy() });
    this.timerText.setColor(CONFIG.COLORS.badCss);
    this.time.delayedCall(500, () => this.timerText.setColor(CONFIG.COLORS.text));
  }

  updateRush() {
    this.rushPips.forEach((pip, i) => pip.setFillStyle(i < this.rush ? CONFIG.COLORS.accentHex : 0x3b2463));
    this.rushText.setColor(this.rush ? CONFIG.COLORS.accent : CONFIG.COLORS.muted);
    Sfx.musicRate(1 + 0.05 * this.rush);
  }

  hidePatience() {
    this.patienceBg.setVisible(false);
    this.patienceBar.setVisible(false);
  }

  showDelta(total) {
    const ref = this.pb && this.pb.splits[this.served - 1];
    if (ref == null) { this.deltaText.setText(''); return; }
    const d = total - ref;
    this.deltaText.setText(`${d <= 0 ? '−' : '+'}${(Math.abs(d) / 1000).toFixed(2)} vs best`);
    this.deltaText.setColor(d <= 0 ? CONFIG.COLORS.goodCss : CONFIG.COLORS.badCss);
  }

  total() { return this.elapsed + this.penalty; }

  // ---------- Fin ----------
  finish() {
    this.state = 'done';
    this.running = false;
    const time = this.total();
    this.timerText.setText(formatTime(time));
    Sfx.play(this, 'go');
    Fx.popText(this, CONFIG.WIDTH / 2, DOOR.cy, 'FINISH!', CONFIG.COLORS.accent, 110);
    this.time.delayedCall(900, () => Fx.goTo(this, 'Results', {
      time, mistakes: this.mistakes, bestCombo: this.bestCombo, splits: this.splits,
    }));
  }

  // ---------- Cada fotograma ----------
  update(_, delta) {
    if (this.running) {
      this.elapsed += delta;
      this.timerText.setText(formatTime(this.total()));
    }

    if (this.state === 'open') {
      this.patienceLeft -= delta;
      const t = Phaser.Math.Clamp(this.patienceLeft / this.patienceTotal, 0, 1);
      this.patienceBar.width = 300 * t;
      this.patienceBar.setFillStyle(t > 0.5 ? CONFIG.COLORS.good : t > 0.25 ? CONFIG.COLORS.accentHex : CONFIG.COLORS.bad);
      if (this.patienceLeft <= 0) this.timeout();
    }

    this.drawSpeedLines(delta);
  }

  // Líneas que salen disparadas desde el centro de la puerta: más cuanto mayor es el Sugar Rush
  drawSpeedLines(delta) {
    const want = this.rush * 7;
    while (this.lineParts.length < want) {
      this.lineParts.push({ a: Math.random() * Math.PI * 2, d: 300 + Math.random() * 400, v: 0.6 + Math.random() * 0.8 });
    }
    if (this.lineParts.length > want) this.lineParts.length = want;
    const g = this.lines;
    g.clear();
    if (!want) return;
    g.lineStyle(4, 0xffffff, 0.12 + this.rush * 0.05);
    for (const p of this.lineParts) {
      p.d += p.v * delta * (0.6 + this.rush * 0.15);
      if (p.d > 760) { p.d = 300; p.a = Math.random() * Math.PI * 2; }
      const x1 = DOOR.x + Math.cos(p.a) * p.d, y1 = DOOR.cy + Math.sin(p.a) * p.d * 1.3;
      const x2 = DOOR.x + Math.cos(p.a) * (p.d + 90), y2 = DOOR.cy + Math.sin(p.a) * (p.d + 90) * 1.3;
      g.lineBetween(x1, y1, x2, y2);
    }
  }
}
