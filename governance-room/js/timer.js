export const fmt = (s) => {
  s = Math.max(0, Math.floor(s));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

// Countdown display. getElapsed() returns seconds used (null before the game
// starts); freeze() pins the display at the final time on escape.
export function createTimer(el, timeLimitSeconds, getElapsed) {
  let frozen = null;
  function tick() {
    const used = frozen ?? getElapsed();
    if (used == null) {
      el.textContent = fmt(timeLimitSeconds);
      el.classList.remove('warn');
      return;
    }
    const left = Math.max(0, timeLimitSeconds - used);
    el.textContent = fmt(left);
    el.classList.toggle('warn', left < 600);
  }
  setInterval(tick, 500);
  tick();
  return {
    freeze(totalUsed) {
      frozen = totalUsed;
      tick();
    },
  };
}
