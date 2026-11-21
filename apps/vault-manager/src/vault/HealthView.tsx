import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Repeat, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { useVault } from '../lib/store';
import { strength } from '../lib/crypto';
import { VaultItem } from '../lib/types';

const OLD = 180 * 86400e3;

export default function HealthView({ onFix }: { onFix: (i: VaultItem) => void }) {
  const { items } = useVault();
  const logins = items.filter((i) => !i.deleted && i.type === 'login' && i.password);
  const counts = new Map<string, number>();
  logins.forEach((i) => counts.set(i.password, (counts.get(i.password) ?? 0) + 1));
  const weak = logins.filter((i) => strength(i.password).score < 2);
  const reused = logins.filter((i) => (counts.get(i.password) ?? 0) > 1);
  const old = logins.filter((i) => Date.now() - i.updatedAt > OLD);
  const bad = new Set([...weak, ...reused, ...old].map((i) => i.id));
  const score = logins.length ? Math.round(((logins.length - bad.size) / logins.length) * 100) : 100;
  const C = 2 * Math.PI * 54;

  const issues = [
    ...weak.map((i) => ({ i, why: 'Kata laluan lemah', Icon: AlertTriangle })),
    ...reused.map((i) => ({ i, why: 'Kata laluan diguna semula', Icon: Repeat })),
    ...old.map((i) => ({ i, why: 'Tidak dikemas kini lebih 6 bulan', Icon: Clock })),
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Kesihatan Vault</h1>
      <div className="grid gap-4 rounded-xl border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="relative mx-auto h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <motion.circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - score / 100) }} transition={{ duration: 1.2 }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-3xl font-bold">{score}</div><div className="text-xs text-muted-foreground">/ 100</div></div></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['Lemah', weak.length], ['Diguna semula', reused.length], ['Lama', old.length]].map(([l, n]) => (
            <div key={l} className="rounded-lg border bg-black p-4"><div className="text-2xl font-semibold">{n}</div><div className="text-xs text-muted-foreground">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground"><ShieldCheck className="h-8 w-8" strokeWidth={1.5} />Tiada masalah ditemui</div>
        ) : issues.map(({ i, why, Icon }) => (
          <div key={i.id + why} className="flex items-center gap-3 border-b px-4 py-3 last:border-0">
            <Icon className="h-4 w-4 text-yellow-400" />
            <div className="flex-1"><div className="font-medium">{i.name}</div><div className="text-xs text-muted-foreground">{why}</div></div>
            <Button size="sm" variant="outline" onClick={() => onFix(i)}><Wrench className="mr-1.5 h-4 w-4" />Baiki</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
