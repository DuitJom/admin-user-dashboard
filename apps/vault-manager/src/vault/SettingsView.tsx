import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, Lock, LogOut, Upload } from 'lucide-react';
import { logout } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Label } from '@project/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@project/components/ui/alert-dialog';
import PasswordInput from '../components/PasswordInput';
import StrengthBar from '../components/StrengthBar';
import ProfileCard from './ProfileCard';
import { hashPassword, randomSalt } from '../lib/crypto';
import { useVault } from '../lib/store';

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-6"><h2 className="mb-4 font-semibold">{title}</h2>{children}</div>
);

export default function SettingsView() {
  const v = useVault();
  const p = v.profile!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [cur, setCur] = useState(''); const [n1, setN1] = useState(''); const [n2, setN2] = useState('');

  const changeMaster = async () => {
    if ((await hashPassword(cur, p.salt)) !== p.masterHash) return toast.error('Kata laluan semasa salah');
    if (n1.length < 8) return toast.error('Kata laluan baharu mesti sekurang-kurangnya 8 aksara');
    if (n1 !== n2) return toast.error('Pengesahan tidak sepadan');
    const salt = randomSalt();
    v.setProfile({ ...p, salt, masterHash: await hashPassword(n1, salt) });
    v.log('Kata laluan master ditukar'); toast.success('Kata laluan master dikemas kini');
    setCur(''); setN1(''); setN2('');
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ items: v.items, sends: v.sends }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `blackvault-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    v.log('Vault dieksport'); toast.success('Vault dieksport');
  };
  const importJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (!Array.isArray(d.items)) throw new Error();
      v.replaceAll({ items: d.items, sends: Array.isArray(d.sends) ? d.sends : v.sends });
      v.log(`Import ${d.items.length} item`); toast.success(`${d.items.length} item diimport`);
    } catch { toast.error('Fail JSON tidak sah'); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Tetapan</h1>
      <ProfileCard />
      <Card title="Set Semula Kata Laluan Master">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5"><Label>Semasa</Label><PasswordInput value={cur} onChange={(e) => setCur(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Baharu</Label><PasswordInput value={n1} onChange={(e) => setN1(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Sahkan</Label><PasswordInput value={n2} onChange={(e) => setN2(e.target.value)} /></div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4"><div className="w-64"><StrengthBar password={n1} /></div><Button onClick={changeMaster}>Simpan</Button></div>
      </Card>
      <Card title="Keselamatan">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5"><Label>Vault Timeout</Label>
            <Select value={String(p.timeoutMin)} onValueChange={(x) => { v.setProfile({ ...p, timeoutMin: +x }); toast.success('Timeout dikemas kini'); }}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>{[['1', '1 minit'], ['5', '5 minit'], ['15', '15 minit'], ['60', '1 jam'], ['0', 'Tidak Pernah']].map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
            </Select></div>
          <Button variant="outline" onClick={() => { v.log('Vault dikunci'); v.setLocked(true); }}><Lock className="mr-2 h-4 w-4" />Kunci Vault</Button>
          <Button variant="outline" onClick={() => logout({ returnTo: '/' })}><LogOut className="mr-2 h-4 w-4" />Sign Out</Button>
        </div>
        <div className="mt-6"><Label>Log aktiviti</Label>
          <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border bg-black text-sm">
            {v.logs.length === 0 && <p className="p-4 text-muted-foreground">Tiada aktiviti</p>}
            {v.logs.map((l) => <div key={l.id} className="flex justify-between gap-4 border-b px-4 py-2 last:border-0"><span>{l.text}</span><span className="shrink-0 text-xs text-muted-foreground">{new Date(l.at).toLocaleString('ms-MY')}</span></div>)}
          </div></div>
      </Card>
      <Card title="Data">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportJson}><Download className="mr-2 h-4 w-4" />Export ke JSON</Button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
          <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Import dari JSON</Button>
        </div>
      </Card>
      <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-6">
        <h2 className="font-semibold text-red-400">Zon Bahaya</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">Padam semua item, Send, profil dan kata laluan master dari peranti ini.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive">Padam Semua Data</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Padam semua data?</AlertDialogTitle>
              <AlertDialogDescription>Semua data vault akan hilang selamanya. Eksport dahulu jika perlu.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { v.wipe(); toast.success('Semua data dipadam'); }}>Padam Semua</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
