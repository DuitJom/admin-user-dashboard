const SF = 'https://www.salesforce.com';

const COLUMNS: { heading: string; links: string[] }[] = [
  { heading: 'Legal', links: ['Terms of Service', 'Privacy Information', 'Responsible Disclosure'] },
  { heading: 'Trust', links: ['Contact', 'Cookie Preferences', 'Your Privacy Choices'] },
];

export default function LegalFooter() {
  return (
    <footer className="mt-10 bg-[#061129] text-slate-300">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">{col.heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href={SF} target="_blank" rel="noreferrer" className="text-sm text-slate-400 transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-400">
          <p>© Copyright 2026 Salesforce, Inc. All rights reserved. Various trademarks held by their respective owners.</p>
          <p className="mt-2">Salesforce.com Singapore Pte Ltd. 5 Temasek Boulevard #13-01 Suntec Tower 5 Singapore 038985.</p>
        </div>
      </div>
    </footer>
  );
}
