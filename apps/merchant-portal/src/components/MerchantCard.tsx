import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@project/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { Label } from '@project/components/ui/label';
import { BadgeCheck, Building2, Globe, Hash, MapPin, Phone, Briefcase, Tag } from 'lucide-react';

const MAPS = 'https://maps.google.com/maps/place//data=!4m2!3m1!1s0x304ac5c47c1e91ed:0x865f1174ab57e5f7?entry=s&sa=X&ved=2ahUKEwiGg9XRkc6XAxWf1DgGHTGcAosQ4kB6BAgEEAA&hl=en';

const BRANDS = ['DUITJOM', 'RCASH', 'LAJUDANA', 'PINJAMGO', 'ADAWANG', 'MESRA DUIT', 'QUICKLOAN', 'EZYLOAN'];

function InfoCard({ icon: Icon, label, children, verified }: { icon: typeof Globe; label: string; children: React.ReactNode; verified?: boolean }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {verified && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified
          </span>
        )}
      </div>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export default function MerchantCard({ onBack, onContinue, continueLabel = 'Continue' }: { onBack: () => void; onContinue: () => void; continueLabel?: string }) {
  const [brand, setBrand] = useState('');
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
        <BadgeCheck className="h-4 w-4" /> Creditor / Merchant record : 1 Found.
      </div>

      <InfoCard icon={Globe} label="Product" verified>
        <p className="text-lg font-bold">RCASH / Finance</p>
        <a href="https://www.rcash.my" target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-primary hover:underline">
          <Globe className="h-4 w-4" /> www.rcash.my
        </a>
      </InfoCard>

      <InfoCard icon={Building2} label="Company" verified>
        <p className="font-bold">GETMORE RESOURCES SDN BHD</p>
        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground"><Hash className="h-3.5 w-3.5" /> SSM: 202101021538 / 1421838-P</p>
        <p className="mt-1 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> +60 16-534 9363</p>
        <p className="mt-1 flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Service: Financial Product</p>
      </InfoCard>

      <InfoCard icon={MapPin} label="Address">
        <p>47A Tingkat, Bandar Sunway, 1, Jln Todak 4, Seberang Jaya, 13700 Perai, Pulau Pinang.</p>
        <a href={MAPS} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-primary hover:underline">
          <MapPin className="h-4 w-4" /> Open in Google Maps
        </a>
      </InfoCard>

      <InfoCard icon={Tag} label="Select Brand">
        <p className="mb-2 text-sm text-muted-foreground">Please choose a brand to continue.</p>
        <Label htmlFor="brand-select" className="sr-only">Brand</Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger id="brand-select" className="h-12 rounded-xl">
            <SelectValue placeholder="Choose a brand..." />
          </SelectTrigger>
          <SelectContent>
            {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </InfoCard>

      <div className="flex justify-between gap-3 pt-1">
        <Button variant="outline" onClick={onBack} className="rounded-xl">Go back</Button>
        <Button onClick={onContinue} disabled={!brand} className="rounded-xl">{continueLabel}</Button>
      </div>
    </motion.div>
  );
}
