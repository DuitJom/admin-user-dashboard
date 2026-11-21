import { motion } from 'framer-motion';
import { loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import Logo from '../Logo';
import { Lang, T } from '../../lib/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <motion.div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <motion.h3 initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="shine-text text-3xl font-bold tracking-tight sm:text-5xl">{t.ready}</motion.h3>
        <Button size="lg" className="mt-8 h-12 px-8" onClick={() => loginWithRedirect({ redirectUrl: '/vault' })}>{t.cta}</Button>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 px-4 py-8 text-sm text-zinc-500 sm:flex-row">
        <Logo />
        <div className="flex gap-6">
          <a href="#features" className="hover:text-white">{t.features}</a>
          <a href="#faq" className="hover:text-white">{t.faq}</a>
        </div>
        <span>© {new Date().getFullYear()} BlackVault. {t.rights}</span>
      </div>
    </footer>
  );
}
