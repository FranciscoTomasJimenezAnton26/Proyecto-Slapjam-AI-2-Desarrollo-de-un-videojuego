// Récord personal (PB, "personal best") guardado en el navegador, con los tiempos parciales
// de cada visitante para mostrar en directo si vas por delante o por detrás.
const Records = {
  load() {
    try {
      const pb = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY + '-pb'));
      if (pb && typeof pb.time === 'number' && Array.isArray(pb.splits)) return pb;
    } catch (e) {}
    return null;
  },

  // Guarda si es mejor que el actual. Devuelve true si es nuevo récord.
  submit(time, splits) {
    const pb = this.load();
    if (pb && pb.time <= time) return false;
    try { localStorage.setItem(CONFIG.STORAGE_KEY + '-pb', JSON.stringify({ time, splits })); } catch (e) {}
    return true;
  },

  rankFor(time) {
    return CONFIG.GAME.RANKS.find((r) => time <= r.max);
  },

  // Siguiente rango mejor y cuánto falta para alcanzarlo
  nextRank(time) {
    const ranks = CONFIG.GAME.RANKS;
    const i = ranks.findIndex((r) => time <= r.max);
    if (i <= 0) return null;
    const better = ranks[i - 1];
    return { ...better, missing: time - better.max };
  },
};

// 83456 → "1:23.45"   ·   9120 → "0:09.12"
function formatTime(ms) {
  ms = Math.max(0, Math.round(ms));
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}
