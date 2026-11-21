import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Lock } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import PasswordInput from '../components/PasswordInput';
import Logo from '../components/Logo';
import { SendItem, VaultData } from '../lib/types';
import { copy } from '../lib/utils';

function findSend(id: string): { key: string; data: VaultData; send: SendItem } | null {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    if (!key.startsWith('blackvault:')) continue;
    const data = JSON.parse(localStorage.getItem(key) || '{}') as VaultData;
    const send = data.sends?.find((s) => s.id === id);
    if (send) return { key, data, send };
  }
  return null;
}

export default function SendViewer() {
  const { id = '' } = useParams();
  const [found] = useState(() => findSend(id));
  const [pw, setPw] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const unavailable = !found || found.send.expiresAt < Date.now() || found.send.views >= found.send.maxViews;

  const reveal = () => {
    if (!found) return;
    if (found.send.password && pw !== found.send.password) return setErr('Kata laluan salah');
    const sends = found.data.sends.map((s) => (s.id === id ? { ...s, views: s.views + 1 } : s));
    localStorage.setItem(found.key, JSON.stringify({ ...found.data, sends }));
    setContent(found.send.content);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8">
        <div className="mb-6"><Logo /></div>
        {unavailable && content === null ? <p className="text-muted-foreground">Send ini tidak wujud, telah luput, atau mencapai had tontonan.</p>
          : content !== null ? (
            <div className="space-y-3"><h1 className="font-semibold">{found!.send.name}</h1>
              <pre className="whitespace-pre-wrap break-all rounded-lg border bg-black p-4 font-mono text-sm">{content}</pre>
              <Button onClick={() => copy(content)}><Copy className="mr-2 h-4 w-4" />Salin</Button></div>
          ) : (
            <div className="space-y-4"><h1 className="font-semibold">Seseorang berkongsi "{found!.send.name}" dengan anda</h1>
              {found!.send.password && <PasswordInput placeholder="Kata laluan perlindungan" value={pw} onChange={(e) => { setPw(e.target.value); setErr(''); }} />}
              {err && <p className="text-xs text-red-400">{err}</p>}
              <Button className="w-full" onClick={reveal}><Lock className="mr-2 h-4 w-4" />Buka Send</Button></div>
          )}
      </div>
    </div>
  );
}
