import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Cat } from '@/components/atelier/cat';
import { KITTENS, opt, type KittenId } from '@/components/atelier/data';

export const Route = createFileRoute('/')({ head: () => pageHead('Rescued by hand, loved by you', 'Since 1981, BuildMyCat has matched cats with their people by hand in Munich, one adoption at a time.'), component: Home });

function Home() {
  return <div className="page">
    <div className="hero"><div className="wrap">
      <span className="label">BuildMyCat · Matchmakers since 1981</span>
      <h1>Rescued by hand.<br/><em>Loved by you.</em></h1>
      <HeroCats/>
      <div className="hero-actions"><Link to="/configure" className="btn solid">Configure your kitten</Link><Link to="/book" className="link">Or meet a cat in person</Link></div>
    </div></div>
    <section><div className="wrap">
      <span className="label">The house</span>
      <h2 style={{ marginTop: 20 }}>Twenty to thirty adoptions a month.<br/><em>Never rushed.</em></h2>
      <div className="trio">
        <Link to="/heritage" className="door"><h3>Our heritage</h3><p>Four decades of matchmaking in Munich, one cat and one home at a time.</p><span className="link">Discover</span></Link>
        <Link to="/passport" className="door"><h3>The passport</h3><p>Every cat leaves with its story: where it was found, who fostered it, what it will and will not eat.</p><span className="link">Open one</span></Link>
        <Link to="/maison" className="door"><h3>The Maison</h3><p>Meet the six people who look after our adopters, in their language.</p><span className="link">Meet them</span></Link>
      </div>
    </div></section>
    <Adoptions/>
  </div>;
}

// From sketch to kitten: each temperament draws itself in gold, then its coat fills in and its eyes open.
const HERO_CATS = Object.keys(KITTENS) as KittenId[];
const HERO_COAT: Record<KittenId, string> = { lap: 'noir', explorer: 'silver', loaf: 'ginger', aristocrat: 'cream', zoomies: 'noir' };
const HERO_EYES: Record<KittenId, string> = { lap: 'amber', explorer: 'sapphire', loaf: 'emerald', aristocrat: 'odd', zoomies: 'amber' };
function HeroCats() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'sketch' | 'coat' | 'leaving'>('sketch');
  const [still, setStill] = useState(false);
  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (still) return;
    setPhase('sketch');
    const coat = window.setTimeout(() => setPhase('coat'), 3600);
    const out = window.setTimeout(() => setPhase('leaving'), 8600);
    const next = window.setTimeout(() => setI(n => (n + 1) % HERO_CATS.length), 9400);
    return () => { window.clearTimeout(coat); window.clearTimeout(out); window.clearTimeout(next); };
  }, [i, still]);
  const k = HERO_CATS[i]!;
  return <div className={`hero-cat ${phase}`}>
    <div className="hero-frame">
      <div className="hero-sketch-line"><Cat key={k} kitten={k} coat={HERO_COAT[k]} eyes={HERO_EYES[k]} animated/></div>
    </div>
    <p className="hero-cat-name" key={`n-${k}`}><em>{KITTENS[k].name}</em> · {KITTENS[k].category}{phase === 'coat' && <span className="hero-finish"> · {opt('coat', HERO_COAT[k]).name}</span>}</p>
  </div>;
}

// Recent adoptions, one cat per swipe: the proof a cat house shows first. Illustrative, like every story here.
const ADOPTIONS: { year: string; name: string; kitten: KittenId; coat: string; eyes: string; for: string; story: string }[] = [
  { year: '2026', name: 'Otto', kitten: 'lap', coat: 'noir', eyes: 'amber', for: 'For a gentleman in Munich', story: 'Found asleep in the wheel arch of a 1964 roadster. Now asleep on a 1964 armchair, through four evenings of Wagner.' },
  { year: '2025', name: 'Mochi', kitten: 'loaf', coat: 'ginger', eyes: 'emerald', for: 'For a collector in Shanghai', story: 'Ginger for good fortune, home on the 8th, and permanently loafed on a silk cushion she was told not to touch.' },
  { year: '2025', name: 'Pixel', kitten: 'explorer', coat: 'silver', eyes: 'sapphire', for: 'For a founder in Los Angeles', story: 'Adopted by video between two board meetings. Has since attended both, and walked across every slide.' },
  { year: '2024', name: 'Zafran & Noor', kitten: 'aristocrat', coat: 'cream', eyes: 'odd', for: 'For two brothers in Dubai', story: 'Two littermates, one for each brother, who meet every Friday and ignore both brothers equally.' },
];

function Adoptions() {
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset['i']));
    }), { root: el, threshold: 0.6 });
    el.querySelectorAll('.era-card').forEach(m => io.observe(m));
    return () => io.disconnect();
  }, []);
  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[(i + ADOPTIONS.length) % ADOPTIONS.length] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };
  return <section className="commissions"><div className="wrap">
    <span className="label">Recent adoptions</span>
    <h2 style={{ marginTop: 20 }}>Each one <em>for one home.</em></h2>
    <ol className="eras-rail" ref={track} aria-label="Recent adoptions">
      {ADOPTIONS.map((a, i) => <li className={`era-card${active === i ? ' on' : ''}`} key={a.name} data-i={i}>
        <div className="era-art"><Cat kitten={a.kitten} coat={a.coat} eyes={a.eyes}/></div>
        <div><time>{a.year}</time><h3>{a.name} · <em>{opt('coat', a.coat).name}</em></h3><span className="label">{a.for}</span><p>{a.story}</p></div>
      </li>)}
    </ol>
    <div className="team-nav era-nav">
      <button className="arrow" aria-label="Previous adoption" onClick={() => go(active - 1)}>‹</button>
      <span className="count"><b>{ADOPTIONS[active]!.year}</b> · {String(active + 1).padStart(2, '0')} / {String(ADOPTIONS.length).padStart(2, '0')}</span>
      <button className="arrow" aria-label="Next adoption" onClick={() => go(active + 1)}>›</button>
    </div>
    <p className="disclaimer">Illustrative adoptions and drawings, created for this design study.</p>
  </div></section>;
}
