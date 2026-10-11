import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { pageHead } from '@/components/bmc/metadata';
import { Portrait } from '@/components/atelier/portrait';
import { TEAM } from '@/components/atelier/data';

export const Route = createFileRoute('/maison')({ head: () => pageHead('The Maison', 'The six people who look after BuildMyCar clients, each in their own language.'), component: Maison });

function Maison() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Counts each time a member swipes into view on phone, so their sketch is drawn again.
  const [seen, setSeen] = useState<number[]>(() => TEAM.map(() => 0));

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Only the phone carousel redraws people as they swipe in; on a computer each sketch draws once.
    if (!window.matchMedia('(max-width: 640px)').matches) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = Number((e.target as HTMLElement).dataset['i']);
      setActive(i);
      setSeen(s => s.map((n, j) => (j === i ? n + 1 : n)));
    }), { root: el, threshold: 0.6 });
    el.querySelectorAll('.member').forEach(m => io.observe(m));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[(i + TEAM.length) % TEAM.length] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return <div className="page">
    <div className="wrap page-head">
      <span className="label">The Maison</span>
      <h2>The people behind <em>every car.</em></h2>
      <p className="lead">A small house by design. Six people look after our clients, in their own language, from Munich to Los Angeles, Dubai and Shanghai.</p>
    </div>
    <div className="wrap team-wrap">
      <div className="team" ref={track}>
        {TEAM.map((t, i) => <article className={`member${active === i ? ' on' : ''}`} key={t.name} data-i={i} aria-label={`${t.name}, ${t.role}`}>
          <div className="member-in" key={seen[i]}>
            <Portrait sketch={t.sketch}/>
            <h3>{t.name}</h3><span className="role">{t.role}</span><p>{t.text}</p><p className="langs">Speaks {t.languages.slice(0, -1).join(', ')} and {t.languages.at(-1)}</p>
            <span className="sig">{t.name.split(' ')[0]}</span>
            <Link to="/book" search={{ with: i }} className="link">Meet {t.name.split(' ')[0]}</Link>
          </div>
        </article>)}
      </div>
      <div className="team-nav">
        <button className="arrow" aria-label="Previous person" onClick={() => go(active - 1)}>‹</button>
        <span className="count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(TEAM.length).padStart(2, '0')}</span>
        <button className="arrow" aria-label="Next person" onClick={() => go(active + 1)}>›</button>
      </div>
      <div className="team-cta"><h3>Begin a project with the team.</h3><Link to="/book" className="btn solid">Start your creation</Link></div>
    </div>
  </div>;
}
