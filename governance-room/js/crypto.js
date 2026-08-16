// Code validation: unlock codes are never shipped in plaintext — the config
// holds SHA-256 digests and input is hashed client-side before comparison.
// Normalization must match tools/generate-hashes.mjs exactly.
export function normalizeCode(raw) {
  return String(raw).replace(/\s+/g, '').toUpperCase();
}

// Requires a secure context (https:// or http://localhost) for crypto.subtle.
export async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
