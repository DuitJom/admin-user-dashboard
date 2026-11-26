import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogOut, RefreshCw, ServerCog } from 'lucide-react';
import { checkDashboardAvailability } from 'zitejs/api';
import { Button } from '@project/components/ui/button';

export default function TemporaryError({ onLogout }: { onLogout: () => void }) {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  const retry = async () => {
    if (checking) return;
    setChecking(true);
    setMessage('');
    try {
      const result = await checkDashboardAvailability({});
      if (result.available) { onLogout(); return; }
      setMessage('The dashboard is still being updated. Please try again later.');
    } catch {
      setMessage('Unable to check availability. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-[#0a1733] via-[#0b1c3f] to-[#060f24] px-4 py-12">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9">
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 ring-8 ring-amber-50/60">
          <ServerCog className="h-10 w-10" aria-hidden="true" />
        </motion.div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          Temporary service interruption
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Your dashboard is temporarily unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          We&apos;re currently updating your dashboard to deliver a better and more reliable experience. Please try again later.
        </p>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-left">
          <span className="text-sm font-semibold text-slate-700">Dashboard Service</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Temporarily Unavailable
          </span>
        </div>

        <div role="status" aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm text-slate-500">
          {message && <p>{message}</p>}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button variant="outline" disabled={checking} onClick={onLogout} className="h-12 rounded-xl">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
          <Button onClick={retry} disabled={checking} className="h-12 rounded-xl">
            {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            {checking ? 'Checking...' : 'Retry'}
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
