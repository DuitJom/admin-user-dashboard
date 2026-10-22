import { useState } from 'react';
import { Toaster } from '@project/components/ui/sonner';
import { Tabs, TabsList, TabsTrigger } from '@project/components/ui/tabs';
import TopNav from './components/TopNav';
import Sidebar, { Section } from './components/Sidebar';
import LoginStepOne from './components/LoginStepOne';
import LoginStepTwo from './components/LoginStepTwo';
import SectionView, { Session } from './components/SectionView';

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
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-md)] sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight">{step === 1 ? 'Merchant Login' : 'Client Verification'}</h1>
          <Tabs value={role} onValueChange={(v) => setRole(v as 'admin' | 'user')} className="my-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Pengguna</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>
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
