import { useState } from 'react';
import { ShieldCheck, Lock, Zap } from 'lucide-react';
import { Toaster } from '@project/components/ui/sonner';
import TopNav from './components/TopNav';
import Sidebar, { Section } from './components/Sidebar';
import LoginStepOne from './components/LoginStepOne';
import LoginStepTwo from './components/LoginStepTwo';
import SectionView, { Session } from './components/SectionView';
import { cn } from '@project/components/lib/utils';

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden rounded-3xl bg-[hsl(var(--sidebar-background))] p-10 text-white lg:flex lg:flex-col">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Merchant Portal</p>
        <h2 className="mt-4 text-4xl font-extrabold leading-tight">Secure access for<br />merchants &amp; clients.</h2>
        <p className="mt-4 max-w-sm text-white/70">Verify your merchant, set up client access and manage records from a single dashboard.</p>
      </div>
      <div className="relative mt-auto space-y-4">
        {[[ShieldCheck, 'Verified merchant records'], [Lock, 'Encrypted session'], [Zap, 'Instant dashboard access']].map(([Icon, t], i) => {
          const I = Icon as typeof Lock;
          return (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/30"><I className="h-4 w-4" /></span>
              <span className="text-sm font-medium">{t as string}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {['Merchant', 'Client'].map((l, i) => (
        <div key={l} className="flex flex-1 items-center gap-2">
          <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
            step > i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{i + 1}</span>
          <span className={cn('text-sm font-semibold', step > i ? 'text-foreground' : 'text-muted-foreground')}>{l}</span>
          {i === 0 && <div className={cn('h-0.5 flex-1 rounded', step === 2 ? 'bg-primary' : 'bg-muted')} />}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<1 | 2>(1);
  const [creds, setCreds] = useState({ merchantId: '', passkey: '' });
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [session, setSession] = useState<Session | null>(null);
  const [menu, setMenu] = useState(false);
  const [section, setSection] = useState<Section>('dashboard');

  const logout = () => { setSession(null); setStep(1); setCreds({ merchantId: '', passkey: '' }); setSection('dashboard'); };

  if (session) {
    return (
      <div className="min-h-screen">
        <TopNav onMenu={() => setMenu(true)} onLogout={logout} />
        <Sidebar open={menu} onClose={() => setMenu(false)} active={section} onSelect={setSection} isAdmin={session.role === 'admin'} />
        <SectionView section={section} session={session} onSelect={setSection} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <TopNav />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2 lg:py-12">
        <BrandPanel />
        <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-md)] sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight">{step === 1 ? 'Welcome back' : 'Client verification'}</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">{step === 1 ? 'Sign in to your merchant account' : 'Set up your client access'}</p>
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-muted p-1">
            {(['user', 'admin'] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={cn('rounded-xl py-2.5 text-sm font-semibold transition', role === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>
                {r === 'user' ? 'Pengguna' : 'Admin'}
              </button>
            ))}
          </div>
          <Stepper step={step} />
          {step === 1 ? (
            <LoginStepOne onContinue={(merchantId, passkey) => { setCreds({ merchantId, passkey }); setStep(2); }} />
          ) : (
            <LoginStepTwo merchantId={creds.merchantId} passkey={creds.passkey} role={role}
              onDone={(email) => setSession({ merchantId: creds.merchantId || 'GTMSB100027-P', email, role })} />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
