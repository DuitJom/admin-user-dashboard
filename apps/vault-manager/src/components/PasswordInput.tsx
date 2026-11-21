import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@project/components/ui/input';

export default function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className={`pr-10 font-mono ${props.className ?? ''}`} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Sembunyi' : 'Tunjuk'}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
