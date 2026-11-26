import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Pencil, Search, Trash2, User } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';
import { Badge } from '@project/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@project/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { cn } from '@project/components/lib/utils';
import { STATUSES, type Refund } from './RefundFormDialog';

const PAGE = 10;
const rm = (n: number | null) => (n == null ? '—' : `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const STATUS_CLS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800', Processing: 'bg-sky-100 text-sky-800',
  Approved: 'bg-green-100 text-green-800', Rejected: 'bg-red-100 text-red-800',
};
type SortKey = 'dateTime' | 'fullName' | 'amountRefund' | 'rm';

export default function RefundTable({ rows, onEdit, onDelete }: { rows: Refund[]; onEdit: (r: Refund) => void; onDelete: (r: Refund) => void }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'dateTime', asc: false });
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return rows
      .filter((r) => (status === 'all' || r.status === status) && [r.fullName, r.myKad, r.bankAccNo].some((v) => v.toLowerCase().includes(s)))
      .sort((a, b) => {
        const av = a[sort.key] ?? '', bv = b[sort.key] ?? '';
        return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.asc ? 1 : -1);
      });
  }, [rows, q, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const view = filtered.slice(page * PAGE, page * PAGE + PAGE);

  const H = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <button className="inline-flex items-center gap-1" onClick={() => setSort((p) => ({ key: k, asc: p.key === k ? !p.asc : true }))}>
      {children}<ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, MyKad, bank..." value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead><H k="dateTime">Date & Time</H></TableHead>
            <TableHead><H k="fullName">Full Name</H></TableHead>
            <TableHead>MyKad</TableHead>
            <TableHead><H k="amountRefund">Amount Refund</H></TableHead>
            <TableHead>Bank / Acc No.</TableHead>
            <TableHead><H k="rm">RM</H></TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {view.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No refund records found.</TableCell></TableRow>}
            {view.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-sm">{r.dateTime ? format(new Date(r.dateTime), 'dd/MM/yyyy HH:mm') : '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    {r.avatarUrl ? <img src={r.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                      : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"><User className="h-4 w-4 text-muted-foreground" /></div>}
                    <span className="font-medium">{r.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{r.myKad}</TableCell>
                <TableCell className="whitespace-nowrap">{rm(r.amountRefund)}</TableCell>
                <TableCell className="text-sm">{r.bankAccNo}</TableCell>
                <TableCell className="whitespace-nowrap">{rm(r.rm)}</TableCell>
                <TableCell><Badge variant="outline" className={cn('border-0', STATUS_CLS[r.status])}>{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filtered.length} record(s)</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <span>{page + 1} / {pages}</span>
          <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
