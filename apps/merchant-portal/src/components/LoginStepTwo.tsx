import { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@project/components/ui/alert-dialog';
import CodeBoxes from './CodeBoxes';
import { LiveCheck, LiveCross } from './icons';

function Eyeball({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className="text-muted-foreground hover:text-foreground" aria-label="Show/Hide">
      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

export default function LoginStepTwo({ merchantId, passkey, onDone }: { merchantId: string; passkey: string; onDone: (email: string) => void }) {
  const [showKey, setShowKey] = useState(false);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showPin2, setShowPin2] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const pinMismatch = pin2.length === 6 && pin !== pin2;
  const valid = phone.replace(/\D/g, '').length >= 8 && pin.length === 6 && pin === pin2 && emailOk && sent && otp.length === 6;

  const requestOtp = () => { setSent(true); setCountdown(59); setNotice(true); };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>MERCHANT ID</Label>
        <Input value={merchantId || 'GTMSB100027-P'} readOnly className="bg-muted font-mono" />
      </div>
      <div className="space-y-1.5">
        <Label>PASSKEY</Label>
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3">
          <input readOnly type={showKey ? 'text' : 'password'} value={passkey} className="h-10 flex-1 bg-transparent font-mono outline-none" />
          <Eyeball show={showKey} toggle={() => setShowKey(!showKey)} />
        </div>
      </div>

      <div className="pt-2 text-xs font-bold uppercase tracking-widest text-primary">ClientSide</div>

      <div className="space-y-1.5">
        <Label>PHONE NUMBER*</Label>
        <div className="flex">
          <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm font-medium">+60</span>
          <Input className="rounded-l-none" inputMode="numeric" placeholder="123456789" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>PIN ACCESS*</Label>
        <p className="text-xs text-muted-foreground">Create your new access PIN to continue</p>
        <div className="flex items-center gap-3">
          <CodeBoxes value={pin} onChange={setPin} masked={!showPin} />
          <Eyeball show={showPin} toggle={() => setShowPin(!showPin)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Re-Enter PIN ACCESS*</Label>
        <div className="flex items-center gap-3">
          <CodeBoxes value={pin2} onChange={setPin2} masked={!showPin2} invalid={pinMismatch} />
          <Eyeball show={showPin2} toggle={() => setShowPin2(!showPin2)} />
        </div>
        {pinMismatch && <p className="text-xs text-destructive">PIN does not match.</p>}
      </div>

      <div className="space-y-1.5">
        <Label>E-MAIL*</Label>
        <Input type="email" placeholder="Please enter your e-mail here" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button variant="secondary" className="w-full" disabled={!emailOk || countdown > 0} onClick={requestOtp}>
          <Mail className="mr-2 h-4 w-4" /> {sent ? 'Resend OTP' : 'Request OTP'}
        </Button>
        {sent && (
          <p className="text-xs text-muted-foreground">
            Not receive the OTP code? {countdown > 0 ? <>Resend again in <b>{countdown}s</b>.</> : 'You can resend now.'}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Enter OTP code here</Label>
        <div className="flex items-center gap-3">
          <CodeBoxes value={otp} onChange={setOtp} />
          {otp.length === 6 ? <LiveCheck key="ok" /> : <LiveCross key="no" />}
        </div>
      </div>

      <Button className="h-12 w-full text-base" disabled={!valid} onClick={() => onDone(email)}>Continue</Button>
      <p className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree with our company Privacy Policy and Terms &amp; Conditions on the SalesForce website.
      </p>

      <AlertDialog open={notice} onOpenChange={setNotice}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kod Pengesahan Dihantar</AlertDialogTitle>
            <AlertDialogDescription>
              Kod Pengesahan telah dihantar ke alamat e-mel anda. Sila periksa peti Masuk atau folder SPAM/JUNK untuk dapatkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
