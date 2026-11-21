import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDownUp, Inbox, Trash2 } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@project/components/ui/alert-dialog';
import ItemRow from './ItemRow';
import { useVault } from '../lib/store';
import { TYPE_LABEL, VaultItem } from '../lib/types';
import { Filter, matchFilter, matchSearch } from '../lib/utils';

const title = (f: Filter) =>
  f.kind === 'all' ? 'Semua Item' : f.kind === 'fav' ? 'Kegemaran' : f.kind === 'trash' ? 'Sampah'
    : f.kind === 'shared' ? 'Koleksi kongsi' : f.kind === 'folder' ? f.folder : TYPE_LABEL[f.type];

export default function ItemsView({ filter, query, onEdit }: { filter: Filter; query: string; onEdit: (i: VaultItem) => void }) {
  const { items, removeItem, log } = useVault();
  const [sort, setSort] = useState<'name' | 'updated'>('updated');
  const [purge, setPurge] = useState<VaultItem | 'all' | null>(null);

  const list = useMemo(() => items
    .filter((i) => matchFilter(i, filter) && matchSearch(i, query))
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b.updatedAt - a.updatedAt)), [items, filter, query, sort]);

  const doPurge = () => {
    const targets = purge === 'all' ? list : purge ? [purge] : [];
    targets.forEach((t) => removeItem(t.id));
    log(`${targets.length} item dipadam kekal`);
    toast.success('Dipadam kekal');
    setPurge(null);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title(filter)}</h1>
          <p className="text-sm text-muted-foreground">{list.length} item{query && ` sepadan "${query}"`}</p>
        </div>
        <div className="flex gap-2">
          {filter.kind === 'trash' && list.length > 0 && (
            <Button variant="outline" onClick={() => setPurge('all')}><Trash2 className="mr-2 h-4 w-4" />Kosongkan Sampah</Button>)}
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-48"><ArrowDownUp className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="updated">Tarikh dikemas kini</SelectItem><SelectItem value="name">Nama (A-Z)</SelectItem></SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground"><Inbox className="h-8 w-8" strokeWidth={1.5} />Tiada item</div>
        ) : list.map((i) => <ItemRow key={i.id} item={i} onEdit={onEdit} onPurge={setPurge} />)}
      </div>
      <AlertDialog open={!!purge} onOpenChange={(o) => !o && setPurge(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Padam kekal?</AlertDialogTitle>
            <AlertDialogDescription>{purge === 'all' ? 'Semua item dalam Sampah' : `"${purge?.name}"`} akan dipadam selamanya. Tindakan ini tidak boleh dibatalkan.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={doPurge}>Padam Kekal</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
