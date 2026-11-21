export async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(salt + ':' + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function randomSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUM = '0123456789';
const SYM = '!@#$%^&*()-_=+[]{};:,.?/';
const AMBIG = /[Il1O0o]/g;

export interface GenOpts {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

export function generatePassword(o: GenOpts) {
  const sets = [o.lower && LOWER, o.upper && UPPER, o.numbers && NUM, o.symbols && SYM]
    .filter(Boolean)
    .map((s) => (o.avoidAmbiguous ? (s as string).replace(AMBIG, '') : (s as string)));
  if (!sets.length) return '';
  const all = sets.join('');
  const rnd = (n: number) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
  const chars = sets.map((s) => s[rnd(s.length)]);
  while (chars.length < o.length) chars.push(all[rnd(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, o.length).join('');
}

export function strength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: 'Tiada' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (pw.length >= 16) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const score = Math.min(4, Math.floor((s * 4) / 6));
  return { score, label: ['Sangat Lemah', 'Lemah', 'Sederhana', 'Kuat', 'Sangat Kuat'][score] };
}

function base32Decode(input: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (const c of clean) bits += alphabet.indexOf(c).toString(2).padStart(5, '0');
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  return bytes;
}

export async function totpCode(secret: string) {
  const keyBytes = base32Decode(secret);
  if (!keyBytes.length) return '';
  const counter = Math.floor(Date.now() / 30000);
  const msg = new ArrayBuffer(8);
  new DataView(msg).setUint32(4, counter);
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const h = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg));
  const off = h[h.length - 1] & 0xf;
  const code = (((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3]) % 1_000_000;
  return code.toString().padStart(6, '0');
}
