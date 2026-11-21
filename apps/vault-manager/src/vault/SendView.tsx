import { useState } from 'react';
import { toast } from 'sonner';
import { Link2, Send, Trash2 } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Textarea } from '@project/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import PasswordInput from '../components/PasswordInput';
import { useVault } from '../lib/store';
import { copy } from '../lib/utils';

const EXP = { '1h': 3600e3, '1d': 86400e3, '7d': 7 * 86400e3 };

export default function SendView() {
  const { sends, addSend, removeSend, log } = useVault();
  const [kind, setKind] = useState<'text' | 'password'>('text');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [exp, setExp] = useState<keyof typeof EXP>('1d');
  const [maxViews, setMaxViews] = useState('5');
  const [pw, setPw] = useState('');

  const create = () => {
    if (!name.trim() || !content) return toast.error('Nama dan kandungan diperlukan');
    const n = parseInt(maxViews, 10);
    if (!n || n < 1) return toast.error('Had tontonan mesti sekurang-kurangnya 1');
    addSend({ id: crypto.randomUUID().slice(0, 12), kind, name: name.trim(), content, expiresAt: Date.now() + EXP[exp], maxViews: n, views: 0, password: pw, createdAt: Date.now() });
    log(`Send dicipta: ${name}`);
    toast.success('Send dicipta');
    setName(''); setContent(''); setPw('');
  };
  const link = (id: string) => `${window.location.origin}/send/${id}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Send</h1>
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <div className="space-y-1.5"><Label>Jenis</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="text">Teks</SelectItem><SelectItem value="password">Kata laluan</SelectItem></SelectContent></Select></div>
        <div className="space-y-1.5"><Label>Nama</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-1.5 sm:col-span-2"><Label>Kandungan</Label>
          {kind === 'text' ? <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
            : <PasswordInput value={content} onChange={(e) => setContent(e.target.value)} />}</div>
        <div className="space-y-1.5"><Label>Tarikh luput</Label>
          <Select value={exp} onValueChange={(v) => setExp(v as typeof exp)}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="1h">1 jam</SelectItem><SelectItem value="1d">1 hari</SelectItem><SelectItem value="7d">7 hari</SelectItem></SelectContent></Select></div>
        <div className="space-y-1.5"><Label>Had tontonan</Label><Input type="number" min={1} value={maxViews} onChange={(e) => setMaxViews(e.target.value)} /></div>
        <div className="space-y-1.5 sm:col-span-2"><Label>Kata laluan perlindungan (pilihan)</Label><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <Button className="sm:col-span-2" onClick={create}><Send className="mr-2 h-4 w-4" />Cipta Send</Button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        {sends.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Belum ada Send</p>}
        {sends.map((s) => {
          const expired = s.expiresAt < Date.now() || s.views >= s.maxViews;
          return (
            <div key={s.id} className="flex items-center gap-3 border-b px-4 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">
                  {s.kind === 'text' ? 'Teks' : 'Kata laluan'} · {s.views}/{s.maxViews} tontonan · {expired ? 'Tamat' : `Luput ${new Date(s.expiresAt).toLocaleString('ms-MY')}`}{s.password && ' · Dilindungi'}
                </div>
              </div>
              <Button variant="outline" size="sm" disabled={expired} onClick={() => copy(link(s.id), 'Link disalin')}><Link2 className="mr-1.5 h-4 w-4" />Salin Link</Button>
              <Button variant="ghost" size="icon" onClick={() => { removeSend(s.id); log(`Send dipadam: ${s.name}`); toast.success('Send dipadam'); }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
