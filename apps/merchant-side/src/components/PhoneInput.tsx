import { useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@project/components/ui/popover';
import { Input } from '@project/components/ui/input';
import { cn } from '@project/components/lib/utils';
import { COUNTRIES, Country, DEFAULT_COUNTRY } from './countries';

function Flag({ iso2, className }: { iso2: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${iso2}.png`}
      srcSet={`https://flagcdn.com/w80/${iso2}.png 2x`}
      alt=""
      aria-hidden
      className={cn('h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-black/10', className)}
      loading="lazy"
    />
  );
}

interface Props {
  country: Country;
  onCountryChange: (c: Country) => void;
  value: string;
  onChange: (v: string) => void;
}

export default function PhoneInput({ country, onCountryChange, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const dq = q.replace(/\+/g, '');
    const scored = COUNTRIES
      .map((c) => {
        const name = c.name.toLowerCase();
        const dial = c.dial.replace('+', '');
        let score = -1;
        if (name.startsWith(q)) score = 0;
        else if (name.includes(q)) score = 1;
        else if (dq && dial.startsWith(dq)) score = 2;
        else if (dq && dial.includes(dq)) score = 3;
        return { c, score };
      })
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name));
    return scored.map((r) => r.c);
  }, [query]);

  const placeholder = country.example ?? 'Phone number';

  return (
    <div className="flex">
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setTimeout(() => searchRef.current?.focus(), 50); else setQuery(''); }}>
        <PopoverTrigger asChild>
          <button type="button"
            className="flex h-12 items-center gap-2 rounded-l-xl border border-r-0 border-input bg-muted px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Flag iso2={country.iso2} />
            <span className="tabular-nums">{country.dial}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[300px] p-0">
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country or code"
              className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No countries found.</p>}
            {results.map((c) => (
              <button key={c.iso2 + c.dial} type="button"
                onClick={() => { onCountryChange(c); setOpen(false); setQuery(''); }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent">
                <Flag iso2={c.iso2} />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="tabular-nums text-muted-foreground">{c.dial}</span>
                {c.iso2 === country.iso2 && c.dial === country.dial && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Input
        className="h-12 rounded-l-none rounded-r-xl"
        inputMode="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 15))}
      />
    </div>
  );
}
