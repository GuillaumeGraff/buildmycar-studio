import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import roadster from '@/assets/renders/roadster-argent.jpg';
import alu from '@/assets/details/material-alu.jpg';
import noir from '@/assets/renders/gt-noir.jpg';
import craft from '@/assets/bmc-craft.jpg';
import saloon from '@/assets/renders/saloon-jade.jpg';
import today from '@/assets/renders/brake-argent.jpg';

export const Route = createFileRoute('/heritage')({ head: () => pageHead('Heritage', 'Four decades of coachbuilding in Munich, one client and one car at a time.'), component: Heritage });

// The house's story, one chapter per swipe.
const ERAS = [
  { year: '1981', title: 'The first car', img: roadster, text: 'A panel beater and a trimmer open a two-bay workshop in Munich and build one roadster for one client. The rule is set: a car begins with a conversation, not a catalogue.' },
  { year: '1987', title: 'Shaped over wood', img: alu, text: 'Every aluminium body is beaten by hand over a wooden buck carved for that car alone. Coachwork alone takes more than two thousand hours.' },
  { year: '1994', title: 'Paint by hand', img: noir, text: 'The paint shop moves to rubbing every coat by hand between layers. Atelier Noir takes fourteen coats; lacquer from Fuzhou takes forty.' },
  { year: '2003', title: 'A circle of artisans', img: craft, text: 'Leather masters, marquetry makers and lacquer artists join the house, invited one car at a time, and sign the work they do.' },
  { year: '2014', title: 'The Owners’ Circle', img: saloon, text: 'Owners ask to meet one another. The first gathering, at Lake Como, becomes a circle of events, care and introductions for life.' },
  { year: 'Today', title: 'Begun from anywhere', img: today, text: 'A client in Shanghai or Los Angeles can shape a car with our designers from home. It is still built by hand, in Munich, twenty to thirty a year.' },
];

const HANDS = [
  ['4,000+', 'hours of hand work in every car'],
  ['11', 'craftspeople sign each one'],
  ['14 to 40', 'coats of paint, rubbed by hand'],
  ['1', 'wooden buck, carved for that car alone'],
];

function Heritage() {
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  // Counts each time a chapter swipes into view, so its words rise in again, as on the Maison.
  const [seen, setSeen] = useState<number[]>(() => ERAS.map(() => 0));

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = Number((e.target as HTMLElement).dataset['i']);
      setActive(i);
      setSeen(s => s.map((n, j) => (j === i ? n + 1 : n)));
    }), { root: el, threshold: 0.6 });
    el.querySelectorAll('.era-card').forEach(m => io.observe(m));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[(i + ERAS.length) % ERAS.length] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return <div className="page">
    <div className="wrap page-head heritage-head">
      <span className="label">Heritage · Munich since 1981</span>
      <h2>Four decades.<br/>One uncompromising <em>pursuit.</em></h2>
      <p className="lead">The most remarkable car is the one that could only belong to you.</p>
    </div>
    <div className="wrap">
      <ol className="eras-rail" ref={track} aria-label="Our story">
        {ERAS.map((e, i) => <li className={`era-card${active === i ? ' on' : ''}`} key={e.year} data-i={i}>
          <img src={e.img} alt="" loading="lazy"/>
          <div className="era-in" key={seen[i]}><time>{e.year}</time><h3>{e.title}</h3><p>{e.text}</p></div>
        </li>)}
      </ol>
      <div className="team-nav era-nav">
        <button className="arrow" aria-label="Previous chapter" onClick={() => go(active - 1)}>‹</button>
        <span className="count"><b>{ERAS[active]!.year}</b> · {String(active + 1).padStart(2, '0')} / {String(ERAS.length).padStart(2, '0')}</span>
        <button className="arrow" aria-label="Next chapter" onClick={() => go(active + 1)}>›</button>
      </div>
    </div>
    <section><div className="wrap">
      <span className="label">The hands behind each car</span>
      <dl className="hands">
        {HANDS.map(([n, t]) => <div key={t}><dt>{n}</dt><dd>{t}</dd></div>)}
      </dl>
    </div></section>
    <section><div className="wrap">
      <span className="label">What never changes</span>
      <div className="pillars" style={{ marginTop: 36 }}>
        <div className="pillar"><h3>One client, <em>one car.</em></h3><p>No series, no stock. Every BMC exists because one person asked for it.</p></div>
        <div className="pillar"><h3>Made by <em>hand.</em></h3><p>Coachwork, leather and wood are finished by craftspeople who sign their work.</p></div>
        <div className="pillar"><h3>Rare by <em>intention.</em></h3><p>Twenty to thirty cars a year. The relationship grows, the volume never does.</p></div>
      </div>
      <div className="row-gap" style={{ marginTop: 48 }}><Link to="/maison" className="btn">Meet the Maison</Link><Link to="/configure" className="link">Configure your car</Link></div>
    </div></section>
  </div>;
}
