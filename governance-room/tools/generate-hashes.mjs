#!/usr/bin/env node
// Facilitator tool: turns rooms.source.json (which holds codePlaintext) into
// the deployable rooms.json (SHA-256 hashes only, plaintext stripped).
//
// Usage:
//   node tools/generate-hashes.mjs                       # config/rooms.source.json -> config/rooms.json
//   node tools/generate-hashes.mjs <source> <out>        # explicit paths
//   node tools/generate-hashes.mjs --code "4Migrate"     # print the hash for a single code
//
// Codes are normalized before hashing exactly like the game normalizes input:
// strip all whitespace, uppercase.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const normalize = (s) => String(s).replace(/\s+/g, '').toUpperCase();
const hash = (s) => createHash('sha256').update(normalize(s)).digest('hex');

const args = process.argv.slice(2);

if (args[0] === '--code') {
  if (!args[1]) {
    console.error('Usage: node tools/generate-hashes.mjs --code "YourCode"');
    process.exit(1);
  }
  console.log(`code: ${normalize(args[1])}`);
  console.log(`hash: ${hash(args[1])}`);
  process.exit(0);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const srcPath = args[0] ?? path.join(here, '..', 'config', 'rooms.source.json');
const outPath = args[1] ?? path.join(here, '..', 'config', 'rooms.json');

const cfg = JSON.parse(readFileSync(srcPath, 'utf8'));
if (!Array.isArray(cfg.rooms) || cfg.rooms.length === 0) {
  console.error('✗ Source file has no rooms[].');
  process.exit(1);
}

let warnings = 0;
for (const [i, room] of cfg.rooms.entries()) {
  const n = i + 1;
  if (!room.codePlaintext) {
    console.error(`✗ Room ${n} ("${room.title ?? room.id}"): missing codePlaintext — cannot hash.`);
    process.exit(1);
  }
  room.codeHash = hash(room.codePlaintext);
  const needle = normalize(room.codePlaintext);
  for (const [j, text] of (room.hints ?? []).entries()) {
    if (normalize(text).includes(needle)) {
      console.warn(`⚠ Room ${n}, hint ${j + 1} contains the unlock code — players can read it in view-source. Reword it.`);
      warnings++;
    }
  }
  for (const [j, text] of (room.labSteps ?? []).entries()) {
    if (normalize(text).includes(needle)) {
      console.warn(`⚠ Room ${n}, lab step ${j + 1} contains the unlock code. Reword it.`);
      warnings++;
    }
  }
  console.log(`✓ Room ${n} "${room.title ?? room.id}" — ${normalize(room.codePlaintext)} → ${room.codeHash.slice(0, 12)}…`);
  delete room.codePlaintext;
}

writeFileSync(outPath, JSON.stringify(cfg, null, 2) + '\n');
console.log(`\nWrote ${path.relative(process.cwd(), outPath)}${warnings ? ` with ${warnings} warning(s)` : ''}. codePlaintext stripped.`);
