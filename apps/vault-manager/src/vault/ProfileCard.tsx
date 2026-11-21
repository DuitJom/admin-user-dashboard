import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import UserAvatar from '../components/UserAvatar';
import { useVault } from '../lib/store';

const presetSvg = (a: string, b: string, shape: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/>${shape}</svg>`)}`;
export const PRESETS = [
  presetSvg('#fafafa', '#52525b', '<circle cx="32" cy="32" r="14" fill="#000"/>'),
  presetSvg('#27272a', '#000', '<rect x="18" y="18" width="28" height="28" fill="none" stroke="#fff" stroke-width="3"/>'),
  presetSvg('#a1a1aa', '#18181b', '<path d="M32 14 50 48H14Z" fill="#fff"/>'),
  presetSvg('#000', '#3f3f46', '<circle cx="24" cy="32" r="8" fill="#fff"/><circle cx="40" cy="32" r="8" fill="#a1a1aa"/>'),
  presetSvg('#e4e4e7', '#71717a', '<path d="M12 40c10-16 30-16 40 0" stroke="#000" stroke-width="4" fill="none"/>'),
  presetSvg('#18181b', '#52525b', '<path d="M32 12l6 14h14l-11 9 4 15-13-9-13 9 4-15-11-9h14z" fill="#fff"/>'),
];

export default function ProfileCard() {
  const { profile, setProfile, log } = useVault();
  const p = profile!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState(p.username);
  const [displayName, setDisplayName] = useState(p.displayName);
  const [email, setEmail] = useState(p.email);

  const update = (patch: Partial<typeof p>, msg: string) => { setProfile({ ...p, ...patch }); log(msg); toast.success(msg); };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast.error('Sila pilih fail gambar');
    if (f.size > 2_000_000) return toast.error('Gambar mesti kurang dari 2 MB');
    const r = new FileReader();
    r.onload = () => update({ avatar: r.result as string }, 'Avatar dikemas kini');
    r.readAsDataURL(f);
  };
  const row = (label: string, val: string, set: (v: string) => void, save: () => void) => (
    <div className="space-y-1.5"><Label>{label}</Label>
      <div className="flex gap-2"><Input value={val} onChange={(e) => set(e.target.value)} /><Button variant="outline" onClick={save}>Simpan</Button></div></div>
  );

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <UserAvatar className="h-24 w-24 text-3xl" />
        <div className="flex-1 text-center sm:text-left">
          <div className="text-xl font-semibold">{p.displayName}</div>
          <div className="text-sm text-muted-foreground">@{p.username} · {p.email}</div>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <Button size="sm" onClick={() => fileRef.current?.click()}><Upload className="mr-1.5 h-4 w-4" />Tukar Avatar</Button>
            {PRESETS.map((src, i) => (
              <button key={i} onClick={() => update({ avatar: src }, 'Avatar dikemas kini')}
                className={`h-8 w-8 overflow-hidden rounded-full border-2 transition hover:scale-110 ${p.avatar === src ? 'border-white' : 'border-transparent'}`}>
                <img src={src} alt={`Avatar ${i + 1}`} className="h-full w-full" /></button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {row('Nama pengguna', username, setUsername, () => {
          if (!/^[a-zA-Z0-9_.]{3,24}$/.test(username)) return toast.error('3-24 aksara: huruf, nombor, _ atau .');
          update({ username }, 'Nama pengguna dikemas kini');
        })}
        {row('Nama paparan', displayName, setDisplayName, () => {
          if (!displayName.trim()) return toast.error('Nama paparan diperlukan');
          update({ displayName: displayName.trim() }, 'Nama paparan dikemas kini');
        })}
        {row('Emel', email, setEmail, () => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Emel tidak sah');
          update({ email }, 'Emel dikemas kini');
        })}
      </div>
    </div>
  );
}
