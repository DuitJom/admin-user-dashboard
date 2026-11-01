import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, IdCard, KeyRound, Loader2, Search } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import { verifyMerchant } from 'zitejs/api';
import MerchantCard from './MerchantCard';
import { LiveCheck } from './icons';

type Phase = 'id' | 'company' | 'passkey';

const ID_ERROR = 'Please enter a valid Merchant ID to continue.';
const KEY_ERROR = 'The passkey you entered is incorrect.';

function ErrorBox({ message }: { message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" /> {message}
    </motion.div>
  );
}

export default function LoginStepOne({ onContinue }: { onContinue: (merchantId: string, passkey: string) => void }) {
  const [merchantId, setMerchantId] = useState('');
  const [passkey, setPasskey] = useState('');
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('id');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState('');

  // Step 1: verify Merchant ID only, show 7s spinner, then reveal company record.
  const find = async () => {
    setLoading(true);
    setError('');
    try {
      const [res] = await Promise.all([
        verifyMerchant({ merchantId }),
        new Promise((r) => setTimeout(r, 7000)),
      ]);
      if (!res.valid) { setError(ID_ERROR); return; }
      setToast(true);
      setTimeout(() => setToast(false), 2000);
      setPhase('company');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: after the passkey field appears, verify id + passkey together.
  const verifyKey = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await verifyMerchant({ merchantId, passkey });
      if (!res.valid) { setError(KEY_ERROR); return; }
      onContinue(merchantId, passkey);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setMerchantId(''); setPasskey(''); setPhase('id'); setError(''); };
  const canFind = merchantId.trim().length > 0 && !loading;
  const canVerify = passkey.length > 0 && !loading;

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-6 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border bg-white p-3 shadow-sm">
          <img src="https://moneylinecredit.my/wp-content/uploads/2021/09/logo_mlc_512_red.png" alt="Merchant logo" className="h-full w-full object-contain" />
        </div>
        <p className="text-base font-semibold leading-relaxed text-primary">Identify background records, customer information and customer history in Salesforce.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="merchant-id">MERCHANT ID*</Label>
          <div className="flex h-12 items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-3 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <IdCard className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
            <Input id="merchant-id" value={merchantId} onChange={(e) => { setMerchantId(e.target.value); setError(''); }} disabled={loading || phase !== 'id'}
              onKeyDown={(e) => e.key === 'Enter' && canFind && find()}
              className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 font-mono text-slate-900 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" aria-invalid={!!error} />
          </div>
        </div>

        {/* Passkey only appears once the merchant has pressed "Teruskan" on the company record */}
        <AnimatePresence>
          {phase === 'passkey' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
              <Label htmlFor="merchant-passkey">PASSKEY*</Label>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-3 shadow-sm focus-within:ring-2 focus-within:ring-ring">
                <KeyRound className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
                <input id="merchant-passkey" autoFocus type={show ? 'text' : 'password'} value={passkey} disabled={loading}
                  onChange={(e) => { setPasskey(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && canVerify && verifyKey()}
                  className="h-full min-w-0 flex-1 bg-transparent font-mono text-slate-900 outline-none" />
                <button type="button" onClick={() => setShow(!show)} className="shrink-0 text-gray-500 hover:text-gray-700" aria-label="Show/Hide">
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{error && <ErrorBox message={error} />}</AnimatePresence>

        {phase === 'id' && (
          <Button onClick={find} disabled={!canFind} className="h-12 w-full rounded-xl bg-green-600 text-base font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching merchant...</> : <><Search className="mr-2 h-4 w-4" /> Find</>}
          </Button>
        )}

        {phase === 'passkey' && (
          <Button onClick={verifyKey} disabled={!canVerify} className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : <><ArrowRight className="mr-2 h-4 w-4" /> Teruskan</>}
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

      {/* Company record shown after the spinner; pressing Teruskan reveals the passkey field */}
      {phase === 'company' && (
        <MerchantCard onBack={reset} onContinue={() => { setPhase('passkey'); }} continueLabel="Teruskan" />
      )}
    </div>
  );
}
