import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut } from 'lucide-react';
import { logout, useAuth } from 'zitejs/auth';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import MotionBackground from '../components/landing/MotionBackground';
import Logo from '../components/Logo';
import PasswordInput from '../components/PasswordInput';
import StrengthBar from '../components/StrengthBar';
import { hashPassword, randomSalt } from '../lib/crypto';
import { useVault } from '../lib/store';

export default function LockScreen() {
  const { profile } = useVault();
  return (
    <div className="relative grid min-h-screen place-items-center bg-black px-4">
      <MotionBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="shine-border relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/90 p-8 backdrop-blur">
        <div className="mb-6 flex justify-center"><Logo size="lg" /></div>
        {profile ? <Unlock /> : <Setup />}
        <Button variant="ghost" className="mt-4 w-full text-muted-foreground" onClick={() => logout({ returnTo: '/' })}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </motion.div>
    </div>
  );
}

function Unlock() {
  const { profile, setLocked, log } = useVault();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((await hashPassword(pw, profile!.salt)) !== profile!.masterHash) {
      setErr('Kata laluan master salah');
      log('Percubaan buka kunci gagal');
      return;
    }
    log('Vault dibuka');
    setLocked(false);
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-center">
        <Lock className="mx-auto mb-2 h-6 w-6 text-zinc-400" />
        <h1 className="text-lg font-semibold">Vault anda terkunci</h1>
        <p className="text-sm text-muted-foreground">{profile!.email}</p>
      </div>
      <div className="space-y-1.5">
        <Label>Kata laluan master</Label>
        <PasswordInput autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr(''); }} />
        {err && <p className="text-xs text-red-400">{err}</p>}
      </div>
      <Button className="w-full" type="submit">Buka Kunci</Button>
    </form>
  );
}

function Setup() {
  const { user } = useAuth();
  const { setProfile, setLocked, log } = useVault();
  const [name, setName] = useState(user?.name ?? '');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Nama diperlukan');
    if (pw.length < 8) return setErr('Kata laluan master mesti sekurang-kurangnya 8 aksara');
    if (pw !== pw2) return setErr('Kata laluan tidak sepadan');
    const salt = randomSalt();
    setProfile({
      username: (user?.email ?? 'pengguna').split('@')[0], displayName: name.trim(), email: user?.email ?? '',
      avatar: user?.image ?? '', salt, masterHash: await hashPassword(pw, salt), timeoutMin: 15,
    });
    log('Akaun vault didaftarkan');
    setLocked(false);
    toast.success('Vault anda sedia');
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-center">
        <h1 className="text-lg font-semibold">Cipta vault anda</h1>
        <p className="text-sm text-muted-foreground">Tetapkan kata laluan master untuk mengunci vault.</p>
      </div>
      <div className="space-y-1.5"><Label>Nama</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="space-y-1.5"><Label>Emel</Label><Input value={user?.email ?? ''} disabled /></div>
      <div className="space-y-1.5"><Label>Kata laluan master</Label><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} /></div>
      <StrengthBar password={pw} />
      <div className="space-y-1.5"><Label>Sahkan kata laluan</Label><PasswordInput value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <Button className="w-full" type="submit">Daftar Vault</Button>
    </form>
  );
}
