import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { cn } from '@project/components/lib/utils';

export interface Stage {
  /** Milliseconds from click when this label begins showing. */
  at: number;
  text: string;
}

export interface ProgressButtonProps {
  /** Content shown when idle (icon + label). */
  idle: React.ReactNode;
  stages: Stage[];
  durationMs: number;
  /** Shown for the final moment only when verification actually succeeded. */
  successText?: string;
  disabled?: boolean;
  className?: string;
  /** Runs the real backend check in parallel with the animation. */
  onVerify: () => Promise<{ ok: boolean; error?: string }>;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ProgressButton({
  idle, stages, durationMs, successText, disabled, className, onVerify, onSuccess, onError,
}: ProgressButtonProps) {
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState<string>('');
  const timers = useRef<number[]>([]);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; timers.current.forEach(clearTimeout); }, []);

  const run = async () => {
    if (running || disabled) return;
    setRunning(true);
    setLabel(stages[0]?.text ?? 'Please wait…');
    timers.current = stages.map((s) => window.setTimeout(() => mounted.current && setLabel(s.text), s.at));

    const verifyP = onVerify().catch(() => ({ ok: false, error: 'Something went wrong. Please try again.' }));
    const [result] = await Promise.all([verifyP, sleep(durationMs)]);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!mounted.current) return;

    if (result.ok) {
      if (successText) { setLabel(successText); await sleep(700); }
      if (mounted.current) onSuccess();
    } else {
      setRunning(false);
      setLabel('');
      onError?.(result.error ?? 'Verification failed.');
    }
  };

  return (
    <Button onClick={run} disabled={running || disabled} className={cn('relative overflow-hidden', className)}>
      {running && (
        <motion.span aria-hidden className="absolute bottom-0 left-0 h-1 rounded-full bg-white/80"
          initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: durationMs / 1000, ease: 'linear' }} />
      )}
      <span className="relative z-10 flex items-center justify-center">
        {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{label}</> : idle}
      </span>
    </Button>
  );
}
