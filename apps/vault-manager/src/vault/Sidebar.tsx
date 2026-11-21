import {
  Activity, CreditCard, FileText, Folder, IdCard, KeyRound, LayoutDashboard, Layers, Send, Settings, Star, Trash2, Users, Wand2,
} from 'lucide-react';
import Logo from '../components/Logo';
import { FOLDERS, ItemType, TYPE_LABEL } from '../lib/types';
import { View } from '../lib/utils';
import { useVault } from '../lib/store';

type Entry = { label: string; icon: typeof Star; view: View | { kind: 'dashboard' } };
export type ShellView = View | { kind: 'dashboard' };

const TYPE_ICON: Record<ItemType, typeof Star> = { login: KeyRound, card: CreditCard, identity: IdCard, note: FileText };

const same = (a: ShellView, b: ShellView) => JSON.stringify(a) === JSON.stringify(b);

export default function Sidebar({ view, onNav }: { view: ShellView; onNav: (v: ShellView) => void }) {
  const { items } = useVault();
  const count = (fn: (i: (typeof items)[0]) => boolean) => items.filter(fn).length;
  const main: Entry[] = [
    { label: 'Dashboard', icon: LayoutDashboard, view: { kind: 'dashboard' } },
    { label: 'Semua Item', icon: Layers, view: { kind: 'items', filter: { kind: 'all' } } },
    { label: 'Kegemaran', icon: Star, view: { kind: 'items', filter: { kind: 'fav' } } },
    { label: 'Sampah', icon: Trash2, view: { kind: 'items', filter: { kind: 'trash' } } },
    { label: 'Penjana Kata Laluan', icon: Wand2, view: { kind: 'generator' } },
    { label: 'Send', icon: Send, view: { kind: 'send' } },
    { label: 'Kesihatan Vault', icon: Activity, view: { kind: 'health' } },
    { label: 'Tetapan', icon: Settings, view: { kind: 'settings' } },
  ];
  const folders: Entry[] = FOLDERS.map((f) => ({ label: f, icon: Folder, view: { kind: 'items', filter: { kind: 'folder', folder: f } } }));
  const types: Entry[] = (Object.keys(TYPE_LABEL) as ItemType[]).map((t) => ({ label: TYPE_LABEL[t], icon: TYPE_ICON[t], view: { kind: 'items', filter: { kind: 'type', type: t } } }));
  const colls: Entry[] = [{ label: 'Koleksi kongsi', icon: Users, view: { kind: 'items', filter: { kind: 'shared' } } }];

  const badge = (e: Entry) => {
    const v = e.view;
    if (v.kind !== 'items') return null;
    const f = v.filter;
    return count((i) => (f.kind === 'trash' ? i.deleted : !i.deleted && (f.kind === 'all' || (f.kind === 'fav' && i.favorite) || (f.kind === 'shared' && i.shared) || (f.kind === 'folder' && i.folder === f.folder) || (f.kind === 'type' && i.type === f.type))));
  };

  const group = (title: string, list: Entry[]) => (
    <div className="mb-5">
      {title && <div className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</div>}
      {list.map((e) => {
        const active = same(e.view, view);
        return (
          <button key={e.label} onClick={() => onNav(e.view)}
            className={`flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition ${active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <e.icon className="h-4 w-4" strokeWidth={1.75} /><span className="flex-1 text-left">{e.label}</span>
            {badge(e) !== null && <span className="text-xs text-muted-foreground">{badge(e)}</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mb-6 px-2"><Logo /></div>
      {group('', main)}{group('Folder', folders)}{group('Jenis', types)}{group('Koleksi', colls)}
    </div>
  );
}
