import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { RENDERS } from '@/components/atelier/renders';
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
        <Link to="/owners-circle" className="door"><h3>The Owners’ Circle</h3><p>For owners: follow your car as it is made, keep its passport, join the circle’s events.</p><span className="link">Enter</span></Link>
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

// From sketch to car: each BMC draws itself in gold, then its photograph develops in the same frame, like a print.
// Swipe, or tap a line below, to move to the next car; each one draws itself again.
const HERO_CARS = Object.keys(MODELS) as ModelId[];
const HERO_FINISH: Record<ModelId, string> = { gt: 'argent', roadster: 'bordeaux', brake: 'jade', saloon: 'noir', hyper: 'noir' };
function HeroCars() {
  const [i, setI] = useState(0);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<'sketch' | 'photo' | 'leaving'>('sketch');
  const [still, setStill] = useState(false);
  const from = useRef<number | null>(null);
  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (still) return;
    setPhase('sketch');
    const photo = window.setTimeout(() => setPhase('photo'), 5200);
    const out = window.setTimeout(() => setPhase('leaving'), 11000);
    const next = window.setTimeout(() => setI(n => (n + 1) % HERO_CARS.length), 11900);
    return () => { window.clearTimeout(photo); window.clearTimeout(out); window.clearTimeout(next); };
  }, [i, run, still]);
  const go = (n: number) => { setI((n + HERO_CARS.length) % HERO_CARS.length); setRun(r => r + 1); };
  const k = HERO_CARS[i]!;
  const finish = HERO_FINISH[k];
  return <div className={`hero-car ${phase}`}>
    <div className="hero-frame" role="group" aria-roledescription="carousel" aria-label="The BMC cars"
      onPointerDown={e => { from.current = e.clientX; }}
      onPointerCancel={() => { from.current = null; }}
      onPointerUp={e => {
        if (from.current === null) return;
        const dx = e.clientX - from.current;
        from.current = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }}>
      {HERO_CARS.map(id => RENDERS[id]?.[HERO_FINISH[id]] && <img key={id} className={`hero-print${id === k ? ' on' : ''}`} src={RENDERS[id]![HERO_FINISH[id]]} alt={id === k ? `BMC ${MODELS[id].name} in ${opt('paint', HERO_FINISH[id]).name}` : ''} decoding="async" draggable={false}/>)}
      <div className="hero-sketch-line"><Car key={`${k}-${run}`} model={k} animated/></div>
      <button className="hero-arrow prev" aria-label="Previous car" onClick={() => go(i - 1)}>‹</button>
      <button className="hero-arrow next" aria-label="Next car" onClick={() => go(i + 1)}>›</button>
      <div className="hero-caption">
        <p className="hero-car-name" key={`n-${k}`} aria-live="polite"><em>{MODELS[k].name}</em> · {MODELS[k].category}{phase === 'photo' && <span className="hero-finish"> · {opt('paint', finish).name}</span>}</p>
        <div className="hero-dots">
          {HERO_CARS.map((id, n) => <button key={id} aria-label={`Show the ${MODELS[id].name}`} aria-current={n === i ? 'true' : undefined} onClick={() => go(n)}>
            <i key={n === i ? `${run}-${i}` : undefined} className={n === i && !still ? 'run' : undefined}/>
          </button>)}
        </div>
      </div>
    </div>
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
