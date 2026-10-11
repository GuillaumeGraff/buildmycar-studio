import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { MODELS, PRESS, type ModelId } from '@/components/atelier/data';

const featured = PRESS[0]!;

export const Route = createFileRoute('/')({ head: () => pageHead('Bespoke, beyond compare', 'Since 1981, BuildMyCar has united human craftsmanship and digital precision in 20–30 bespoke luxury vehicles each year.'), component: Home });

function Home() {
  return <div className="page">
    <div className="hero"><div className="wrap">
      <span className="label">BuildMyCar · Coachbuilders since 1981</span>
      <h1>Where human craftsmanship<br/>meets <em>digital precision.</em></h1>
      <HeroCars/>
      <div className="row-gap center"><Link to="/configure" className="btn">Configure your car</Link><Link to="/book" className="btn solid">Start your creation</Link></div>
    </div></div>
    <section><div className="wrap">
      <span className="label">The house</span>
      <h2 style={{ marginTop: 20 }}>Twenty to thirty cars a year.<br/><em>Never more.</em></h2>
      <div className="trio">
        <Link to="/heritage" className="door"><h3>Our heritage</h3><p>Four decades of coachbuilding in Munich, one client at a time.</p><span className="link">Discover</span></Link>
        <Link to="/platform" className="door"><h3>BMC Atelier</h3><p>Co-create with master artisans, receive a certified passport, join the Owners’ Circle.</p><span className="link">Explore</span></Link>
        <Link to="/maison" className="door"><h3>The Maison</h3><p>Meet the six people who look after our clients, in their language.</p><span className="link">Meet them</span></Link>
      </div>
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
