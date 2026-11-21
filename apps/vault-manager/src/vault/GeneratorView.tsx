import { useEffect, useState } from 'react';
import { Copy, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Slider } from '@project/components/ui/slider';
import { Switch } from '@project/components/ui/switch';
import StrengthBar from '../components/StrengthBar';
import { generatePassword, GenOpts } from '../lib/crypto';
import { copy } from '../lib/utils';

export default function GeneratorView({ onUse }: { onUse: (pw: string) => void }) {
  const [o, setO] = useState<GenOpts>({ length: 20, upper: true, lower: true, numbers: true, symbols: true, avoidAmbiguous: false });
  const [pw, setPw] = useState('');
  const regen = () => setPw(generatePassword(o));
  useEffect(regen, [o]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggles: [keyof GenOpts, string][] = [
    ['upper', 'Huruf besar (A-Z)'], ['lower', 'Huruf kecil (a-z)'], ['numbers', 'Nombor (0-9)'],
    ['symbols', 'Simbol (!@#$)'], ['avoidAmbiguous', 'Elak aksara mengelirukan (l, 1, O, 0)'],
  ];
  const toggle = (k: keyof GenOpts, v: boolean) => {
    const next = { ...o, [k]: v };
    if (!next.upper && !next.lower && !next.numbers && !next.symbols) return;
    setO(next);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Penjana Kata Laluan</h1>
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 break-all rounded-lg border bg-black p-4 font-mono text-lg">{pw}</div>
        <StrengthBar password={pw} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => copy(pw, 'Kata laluan disalin')}><Copy className="mr-2 h-4 w-4" />Salin</Button>
          <Button variant="outline" onClick={regen}><RefreshCw className="mr-2 h-4 w-4" />Jana Semula</Button>
          <Button variant="outline" onClick={() => onUse(pw)}><Plus className="mr-2 h-4 w-4" />Guna Dalam Item Baharu</Button>
        </div>
      </div>
      <div className="space-y-5 rounded-xl border bg-card p-5">
        <div>
          <div className="mb-3 flex justify-between text-sm"><span>Panjang</span><span className="font-mono">{o.length}</span></div>
          <Slider min={8} max={64} step={1} value={[o.length]} onValueChange={([v]) => setO({ ...o, length: v })} />
        </div>
        {toggles.map(([k, l]) => (
          <div key={k} className="flex items-center justify-between text-sm">
            <span>{l}</span><Switch checked={o[k] as boolean} onCheckedChange={(v) => toggle(k, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
