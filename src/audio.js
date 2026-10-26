// Sonido del juego.
// - Sfx.play(scene, 'nombre'): si hay un archivo cargado con esa clave en BootScene, lo reproduce;
//   si no, usa un sonido provisional generado por código. Así el juego suena desde el principio
//   y vamos sustituyendo sonidos sin tocar el resto del código.
// - Sfx.music(scene, 'clave'): música en bucle (solo una pista a la vez).
// - El silencio se recuerda entre partidas.
const Sfx = (() => {
  let ctx = null;
  let muted = false;
  let currentMusic = null;

  try { muted = localStorage.getItem(CONFIG.STORAGE_KEY + '-muted') === '1'; } catch (e) {}

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

  // Sonidos provisionales: se usan mientras no exista un archivo con la misma clave
  const synth = {
    tap()    { tone(660, 0.06, 'square', 0.08); },
    good()   { tone(520, 0.08, 'triangle', 0.15); setTimeout(() => tone(780, 0.1, 'triangle', 0.15), 70); },
    bad()    { tone(180, 0.25, 'sawtooth', 0.15, 70); },
    whoosh() { tone(900, 0.15, 'sine', 0.08, 200); },
  };

  function play(scene, key, config = {}) {
    if (muted) return;
    if (scene && scene.cache.audio.exists(key)) {
      // Pequeña variación de tono para que los sonidos repetidos no cansen
      scene.sound.play(key, { volume: 0.8, detune: Phaser.Math.Between(-80, 80), ...config });
    } else if (synth[key]) {
      synth[key]();
    }
  }

  function music(scene, key, volume = 0.5) {
    if (!scene.cache.audio.exists(key)) return;
    if (currentMusic && currentMusic.key === key && currentMusic.isPlaying) return;
    if (currentMusic) currentMusic.stop();
    currentMusic = scene.sound.add(key, { loop: true, volume });
    currentMusic.play();
    scene.sound.mute = muted;
  }

  function setMuted(scene, value) {
    muted = value;
    if (scene) scene.sound.mute = muted;
    try { localStorage.setItem(CONFIG.STORAGE_KEY + '-muted', muted ? '1' : '0'); } catch (e) {}
    return muted;
  }

  return {
    unlock,
    play,
    music,
    isMuted: () => muted,
    toggleMute: (scene) => setMuted(scene, !muted),
    applyMute: (scene) => { scene.sound.mute = muted; },
  };
})();
