// Game state, persisted to localStorage on every mutation so a refresh
// mid-game restores the room, timer, hints, and attempts. The timer survives
// refresh because it is derived from the wall-clock startAt, not an interval.
const KEY = 'governanceRoom.state.v1';

export function newTeamId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function defaultState(roomCount) {
  return {
    v: 1,
    teamId: null,
    team: null,
    started: false,
    startAt: 0,
    penalty: 0,
    room: 0,
    attempts: 0,
    hintsUsed: Array(roomCount).fill(0),
    done: false,
    finishedAt: 0,
  };
}

// Tampered or stale state degrades to a fresh game, never a crash. The stored
// room index is the only authority on progress — URL params can't skip ahead.
export function loadState(roomCount) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState(roomCount);
    const s = { ...defaultState(roomCount), ...JSON.parse(raw) };
    if (s.v !== 1 || typeof s.room !== 'number' || (s.started && !s.teamId)) {
      return defaultState(roomCount);
    }
    s.room = Math.max(0, Math.min(roomCount - 1, Math.floor(s.room)));
    if (!Array.isArray(s.hintsUsed) || s.hintsUsed.length !== roomCount) {
      s.hintsUsed = Array(roomCount).fill(0);
    }
    s.hintsUsed = s.hintsUsed.map((h) => Math.max(0, Math.min(2, h | 0)));
    s.penalty = Math.max(0, s.penalty | 0);
    s.attempts = Math.max(0, s.attempts | 0);
    return s;
  } catch {
    return defaultState(roomCount);
  }
}

export function saveState(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearState() {
  localStorage.removeItem(KEY);
}

// Total seconds on the clock, hint penalties included.
export function elapsedSeconds(s, now = Date.now()) {
  const end = s.done ? s.finishedAt : now;
  return Math.max(0, Math.floor((end - s.startAt) / 1000)) + s.penalty;
}
