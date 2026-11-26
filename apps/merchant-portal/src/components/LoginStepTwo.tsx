import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, IdCard, ShieldCheck } from 'lucide-react';
import { sendRegistration } from 'zitejs/api';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import CodeBoxes from './CodeBoxes';
import PhoneInput from './PhoneInput';
import ProgressButton, { Stage } from './ProgressButton';
import { DEFAULT_COUNTRY, Country } from './countries';

const CONTINUE_STAGES: Stage[] = [
  { at: 0, text: 'Please wait…' },
  { at: 2000, text: 'Processing your request…' },
  { at: 4000, text: 'Checking session…' },
  { at: 6000, text: 'Preparing workspace…' },
  { at: 8000, text: 'Almost ready…' },
];

function Eyeball({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className="text-muted-foreground hover:text-foreground" aria-label="Show/Hide">
      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

export default function LoginStepTwo({ merchantId, role, onDone }: { merchantId: string; role: string; onDone: (email: string) => void }) {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showPin2, setShowPin2] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const pinMismatch = pin2.length === 6 && pin !== pin2;
  const valid = phone.length >= 6 && pin.length === 6 && pin === pin2 && emailOk;

  const verify = async () => {
    try {
      await sendRegistration({ merchantId, role, phone, dialCode: country.dial, pin, email });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghantar. Please try again.' };
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-lg font-extrabold">Protect Your Account</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Please ensure that your account is protected with strong security measures to prevent unauthorised access to your confidential information.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="verified-merchant-id">MERCHANT ID</Label>
        <div className="flex h-12 items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-3 shadow-sm">
          <IdCard className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
          <Input id="verified-merchant-id" value={merchantId} readOnly className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 font-mono text-slate-900 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
        </div>
      </div>

      <div className="pt-2 text-xs font-bold uppercase tracking-widest text-primary">ClientSide</div>

      <div className="space-y-1.5">
        <Label>PHONE NUMBER*</Label>
        <PhoneInput country={country} onCountryChange={setCountry} value={phone} onChange={setPhone} />
      </div>

      <div className="space-y-1.5">
        <Label>PIN ACCESS*</Label>
        <p className="text-xs text-muted-foreground">Create your new access PIN to continue</p>
        <div className="flex items-center gap-3">
          <CodeBoxes value={pin} onChange={setPin} masked={!showPin} />
          <Eyeball show={showPin} toggle={() => setShowPin(!showPin)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Re-Enter PIN ACCESS*</Label>
        <div className="flex items-center gap-3">
          <CodeBoxes value={pin2} onChange={setPin2} masked={!showPin2} invalid={pinMismatch} />
          <Eyeball show={showPin2} toggle={() => setShowPin2(!showPin2)} />
        </div>
        {pinMismatch && <p className="text-xs text-destructive">PIN does not match.</p>}
      </div>

      <div className="space-y-1.5">
        <Label>E-MAIL*</Label>
        <Input type="email" className="h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
        {email && !emailOk && <p className="text-xs text-destructive">Please enter a valid e-mail.</p>}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressButton
        idle={<>Continue</>}
        stages={CONTINUE_STAGES}
        durationMs={10000}
        disabled={!valid}
        className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
        onVerify={verify}
        onSuccess={() => onDone(email)}
        onError={setError}
      />
      <p className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree with our company Privacy Policy and Terms &amp; Conditions on the SalesForce website.
      </p>
    </div>
  );
}
