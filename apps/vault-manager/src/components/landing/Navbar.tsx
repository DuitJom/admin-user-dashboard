import { useState } from 'react';
import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { loginWithRedirect } from 'zitejs/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@project/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@project/components/ui/dropdown-menu';
import Logo from '../Logo';
import { Lang, T } from '../../lib/i18n';

const login = () => loginWithRedirect({ redirectUrl: '/vault' });

export default function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const t = T[lang];
  const links = [['#features', t.features], ['#security', t.security], ['#faq', t.faq]];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
            <a href="#top"><Logo /></a>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            {links.map(([h, l]) => <a key={h} href={h} className="transition hover:text-white">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-zinc-300">
                  <Globe className="h-4 w-4" /> {lang.toUpperCase()} <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {([['ms', 'Bahasa Melayu'], ['en', 'English']] as const).map(([k, l]) => (
                  <DropdownMenuItem key={k} onClick={() => setLang(k)} className="justify-between gap-6">
                    {l} {lang === k && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={login}>{t.signIn}</Button>
            <Button size="sm" onClick={login}>{t.signUp}</Button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-zinc-950 p-5"
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 26 }}>
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-5 w-5" /></Button>
              </div>
              {links.map(([h, l], i) => (
                <motion.a key={h} href={h} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}
                  className="rounded-md px-3 py-2.5 text-zinc-300 hover:bg-white/5 hover:text-white">{l}</motion.a>
              ))}
              <div className="mt-auto grid gap-2">
                <Button variant="outline" onClick={login}>{t.signIn}</Button>
                <Button onClick={login}>{t.signUp}</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
