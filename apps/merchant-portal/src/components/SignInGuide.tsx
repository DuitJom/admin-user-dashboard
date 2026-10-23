import { useState } from 'react';
import { Check, Copy, KeyRound, LogIn, ShieldCheck, UserCheck } from 'lucide-react';
import { cn } from '@project/components/lib/utils';

const CREDENTIALS: { label: string; value: string; secret?: boolean }[] = [
  { label: 'Merchant ID', value: '2000166629929' },
  { label: 'Passkey', value: '$sshUSer11', secret: true },
];

const STEPS: { icon: typeof LogIn; title: string; detail: string }[] = [
  { icon: KeyRound, title: 'Enter your Merchant ID & Passkey', detail: 'Key in the Merchant ID and Passkey exactly as shown in the table below, then tap Find.' },
  { icon: ShieldCheck, title: 'Verify your merchant account', detail: 'We check your details. When a match is found you will see "1 Rekod ditemui" and your merchant card.' },
  { icon: UserCheck, title: 'Complete your client details', detail: 'Add your phone number, create a 6-digit access PIN and confirm your e-mail to continue.' },
  { icon: LogIn, title: 'Sign in to the portal', detail: 'Your details are submitted and you are taken into the Merchant Portal dashboard.' },
];

function CopyCell({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button type="button" onClick={copy} aria-label="Copy"
      className="text-muted-foreground transition hover:text-foreground">
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function SignInGuide() {
  const [reveal, setReveal] = useState(false);
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border bg-muted/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Login Credentials</h3>
          <button type="button" onClick={() => setReveal((r) => !r)}
            className="text-xs font-semibold text-primary hover:underline">
            {reveal ? 'Hide passkey' : 'Show passkey'}
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2.5 font-semibold">Field</th>
                <th className="px-4 py-2.5 font-semibold">Value</th>
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {CREDENTIALS.map(({ label, value, secret }) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium text-muted-foreground">{label}</td>
                  <td className={cn('px-4 py-3 font-mono font-semibold text-foreground')}>
                    {secret && !reveal ? '•'.repeat(value.length) : value}
                  </td>
                  <td className="px-4 py-3"><CopyCell value={value} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Use these exact values on the sign-in form above.</p>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">How to sign in</h3>
        <ol className="space-y-3">
          {STEPS.map(({ icon: Icon, title, detail }, i) => (
            <li key={title} className="flex gap-3 rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{i + 1}</span>
                  <p className="font-semibold text-foreground">{title}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
