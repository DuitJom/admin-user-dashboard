import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Clock, Copy, CreditCard, Eye, EyeOff, FileText, IdCard, KeyRound, MoreHorizontal, Pencil, RotateCcw, Star, Trash2, CopyPlus,
} from 'lucide-react';
import { Button } from '@project/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@project/components/ui/dropdown-menu';
import { VaultItem } from '../lib/types';
import { copy, fmtDate, subtitle } from '../lib/utils';
import { totpCode } from '../lib/crypto';
import { useVault } from '../lib/store';

const ICON = { login: KeyRound, card: CreditCard, identity: IdCard, note: FileText };

export default function ItemRow({ item, onEdit, onPurge }: { item: VaultItem; onEdit: (i: VaultItem) => void; onPurge: (i: VaultItem) => void }) {
  const { patchItem, saveItem, log } = useVault();
  const [show, setShow] = useState(false);
  const Icon = ICON[item.type];
  const secret = item.type === 'login' ? item.password : item.type === 'card' ? item.cardNumber : '';

  const act = (patch: Partial<VaultItem>, msg: string) => { patchItem(item.id, patch); log(`${msg}: ${item.name}`); toast.success(msg); };
  const clone = () => {
    saveItem({ ...item, id: crypto.randomUUID(), name: `${item.name} (salinan)`, createdAt: Date.now() });
    log(`Item diklon: ${item.name}`); toast.success('Item diklon');
  };

  return (
    <div className="group flex items-center gap-3 border-b px-4 py-3 transition hover:bg-white/[0.03]">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border bg-card"><Icon className="h-4 w-4" strokeWidth={1.75} /></div>
      <button className="min-w-0 flex-1 text-left" onClick={() => !item.deleted && onEdit(item)}>
        <div className="flex items-center gap-1.5 truncate font-medium">
          {item.name}{item.favorite && <Star className="h-3.5 w-3.5 fill-current" />}
        </div>
        <div className="truncate text-sm text-muted-foreground">
          {secret && show ? <span className="font-mono text-foreground">{secret}</span> : subtitle(item)}
        </div>
      </button>
      <span className="hidden text-xs text-muted-foreground lg:block">{item.folder || '—'}</span>
      <span className="hidden w-28 text-right text-xs text-muted-foreground md:block">{fmtDate(item.updatedAt)}</span>
      {!item.deleted && (
        <div className="flex items-center">
          {item.type === 'login' && <Button variant="ghost" size="icon" title="Salin username" onClick={() => copy(item.username, 'Username disalin')}><Copy className="h-4 w-4" /></Button>}
          {secret && <Button variant="ghost" size="icon" title={show ? 'Sembunyi' : 'Tunjuk'} onClick={() => setShow(!show)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>}
          {secret && <Button variant="ghost" size="icon" title="Salin" onClick={() => copy(secret, 'Disalin')}><KeyRound className="h-4 w-4" /></Button>}
          {item.totp && <TotpButton secret={item.totp} />}
          <Button variant="ghost" size="icon" title="Kegemaran" onClick={() => act({ favorite: !item.favorite }, item.favorite ? 'Dibuang dari Kegemaran' : 'Ditambah ke Kegemaran')}>
            <Star className={`h-4 w-4 ${item.favorite ? 'fill-current' : ''}`} /></Button>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {item.deleted ? <>
            <DropdownMenuItem onClick={() => act({ deleted: false }, 'Item dipulihkan')}><RotateCcw className="mr-2 h-4 w-4" />Restore</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400" onClick={() => onPurge(item)}><Trash2 className="mr-2 h-4 w-4" />Padam Kekal</DropdownMenuItem>
          </> : <>
            <DropdownMenuItem onClick={() => onEdit(item)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={clone}><CopyPlus className="mr-2 h-4 w-4" />Clone</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400" onClick={() => act({ deleted: true }, 'Dipindah ke Sampah')}><Trash2 className="mr-2 h-4 w-4" />Pindah ke Sampah</DropdownMenuItem>
          </>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TotpButton({ secret }: { secret: string }) {
  const [code, setCode] = useState('');
  useEffect(() => {
    const tick = () => totpCode(secret).then(setCode).catch(() => setCode(''));
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [secret]);
  return (
    <Button variant="ghost" size="sm" className="hidden gap-1 font-mono text-xs sm:inline-flex" title="Salin kod TOTP" onClick={() => copy(code, 'Kod TOTP disalin')}>
      <Clock className="h-3.5 w-3.5" />{code ? `${code.slice(0, 3)} ${code.slice(3)}` : '------'}
    </Button>
  );
}
