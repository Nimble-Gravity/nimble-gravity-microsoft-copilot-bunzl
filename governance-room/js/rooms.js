// Loads and validates the room config. All game content is data-driven from
// this file — components never hardcode room text.
export async function loadRooms(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load room config (${res.status}) from ${url}`);
  const cfg = await res.json();

  if (!Array.isArray(cfg.rooms) || cfg.rooms.length === 0) {
    throw new Error('Room config has no rooms[].');
  }
  cfg.rooms.forEach((r, i) => {
    for (const k of ['id', 'title', 'narrative', 'codeHash']) {
      if (!r[k]) throw new Error(`Room ${i + 1}: missing "${k}".`);
    }
    if (!/^[0-9a-f]{64}$/i.test(r.codeHash)) {
      throw new Error(
        `Room ${i + 1}: codeHash is not a SHA-256 digest — run tools/generate-hashes.mjs.`
      );
    }
    r.labSteps = Array.isArray(r.labSteps) ? r.labSteps : [];
    r.hints = (Array.isArray(r.hints) ? r.hints : []).slice(0, 2);
    r.skillsTaught = Array.isArray(r.skillsTaught) ? r.skillsTaught : [];
  });

  cfg.timeLimitMinutes = cfg.timeLimitMinutes || 60;
  cfg.hintPenaltySeconds = cfg.hintPenaltySeconds ?? 120;
  return cfg;
}
