import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { listRefunds, saveRefund, deleteRefund } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Skeleton } from '@project/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@project/components/ui/alert-dialog';
import RefundTable from './RefundTable';
import RefundFormDialog, { type Refund, type RefundDraft } from './RefundFormDialog';

type Creds = { username: string; password: string };

function Login({ onLogin }: { onLogin: (c: Creds, rows: Refund[]) => void }) {
  const [c, setC] = useState<Creds>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { const { records } = await listRefunds(c); onLogin(c, records); }
    catch { setError('Invalid username or password.'); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-16 w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 shadow-2xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div>
      <div><h1 className="text-xl font-extrabold">Refund Records</h1><p className="text-sm text-muted-foreground">Admin access required.</p></div>
      <div className="space-y-1.5"><Label>User</Label><Input value={c.username} onChange={(e) => setC({ ...c, username: e.target.value })} autoFocus /></div>
      <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={c.password} onChange={(e) => setC({ ...c, password: e.target.value })} /></div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={!c.username || !c.password || loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue</Button>
    </form>
  );
}

export default function RefundsPage() {
  const [creds, setCreds] = useState<Creds | null>(null);
  const [rows, setRows] = useState<Refund[] | null>(null);
  const [editing, setEditing] = useState<Refund | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Refund | null>(null);

  if (!creds) return <Login onLogin={(c, r) => { setCreds(c); setRows(r); }} />;
  const reload = async () => setRows((await listRefunds(creds)).records);

  const save = async (d: RefundDraft) => {
    try {
      await saveRefund({ ...creds, id: editing?.id, record: d });
      toast.success(editing ? 'Refund updated' : 'Refund added');
      setFormOpen(false); await reload();
    } catch { toast.error('Could not save refund'); }
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    const prev = rows;
    setRows((r) => r?.filter((x) => x.id !== toDelete.id) ?? null); setToDelete(null);
    try { await deleteRefund({ ...creds, id: toDelete.id }); toast.success('Refund deleted'); }
    catch { setRows(prev); toast.error('Could not delete refund'); }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-5 shadow-lg">
        <div><h1 className="text-2xl font-extrabold">Refund Records</h1><p className="text-sm text-muted-foreground">Manage customer refunds.</p></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setCreds(null); setRows(null); }}><LogOut className="mr-2 h-4 w-4" /> Log out</Button>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-2 h-4 w-4" /> New refund</Button>
        </div>
      </div>
      <div className="rounded-2xl bg-card p-4 shadow-lg">
        {rows ? <RefundTable rows={rows} onEdit={(r) => { setEditing(r); setFormOpen(true); }} onDelete={setToDelete} />
          : <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>}
      </div>
      <RefundFormDialog open={formOpen} initial={editing} onClose={() => setFormOpen(false)} onSave={save} />
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this refund?</AlertDialogTitle>
            <AlertDialogDescription>The record for {toDelete?.fullName} will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
