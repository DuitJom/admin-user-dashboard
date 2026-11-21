import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ChevronDown, Clock, KeyRound, LayoutGrid, Send, Timer } from 'lucide-react';
import { Lang, T } from '../../lib/i18n';

const icons = [LayoutGrid, KeyRound, Activity, Send, Timer, Clock];

export function Features({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-28">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mb-14 text-center text-3xl font-bold tracking-tight sm:text-5xl">{t.featTitle}</motion.h2>
      <div id="security" className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {t.feats.map(([title, desc], i) => {
          const Icon = icons[i];
          return (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }} whileHover={{ backgroundColor: 'rgba(24,24,27,1)' }}
              className="group bg-black p-8">
              <Icon className="mb-5 h-6 w-6 text-zinc-300 transition group-hover:scale-110 group-hover:text-white" strokeWidth={1.5} />
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function Faq({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">{t.faq}</h2>
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-zinc-950/60">
        {t.faqs.map(([q, a], i) => (
          <motion.div key={q} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <button className="flex w-full items-center justify-between px-6 py-5 text-left font-medium" onClick={() => setOpen(open === i ? null : i)}>
              {q}
              <motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown className="h-4 w-4 text-zinc-400" /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-zinc-400">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
