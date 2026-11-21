import { toast } from 'sonner';
import { ItemType, VaultItem } from './types';

export async function copy(text: string, label = 'Disalin') {
  if (!text) return toast.error('Tiada nilai untuk disalin');
  await navigator.clipboard.writeText(text);
  toast.success(label);
}

export type Filter =
  | { kind: 'all' }
  | { kind: 'fav' }
  | { kind: 'trash' }
  | { kind: 'shared' }
  | { kind: 'folder'; folder: string }
  | { kind: 'type'; type: ItemType };

export type View =
  | { kind: 'items'; filter: Filter }
  | { kind: 'generator' }
  | { kind: 'send' }
  | { kind: 'health' }
  | { kind: 'settings' };

export function matchFilter(i: VaultItem, f: Filter) {
  if (f.kind === 'trash') return i.deleted;
  if (i.deleted) return false;
  if (f.kind === 'fav') return i.favorite;
  if (f.kind === 'shared') return i.shared;
  if (f.kind === 'folder') return i.folder === f.folder;
  if (f.kind === 'type') return i.type === f.type;
  return true;
}

export function matchSearch(i: VaultItem, q: string) {
  if (!q) return true;
  const s = q.toLowerCase();
  return [i.name, i.username, i.url, i.notes, i.password, i.cardHolder, i.fullName]
    .some((v) => v.toLowerCase().includes(s));
}

export function subtitle(i: VaultItem) {
  if (i.type === 'login') return i.username || i.url;
  if (i.type === 'card') return i.cardNumber ? `•••• ${i.cardNumber.slice(-4)}` : i.cardHolder;
  if (i.type === 'identity') return i.fullName;
  return i.notes.split('\n')[0];
}

export const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
