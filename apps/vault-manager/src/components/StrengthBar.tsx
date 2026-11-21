import { strength } from '../lib/crypto';

export default function StrengthBar({ password }: { password: string }) {
  const { score, label } = strength(password);
  const tone = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-400'][score];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${password && i < Math.max(1, score) ? tone : 'bg-white/10'}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Kekuatan: <span className="text-foreground">{label}</span></p>
    </div>
  );
}
