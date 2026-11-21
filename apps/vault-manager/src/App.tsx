import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { loginWithRedirect, useAuth } from 'zitejs/auth';
import { Toaster } from '@project/components/ui/sonner';
import Landing from './pages/Landing';
import LockScreen from './pages/LockScreen';
import SendViewer from './pages/SendViewer';
import VaultShell from './vault/VaultShell';
import { useVault, VaultProvider } from './lib/store';

function VaultGate() {
  const { locked, profile } = useVault();
  return locked || !profile ? <LockScreen /> : <VaultShell />;
}

function ProtectedVault() {
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !user) loginWithRedirect({ redirectUrl: '/vault' });
  }, [isLoading, user]);
  if (isLoading || !user) return <div className="min-h-screen bg-black" />;
  return <VaultProvider key={user.id} userId={user.id}><VaultGate /></VaultProvider>;
}

function Home() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-black" />;
  return user ? <Navigate to="/vault" replace /> : <Landing />;
}

export default function App() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vault" element={<ProtectedVault />} />
        <Route path="/send/:id" element={<SendViewer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster theme="dark" position="bottom-right" />
    </BrowserRouter>
  );
}
