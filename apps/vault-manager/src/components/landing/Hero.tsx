import { motion } from 'framer-motion';
import { ArrowRight, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import MotionBackground from './MotionBackground';
import { Lang, T } from '../../lib/i18n';

const login = () => loginWithRedirect({ redirectUrl: '/vault' });

export default function Hero({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <MotionBackground />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="shine-border mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300">
          <ShieldCheck className="h-3.5 w-3.5" /> {t.badge}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
          className="text-5xl font-bold leading-[1.05] tracking-tighter sm:text-7xl">
          <span className="block">{t.title1}</span>
          <span className="shine-text block">{t.title2}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">{t.sub}</motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="group h-12 px-7" onClick={login}>
            {t.cta} <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 border-white/15 bg-black/40 px-7" onClick={login}>{t.cta2}</Button>
        </motion.div>
        <p className="mt-5 text-xs text-zinc-500">{t.methods}</p>
        <VaultPreview />
      </div>
    </section>
  );
}

function VaultPreview() {
  const rows = ['Gmail', 'Maybank2u', 'Netflix', 'GitHub'];
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
      className="shine-border mx-auto mt-16 max-w-2xl rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-left shadow-2xl backdrop-blur">
      {rows.map((r, i) => (
        <motion.div key={r} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.12 }}
          className="flex items-center justify-between border-b border-white/5 px-2 py-3 last:border-0">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-white/10"><KeyRound className="h-4 w-4" /></div>
            <span className="text-sm">{r}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500"><Lock className="h-3.5 w-3.5" /> ••••••••••</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
