import { motion } from 'framer-motion';
import { useVault } from '../lib/store';
import { VaultItem } from '../lib/types';
import { fmtDate } from '../lib/utils';
import { strength } from '../lib/crypto';

export default function DashboardView({ onOpen }: { onOpen: (i: VaultItem) => void }) {
  const { items, sends, profile } = useVault();
  const live = items.filter((i) => !i.deleted);
  const stats = [
    ['Jumlah item', live.length], ['Kegemaran', live.filter((i) => i.favorite).length],
    ['Kata laluan lemah', live.filter((i) => i.type === 'login' && i.password && strength(i.password).score < 2).length],
    ['Send aktif', sends.filter((s) => s.expiresAt > Date.now() && s.views < s.maxViews).length],
  ];
  const recent = [...live].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Selamat kembali, {profile?.displayName}</h1>
        <p className="text-sm text-muted-foreground">Ringkasan vault anda</p></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, n], i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl border bg-card p-5"><div className="text-3xl font-semibold">{n}</div><div className="text-sm text-muted-foreground">{l}</div></motion.div>
        ))}
      </div>
      <div className="rounded-xl border bg-card">
        <div className="border-b px-5 py-3 text-sm font-medium">Dikemas kini baru-baru ini</div>
        {recent.map((i) => (
          <button key={i.id} onClick={() => onOpen(i)} className="flex w-full items-center justify-between border-b px-5 py-3 text-left text-sm last:border-0 hover:bg-white/[0.03]">
            <span>{i.name}</span><span className="text-muted-foreground">{fmtDate(i.updatedAt)}</span></button>
        ))}
      </div>
    </div>
  );
}
