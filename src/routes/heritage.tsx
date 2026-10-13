import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Cat } from '@/components/atelier/cat';
import type { KittenId } from '@/components/atelier/data';

export const Route = createFileRoute('/heritage')({ head: () => pageHead('Heritage', 'Four decades of matchmaking in Munich, one cat and one home at a time.'), component: Heritage });

// The house's story, one chapter per swipe.
const ERAS: { year: string; title: string; cat: KittenId; coat: string; text: string }[] = [
  { year: '1981', title: 'The first cat', cat: 'loaf', coat: 'silver', text: 'Two Munich coachbuilders find a kitten asleep in the wheel arch of a roadster. They keep her, name her Spanner, and set the rule: a cat begins with a conversation, not a catalogue.' },
  { year: '1987', title: 'Matched by hand', cat: 'aristocrat', coat: 'cream', text: 'Every adopter meets every cat in person, on the floor, for as long as the cat decides. We still turn down a third of requests, politely.' },
  { year: '1994', title: 'The foster families', cat: 'lap', coat: 'ginger', text: 'Twelve Munich households begin raising kittens until they are ready. Today there are 140, and a waiting list of sofas.' },
  { year: '2003', title: 'The house vet', cat: 'explorer', coat: 'noir', text: 'Dr Lena Brandt joins the house and signs every health record by hand. Vaccines, chip and a first check-up come with every cat.' },
  { year: '2014', title: 'The passport', cat: 'lap', coat: 'noir', text: 'Every cat now leaves with its passport: where it was found, who fostered it, what it will and will not eat. Adopters asked; the cats did not object.' },
  { year: 'Today', title: 'Adopted from anywhere', cat: 'zoomies', coat: 'ginger', text: 'A family in Shanghai or Los Angeles can meet a cat by video first. Each one still goes home in person, twenty to thirty a month.' },
];

const HANDS = [
  ['4,000+', 'cats rehomed since 1981'],
  ['140', 'foster families in Munich'],
  ['16', 'hours of sleep a day, on average'],
  ['1', 'home per cat, for life'],
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
      <h2>Four decades.<br/>One uncompromising <em>nap.</em></h2>
      <p className="lead">The most remarkable cat is the one that chose you.</p>
    </div>
    <div className="wrap">
      <ol className="eras-rail" ref={track} aria-label="Our story">
        {ERAS.map((e, i) => <li className={`era-card${active === i ? ' on' : ''}`} key={e.year} data-i={i}>
          <div className="era-art"><Cat kitten={e.cat} coat={e.coat}/></div>
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
      <span className="label">The hands behind each adoption</span>
      <dl className="hands">
        {HANDS.map(([n, t]) => <div key={t}><dt>{n}</dt><dd>{t}</dd></div>)}
      </dl>
    </div></section>
    <section><div className="wrap">
      <span className="label">What never changes</span>
      <div className="pillars" style={{ marginTop: 36 }}>
        <div className="pillar"><h3>One cat, <em>one home.</em></h3><p>No catalogue, no stock. Every adoption exists because one person and one cat agreed on it.</p></div>
        <div className="pillar"><h3>Matched by <em>hand.</em></h3><p>Matchmakers, foster families and our vet sign every passport they work on.</p></div>
        <div className="pillar"><h3>Never <em>rushed.</em></h3><p>Twenty to thirty adoptions a month. The waiting list grows, the hurry never does.</p></div>
      </div>
      <div className="row-gap" style={{ marginTop: 48 }}><Link to="/maison" className="btn">Meet the Maison</Link><Link to="/configure" className="link">Configure your kitten</Link></div>
    </div></section>
  </div>;
}
