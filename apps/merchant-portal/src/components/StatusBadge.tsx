export function StopIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z" className="fill-destructive" />
      <rect x="6" y="10.5" width="12" height="3" rx="1" fill="white" />
    </svg>
  );
}

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold tracking-wide text-destructive">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
      </span>
      OVERDUE <StopIcon />
    </span>
  );
}
