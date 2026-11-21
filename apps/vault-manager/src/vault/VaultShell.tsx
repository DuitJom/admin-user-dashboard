import { useEffect, useState } from 'react';
import { Menu, Plus, Search, Wand2, X } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Sheet, SheetContent } from '@project/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@project/components/ui/dropdown-menu';
import Sidebar, { ShellView } from './Sidebar';
import ItemsView from './ItemsView';
import ItemDialog from './ItemDialog';
import GeneratorView from './GeneratorView';
import SendView from './SendView';
import HealthView from './HealthView';
import SettingsView from './SettingsView';
import DashboardView from './DashboardView';
import UserAvatar from '../components/UserAvatar';
import { useVault } from '../lib/store';
import { emptyItem, ItemType, TYPE_LABEL, VaultItem } from '../lib/types';

export default function VaultShell() {
  const { profile, setLocked, log } = useVault();
  const [view, setView] = useState<ShellView>({ kind: 'dashboard' });
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<VaultItem | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const mins = profile?.timeoutMin ?? 0;
    if (!mins) return;
    let t: ReturnType<typeof setTimeout>;
    const reset = () => { clearTimeout(t); t = setTimeout(() => { log('Vault dikunci automatik'); setLocked(true); }, mins * 60_000); };
    const evs = ['mousemove', 'keydown', 'click', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => { clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, reset)); };
  }, [profile?.timeoutMin, setLocked, log]);

  const nav = (v: ShellView) => { setView(v); setMobileNav(false); };
  const onSearch = (q: string) => {
    setQuery(q);
    if (q && view.kind !== 'items') setView({ kind: 'items', filter: { kind: 'all' } });
  };
  const newItem = (type: ItemType, password = '') => setEditing({ ...emptyItem(type), password });

  return (
    <div className="flex h-screen bg-black">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:block"><Sidebar view={view} onNav={nav} /></aside>
      <Sheet open={mobileNav} onOpenChange={setMobileNav}>
        <SheetContent side="left" className="w-72 p-0"><Sidebar view={view} onNav={nav} /></SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNav(true)}><Menu className="h-5 w-5" /></Button>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => onSearch(e.target.value)} placeholder="Cari nama, username, URL, nota..." className="bg-card pl-9 pr-9" />
            {query && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setQuery('')}><X className="h-4 w-4" /></button>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm"><Plus className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">Item Baharu</span></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(TYPE_LABEL) as ItemType[]).map((t) => <DropdownMenuItem key={t} onClick={() => newItem(t)}>{TYPE_LABEL[t]}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" onClick={() => nav({ kind: 'generator' })}><Wand2 className="h-4 w-4 sm:mr-1.5" /><span className="hidden lg:inline">Penjana Kata Laluan</span></Button>
            <button onClick={() => nav({ kind: 'settings' })} className="flex items-center gap-2 rounded-full pl-1 pr-2 hover:bg-white/5">
              <UserAvatar /><span className="hidden text-sm sm:inline">{profile?.displayName}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {view.kind === 'dashboard' && <DashboardView onOpen={setEditing} />}
          {view.kind === 'items' && <ItemsView filter={view.filter} query={query} onEdit={setEditing} />}
          {view.kind === 'generator' && <GeneratorView onUse={(pw) => newItem('login', pw)} />}
          {view.kind === 'send' && <SendView />}
          {view.kind === 'health' && <HealthView onFix={setEditing} />}
          {view.kind === 'settings' && <SettingsView />}
        </main>
      </div>
      <ItemDialog item={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
