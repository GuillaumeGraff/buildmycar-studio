import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { MODELS, PRESS, opt, type ModelId } from '@/components/atelier/data';
import vesperBordeaux from '@/assets/renders/brake-bordeaux.jpg';
import meridianJade from '@/assets/renders/gt-jade.jpg';
import cielArgent from '@/assets/renders/roadster-argent.jpg';
import sovereignNoir from '@/assets/renders/saloon-noir.jpg';

const featured = PRESS[0]!;

export const Route = createFileRoute('/')({ head: () => pageHead('Bespoke, beyond compare', 'Since 1981, BuildMyCar has built 20–30 bespoke luxury cars a year by hand in Munich, each one shaped with its owner.'), component: Home });

function Home() {
  return <div className="page">
    <div className="hero"><div className="wrap">
      <span className="label">BuildMyCar · Coachbuilders since 1981</span>
      <h1>Built by hand.<br/><em>Imagined by you.</em></h1>
      <HeroCars/>
      <div className="hero-actions"><Link to="/configure" className="btn solid">Configure your car</Link><Link to="/book" className="link">Or arrange a private rendezvous</Link></div>
    </div></div>
    <section><div className="wrap">
      <span className="label">The house</span>
      <h2 style={{ marginTop: 20 }}>Twenty to thirty cars a year.<br/><em>Never more.</em></h2>
      <div className="trio">
        <Link to="/heritage" className="door"><h3>Our heritage</h3><p>Four decades of coachbuilding in Munich, one client at a time.</p><span className="link">Discover</span></Link>
        <Link to="/studio" className="door"><h3>The studio</h3><p>Shape your car with a BMC designer and a master artisan, from wherever you live.</p><span className="link">Enter</span></Link>
        <Link to="/maison" className="door"><h3>The Maison</h3><p>Meet the six people who look after our clients, in their language.</p><span className="link">Meet them</span></Link>
      </div>
    </div></section>
    <Commissions/>
    <section><div className="wrap quote">
      <blockquote>“{featured.q}”</blockquote>
      <span className="label">{featured.by}</span>
      <Link to="/press" className="link" style={{ alignSelf: 'center' }}>Read the press</Link>
    </div></section>
  </div>;
}

// The five BMC cars draw themselves one after another, each fading out before the next.
const HERO_CARS = Object.keys(MODELS) as ModelId[];
function HeroCars() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const out = window.setTimeout(() => setLeaving(true), 7000);
    const next = window.setTimeout(() => { setLeaving(false); setI(n => (n + 1) % HERO_CARS.length); }, 7700);
    return () => { window.clearTimeout(out); window.clearTimeout(next); };
  }, [i]);
  const k = HERO_CARS[i]!;
  return <div className={`hero-car${leaving ? ' leaving' : ''}`}>
    <Car key={k} model={k} animated/>
    <p className="hero-car-name" key={`n-${k}`}><em>{MODELS[k].name}</em> · {MODELS[k].category}</p>
  </div>;
}

// Past commissions, one car per swipe: the proof a coachbuilder shows first. Illustrative, like every client story here.
const COMMISSIONS: { year: string; model: ModelId; paint: string; img: string; for: string; story: string }[] = [
  { year: '2024', model: 'saloon', paint: 'noir', img: sovereignNoir, for: 'For a family in Munich', story: 'Rear seats framed in walnut from a single Black Forest tree, signed by the marquetry master.' },
  { year: '2023', model: 'gt', paint: 'jade', img: meridianJade, for: 'For a collector in Shanghai', story: 'Forty coats of Fuzhou lacquer, with an auspicious cloud that appears only in direct sun.' },
  { year: '2022', model: 'roadster', paint: 'argent', img: cielArgent, for: 'For a founder in Los Angeles', story: 'A cabin like a camera: machined aluminium and hand-stitched saddle leather, no veneer anywhere.' },
  { year: '2021', model: 'brake', paint: 'bordeaux', img: vesperBordeaux, for: 'For two brothers in Dubai', story: 'A pair of Shooting Brakes, each with its own family emblem set in mother-of-pearl.' },
];

function Commissions() {
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
    const target = el?.children[(i + COMMISSIONS.length) % COMMISSIONS.length] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };
  return <section className="commissions"><div className="wrap">
    <span className="label">Past commissions</span>
    <h2 style={{ marginTop: 20 }}>Each one made <em>for one person.</em></h2>
    <ol className="eras-rail" ref={track} aria-label="Past commissions">
      {COMMISSIONS.map((c, i) => <li className={`era-card${active === i ? ' on' : ''}`} key={c.year} data-i={i}>
        <img src={c.img} alt={`BMC ${MODELS[c.model].name} in ${opt('paint', c.paint).name}`} loading="lazy"/>
        <div><time>{c.year}</time><h3>{MODELS[c.model].name} · <em>{opt('paint', c.paint).name}</em></h3><span className="label">{c.for}</span><p>{c.story}</p></div>
      </li>)}
    </ol>
    <div className="team-nav era-nav">
      <button className="arrow" aria-label="Previous commission" onClick={() => go(active - 1)}>‹</button>
      <span className="count"><b>{COMMISSIONS[active]!.year}</b> · {String(active + 1).padStart(2, '0')} / {String(COMMISSIONS.length).padStart(2, '0')}</span>
      <button className="arrow" aria-label="Next commission" onClick={() => go(active + 1)}>›</button>
    </div>
    <p className="disclaimer">Illustrative commissions and renders, created for this design study.</p>
  </div></section>;
}
