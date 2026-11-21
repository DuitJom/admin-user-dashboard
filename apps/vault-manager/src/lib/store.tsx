import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityLog, Profile, SendItem, VaultData, VaultItem } from './types';
import { seedItems } from './seed';

interface Ctx extends VaultData {
  locked: boolean;
  setLocked: (v: boolean) => void;
  saveItem: (item: VaultItem) => void;
  patchItem: (id: string, patch: Partial<VaultItem>) => void;
  removeItem: (id: string) => void;
  setProfile: (p: Profile) => void;
  addSend: (s: SendItem) => void;
  removeSend: (id: string) => void;
  log: (text: string) => void;
  replaceAll: (d: Partial<VaultData>) => void;
  wipe: () => void;
}

const VaultCtx = createContext<Ctx | null>(null);

const load = (key: string): VaultData => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted storage falls through to fresh data */
  }
  return { items: seedItems(), sends: [], profile: null, logs: [] };
};

export function VaultProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const key = `blackvault:${userId}`;
  const [data, setData] = useState<VaultData>(() => load(key));
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  const log = useCallback((text: string) => {
    const entry: ActivityLog = { id: crypto.randomUUID(), at: Date.now(), text };
    setData((d) => ({ ...d, logs: [entry, ...d.logs].slice(0, 200) }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...data,
      locked,
      setLocked,
      log,
      saveItem: (item) =>
        setData((d) => {
          const exists = d.items.some((i) => i.id === item.id);
          const next = { ...item, updatedAt: Date.now() };
          return { ...d, items: exists ? d.items.map((i) => (i.id === item.id ? next : i)) : [next, ...d.items] };
        }),
      patchItem: (id, patch) =>
        setData((d) => ({ ...d, items: d.items.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: Date.now() } : i)) })),
      removeItem: (id) => setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) })),
      setProfile: (p) => setData((d) => ({ ...d, profile: p })),
      addSend: (s) => setData((d) => ({ ...d, sends: [s, ...d.sends] })),
      removeSend: (id) => setData((d) => ({ ...d, sends: d.sends.filter((s) => s.id !== id) })),
      replaceAll: (p) => setData((d) => ({ ...d, ...p })),
      wipe: () => {
        localStorage.removeItem(key);
        setData({ items: [], sends: [], profile: null, logs: [] });
        setLocked(true);
      },
    }),
    [data, locked, log, key],
  );

  return <VaultCtx.Provider value={value}>{children}</VaultCtx.Provider>;
}

export function useVault() {
  const c = useContext(VaultCtx);
  if (!c) throw new Error('useVault outside provider');
  return c;
}
