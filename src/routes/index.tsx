import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { MODELS, PRESS, type ModelId } from '@/components/atelier/data';
import gtNoir from '@/assets/renders/gt-noir.jpg';
import roadsterJade from '@/assets/renders/roadster-jade.jpg';
import brakeBordeaux from '@/assets/renders/brake-bordeaux.jpg';
import saloonArgent from '@/assets/renders/saloon-argent.jpg';

const featured = PRESS[0]!;

// Example commissions to show the range of the house. Illustrative stories, not real clients.
const PAST = [
  { model: 'gt', img: gtNoir, where: 'Geneva · 2024', story: 'A collector asked for the quiet of a library: Atelier Noir, walnut from the family estate, no badge anywhere.' },
  { model: 'roadster', img: roadsterJade, where: 'Lake Como · 2023', story: 'An open car for summer evenings on the lake, in a green matched to the water at dusk.' },
  { model: 'brake', img: brakeBordeaux, where: 'Dubai · 2025', story: 'A shooting brake for a falconer, with a hand-stitched leather perch behind the seats.' },
  { model: 'saloon', img: saloonArgent, where: 'Shanghai · 2022', story: 'A saloon for three generations of one family, with rear seats shaped for the grandparents.' },
] as const;

export const Route = createFileRoute('/')({ head: () => pageHead('Bespoke, beyond compare', 'Since 1981, BuildMyCar has built 20–30 bespoke luxury cars a year by hand in Munich, each one shaped with its owner.'), component: Home });

function Home() {
  return <div className="page">
    <div className="hero"><div className="wrap">
      <span className="label">BuildMyCar · Coachbuilders since 1981</span>
      <h1>Built by hand.<br/><em>Imagined by you.</em></h1>
      <HeroCars/>
      <div className="row-gap center hero-actions"><Link to="/configure" className="btn solid">Configure your car</Link><Link to="/book" className="link">Private rendezvous</Link></div>
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
    <section><div className="wrap">
      <span className="label">Past commissions · illustrative</span>
      <ol className="commission-rail" aria-label="Past commissions">
        {PAST.map(c => <li className="commission-card" key={c.model}>
          <img src={c.img} alt={`BMC ${MODELS[c.model].name}, illustrative render`} loading="lazy"/>
          <div><span className="label">{MODELS[c.model].name} · {c.where}</span><p>{c.story}</p></div>
        </li>)}
      </ol>
    </div></section>
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
