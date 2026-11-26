import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';
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
        <div className="relative mx-auto w-fit">
          <motion.img
            src="https://images.fillout.com/902182/bjyskbubf9/generated-images/vMAaL5zGPbaRb4imNoRF4s/img_lPJn_nKKLbn5GAMH.jpg"
            alt="Sad Salesforce mascot"
            animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto h-44 w-44 rounded-full object-cover ring-8 ring-sky-50"
          />
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="absolute -right-10 top-2 rounded-2xl rounded-bl-none bg-sky-600 px-3 py-1.5 text-sm font-extrabold text-white shadow-lg">
            Hmmm!
          </motion.div>
        </div>
        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-left text-sm leading-6 text-slate-700">
          <p className="font-semibold text-slate-900">Dear valued merchant,</p>
          <p className="mt-1">
            We sincerely apologize — our system is currently being upgraded to improve Salesforce&apos;s internal quality.
            Please try again shortly or contact us at{' '}
            <a href="mailto:general@account.salesforce.com" className="font-semibold text-sky-700 hover:underline">general@account.salesforce.com</a>.
          </p>
        </div>

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
