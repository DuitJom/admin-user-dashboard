import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Textarea } from '@project/components/ui/textarea';
import { Switch } from '@project/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import PasswordInput from '../components/PasswordInput';
import StrengthBar from '../components/StrengthBar';
import { FOLDERS, ItemType, TYPE_LABEL, VaultItem } from '../lib/types';
import { generatePassword } from '../lib/crypto';
import { useVault } from '../lib/store';

export default function ItemDialog({ item, onClose }: { item: VaultItem | null; onClose: () => void }) {
  const { saveItem, log, items } = useVault();
  const [f, setF] = useState<VaultItem | null>(item);
  const [err, setErr] = useState('');
  useEffect(() => { setF(item); setErr(''); }, [item]);
  if (!f) return null;
  const isNew = !items.some((i) => i.id === f.id);
  const set = <K extends keyof VaultItem>(k: K, v: VaultItem[K]) => setF({ ...f, [k]: v });
  const field = (k: keyof VaultItem, label: string, ph = '') => (
    <div className="space-y-1.5"><Label>{label}</Label>
      <Input value={f[k] as string} placeholder={ph} onChange={(e) => set(k, e.target.value as never)} /></div>
  );

  const save = () => {
    if (!f.name.trim()) return setErr('Nama item diperlukan');
    if (f.url && !/^https?:\/\//.test(f.url)) return setErr('URL mesti bermula dengan http:// atau https://');
    saveItem({ ...f, name: f.name.trim() });
    log(`${isNew ? 'Item ditambah' : 'Item dikemas kini'}: ${f.name}`);
    toast.success(isNew ? 'Item ditambah' : 'Item disimpan');
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{isNew ? 'Item Baharu' : 'Edit Item'}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Jenis</Label>
              <Select value={f.type} onValueChange={(v) => set('type', v as ItemType)} disabled={!isNew}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(TYPE_LABEL).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><Label>Folder</Label>
              <Select value={f.folder || 'none'} onValueChange={(v) => set('folder', (v === 'none' ? '' : v) as VaultItem['folder'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none">Tiada folder</SelectItem>
                  {FOLDERS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
          {field('name', 'Nama', 'cth. Gmail')}
          {f.type === 'login' && <>
            {field('username', 'Username / Emel')}
            <div className="space-y-1.5"><Label>Kata laluan</Label>
              <div className="flex gap-2"><div className="flex-1"><PasswordInput value={f.password} onChange={(e) => set('password', e.target.value)} /></div>
                <Button type="button" variant="outline" size="icon" title="Jana" onClick={() => set('password', generatePassword({ length: 20, upper: true, lower: true, numbers: true, symbols: true, avoidAmbiguous: true }))}>
                  <Wand2 className="h-4 w-4" /></Button></div>
              <StrengthBar password={f.password} /></div>
            {field('url', 'URL', 'https://')}
            {field('totp', 'Kunci TOTP (base32)', 'JBSWY3DPEHPK3PXP')}
          </>}
          {f.type === 'card' && <>
            {field('cardHolder', 'Nama pemegang kad')}
            {field('cardNumber', 'Nombor kad')}
            <div className="grid grid-cols-2 gap-3">{field('cardExpiry', 'Tamat (BB/TT)')}
              <div className="space-y-1.5"><Label>CVV</Label><PasswordInput value={f.cardCvv} onChange={(e) => set('cardCvv', e.target.value)} /></div></div>
          </>}
          {f.type === 'identity' && <>
            {field('fullName', 'Nama penuh')}{field('idNumber', 'No. IC / Pasport')}{field('phone', 'Telefon')}{field('address', 'Alamat')}
          </>}
          <div className="space-y-1.5"><Label>Nota</Label><Textarea rows={3} value={f.notes} onChange={(e) => set('notes', e.target.value)} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span>Kegemaran</span><Switch checked={f.favorite} onCheckedChange={(v) => set('favorite', v)} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span>Tambah ke Koleksi kongsi</span><Switch checked={f.shared} onCheckedChange={(v) => set('shared', v)} /></div>
          {err && <p className="text-sm text-red-400">{err}</p>}
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
