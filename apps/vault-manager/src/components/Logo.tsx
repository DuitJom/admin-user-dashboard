import { ShieldCheck } from 'lucide-react';

export default function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} grid place-items-center rounded-lg bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.25)]`}>
        <ShieldCheck className="h-[60%] w-[60%]" strokeWidth={2} />
      </div>
      <span className={`font-semibold tracking-tight ${size === 'lg' ? 'text-xl' : 'text-base'}`}>BlackVault</span>
    </div>
  );
}
