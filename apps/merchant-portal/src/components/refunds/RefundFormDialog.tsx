import { useEffect, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Upload, User } from 'lucide-react';
import { useUpload } from 'zitejs/upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import { DateTimePicker } from '@project/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import type { ListRefundsOutputType } from 'zitejs/api';

export type Refund = ListRefundsOutputType['records'][0];
export type RefundDraft = Omit<Refund, 'id'>;
export const STATUSES = ['Pending', 'Processing', 'Approved', 'Rejected'];

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  myKad: z.string().trim().regex(/^\d{6}-?\d{2}-?\d{4}$/, 'Enter a valid MyKad (e.g. 900101-14-5678)'),
  bankAccNo: z.string().trim().min(1, 'Bank / account number is required'),
  amountRefund: z.number({ invalid_type_error: 'Enter an amount' }).nonnegative(),
  rm: z.number({ invalid_type_error: 'Enter an amount' }).nonnegative(),
});

const EMPTY: RefundDraft = { fullName: '', avatarUrl: null, dateTime: new Date().toISOString(), myKad: '', amountRefund: null, bankAccNo: '', rm: null, status: 'Pending' };

export default function RefundFormDialog({ open, initial, onClose, onSave }: {
  open: boolean; initial: Refund | null; onClose: () => void; onSave: (d: RefundDraft) => Promise<void>;
}) {
  const [d, setD] = useState<RefundDraft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { upload, isUploading } = useUpload();

  useEffect(() => { if (open) { setD(initial ? { ...initial } : { ...EMPTY, dateTime: new Date().toISOString() }); setErrors({}); } }, [open, initial]);
  const set = <K extends keyof RefundDraft>(k: K, v: RefundDraft[K]) => setD((p) => ({ ...p, [k]: v }));
  const num = (v: string) => (v === '' ? null : Number(v));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { const { url } = await upload(f); set('avatarUrl', url); } catch { toast.error('Upload failed'); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(d);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setSaving(true);
    try { await onSave(d); } finally { setSaving(false); }
  };

  const field = (k: string, label: string, el: React.ReactNode) => (
    <div className="space-y-1.5"><Label>{label}</Label>{el}{errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}</div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader><DialogTitle>{initial ? 'Edit refund' : 'New refund'}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-4">
            {d.avatarUrl ? <img src={d.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
              : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><User className="h-7 w-7 text-muted-foreground" /></div>}
            <Button type="button" variant="outline" disabled={isUploading} asChild>
              <label className="cursor-pointer">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Upload avatar
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            </Button>
          </div>
          {field('dateTime', 'Date & Time', <DateTimePicker value={d.dateTime ? new Date(d.dateTime) : undefined} onChange={(v) => set('dateTime', v ? v.toISOString() : null)} />)}
          {field('fullName', 'Full Name', <Input value={d.fullName} onChange={(e) => set('fullName', e.target.value)} />)}
          {field('myKad', 'MyKad', <Input value={d.myKad} placeholder="900101-14-5678" onChange={(e) => set('myKad', e.target.value)} />)}
          <div className="grid gap-4 sm:grid-cols-2">
            {field('amountRefund', 'Amount Refund (RM)', <Input type="number" step="0.01" value={d.amountRefund ?? ''} onChange={(e) => set('amountRefund', num(e.target.value))} />)}
            {field('rm', 'RM', <Input type="number" step="0.01" value={d.rm ?? ''} onChange={(e) => set('rm', num(e.target.value))} />)}
          </div>
          {field('bankAccNo', 'Bank / Acc No.', <Input value={d.bankAccNo} placeholder="Maybank 1234567890" onChange={(e) => set('bankAccNo', e.target.value)} />)}
          {field('status', 'Status', (
            <Select value={d.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || isUploading}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
