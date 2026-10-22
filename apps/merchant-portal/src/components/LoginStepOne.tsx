import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import CodeBoxes from './CodeBoxes';
import MerchantCard from './MerchantCard';
import { LiveCheck } from './icons';

export default function LoginStepOne({ onContinue }: { onContinue: (merchantId: string, passkey: string) => void }) {
  const [merchantId, setMerchantId] = useState('');
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [found, setFound] = useState(false);

  const canFind = merchantId.trim().length > 0 && passkey.length === 6 && !loading;

  const find = () => {
    setLoading(true);
    setFound(false);
    setTimeout(() => {
      setLoading(false);
      setToast(true);
      setFound(true);
      setTimeout(() => setToast(false), 2000);
    }, 7000);
  };

  const reset = () => { setMerchantId(''); setPasskey(''); setFound(false); };

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">Sila masukkan Merchant ID &amp; Pass Key di ruang yang telah disediakan di bawah:</p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>MERCHANT ID*</Label>
          <Input value={merchantId} onChange={(e) => setMerchantId(e.target.value)} placeholder="e.g. GTMSB100027-P" disabled={loading} />
        </div>
        <div className="space-y-1.5">
          <Label>PASSKEYS*</Label>
          <CodeBoxes value={passkey} onChange={setPasskey} masked />
        </div>
        <Button onClick={find} disabled={!canFind} className="w-full bg-green-600 text-white hover:bg-green-700">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching merchant...</> : <><Search className="mr-2 h-4 w-4" /> Find</>}
        </Button>
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
