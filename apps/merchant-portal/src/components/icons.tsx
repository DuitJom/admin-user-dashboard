import { motion } from 'framer-motion';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="10" className="fill-primary" />
      <path d="M12 26c0-6 4-11 9-11 3 0 5 1.5 6.5 3.5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="27" cy="25" r="3.5" className="fill-accent" />
    </svg>
  );
}

export function LiveCheck({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Valid">
      <motion.circle cx="12" cy="12" r="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
      <motion.path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.3 }} />
    </svg>
  );
}

export function LiveCross({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Incomplete">
      <motion.circle cx="12" cy="12" r="10" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
      <motion.path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2.4"
        strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.3 }} />
    </svg>
  );
}
