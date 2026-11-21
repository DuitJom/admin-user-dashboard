import { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import { Faq, Features } from '../components/landing/Sections';
import Footer from '../components/landing/Footer';
import { Lang } from '../lib/i18n';

export default function Landing() {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('bv:lang') as Lang) || 'ms');
  const setLang = (l: Lang) => {
    localStorage.setItem('bv:lang', l);
    setLangState(l);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <Features lang={lang} />
      <Faq lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
