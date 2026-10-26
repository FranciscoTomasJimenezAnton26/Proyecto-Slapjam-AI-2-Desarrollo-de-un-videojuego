// Sonidos provisionales generados por código (WebAudio), para no depender de archivos.
// Durante la jam los sustituiremos por sonidos reales cargados en BootScene.
const Sfx = (() => {
  let ctx = null;
  let muted = false;

  // Los navegadores móviles bloquean el audio hasta el primer toque: llama a unlock() en ese momento.
  function unlock() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* sin audio: el juego sigue funcionando */ }
  }

  function tone(freq, duration = 0.12, type = 'square', volume = 0.15, slideTo = null) {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  return {
    unlock,
    toggleMute() { muted = !muted; return muted; },
    isMuted() { return muted; },
    // Sonidos de ejemplo
    tap()  { tone(660, 0.06, 'square', 0.08); },
    good() { tone(520, 0.08, 'triangle', 0.15); setTimeout(() => tone(780, 0.1, 'triangle', 0.15), 70); },
    bad()  { tone(180, 0.25, 'sawtooth', 0.15, 70); },
    whoosh() { tone(900, 0.15, 'sine', 0.08, 200); },
  };
})();
