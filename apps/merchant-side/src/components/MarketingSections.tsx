import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, PlayCircle, Plus } from 'lucide-react';

const SF_LOGO = 'https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2026/05/logo-salesforce-no-type.svg?w=1024';
const WATCH_DEMO = 'https://www.salesforce.com/ap/small-business/demos/smb-overview/?d=pb&pr=';
const SF_HOME = 'https://www.salesforce.com';

const FAQS = [
  {
    q: 'What is CRM and why do I need one?',
    a: 'CRM helps businesses organise customer information, automate tasks, analyse data, and improve customer relationships.',
  },
  {
    q: 'What is agentic AI and how is it used in Salesforce?',
    a: 'Agentic AI can reason, plan, and perform tasks autonomously. Salesforce Agentforce supports workflow automation, sales predictions, and personalised customer interactions.',
  },
  {
    q: 'How does Salesforce CRM help my small business grow?',
    a: 'Salesforce provides scalable CRM solutions for small businesses, combining sales, service, marketing, automation, and customer management.',
  },
];

function Promo() {
  return (
    <div className="mt-8 rounded-3xl border bg-card p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-medium text-muted-foreground">Get started with the</p>
      <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">#1 AI CRM</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Your agents, your team, your data — working together so every customer interaction reflects your business at its best.
      </p>
      <a href={WATCH_DEMO} target="_blank" rel="noreferrer"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90">
        <PlayCircle className="h-5 w-5" /> Watch demo
      </a>
    </div>
  );
}

function PlatformCard() {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <img src={SF_LOGO} alt="Salesforce" className="h-10 w-auto" />
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Salesforce Platform</p>
      <h3 className="mt-2 text-xl font-extrabold text-slate-900">Enterprise intelligence runs on core systems</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Everything your business runs on, your data, models, and workflows, are connected from the start with trust that is built-in, not bolted on.
      </p>
      <a href={SF_HOME} target="_blank" rel="noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
        Explore the Agentic Platform <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border bg-card">
      <button type="button" onClick={onToggle} aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-foreground">
        <span>{q}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="mt-6 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <h3 className="text-xl font-extrabold text-foreground">Frequently Asked Questions</h3>
      <div className="mt-5">
        <h4 className="text-base font-bold text-foreground">What is Salesforce?</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Salesforce is the #1 AI CRM platform, connecting companies, customers, AI agents, data, and workflows across sales, service, marketing, commerce, and IT.
        </p>
      </div>
      <div className="mt-5 space-y-3">
        {FAQS.map((f, i) => (
          <FaqItem key={f.q} q={f.q} a={f.a} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
        ))}
      </div>
    </div>
  );
}

export default function MarketingSections() {
  return (
    <>
      <Promo />
      <PlatformCard />
      <Faq />
    </>
  );
}
