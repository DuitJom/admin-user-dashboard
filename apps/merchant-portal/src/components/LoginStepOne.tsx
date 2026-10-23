import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Loader2, Search } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import { verifyMerchant } from 'zitejs/api';
import MerchantCard from './MerchantCard';
import { LiveCheck } from './icons';

const ERROR = 'Please enter a valid Merchant ID to continue.';

export default function LoginStepOne({ onContinue }: { onContinue: (merchantId: string, passkey: string) => void }) {
  const [merchantId, setMerchantId] = useState('');
  const [passkey, setPasskey] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [found, setFound] = useState(false);
  const [error, setError] = useState('');

  const canFind = merchantId.trim().length > 0 && passkey.length > 0 && !loading;

  const find = async () => {
    setLoading(true);
    setFound(false);
    setError('');
    try {
      const [res] = await Promise.all([
        verifyMerchant({ merchantId, passkey }),
        new Promise((r) => setTimeout(r, 7000)),
      ]);
      if (!res.valid) { setError(ERROR); return; }
      setToast(true);
      setFound(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setMerchantId(''); setPasskey(''); setFound(false); setError(''); };

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">Please enter your Merchant ID &amp; Passkey below:</p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>MERCHANT ID*</Label>
          <Input value={merchantId} onChange={(e) => { setMerchantId(e.target.value); setError(''); }} disabled={loading || found}
            className="h-12 rounded-xl font-mono" aria-invalid={!!error} />
        </div>
        <div className="space-y-1.5">
          <Label>PASSKEY*</Label>
          <div className="flex h-12 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <input type={show ? 'text' : 'password'} value={passkey} disabled={loading || found}
              onChange={(e) => { setPasskey(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && canFind && find()}
              className="h-full flex-1 bg-transparent font-mono outline-none" />
            <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground" aria-label="Show/Hide">
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {!found && (
          <Button onClick={find} disabled={!canFind} className="h-12 w-full rounded-xl bg-green-600 text-base font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching merchant...</> : <><Search className="mr-2 h-4 w-4" /> Find</>}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="flex items-center gap-3 rounded-2xl bg-card px-6 py-4 text-base font-semibold shadow-xl">
              <LiveCheck /> 1 Rekod ditemui
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {found && <MerchantCard onBack={reset} onContinue={() => onContinue(merchantId, passkey)} />}
    </div>
  );
}
