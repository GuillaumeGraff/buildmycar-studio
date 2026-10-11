import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';
import { SIDES, CURATOR, REVENUE, EFFECTS, SCALES, NEVER, persona, personaSearch } from '@/components/atelier/platform';
import { PersonaBar, DemoNote } from '@/components/atelier/personas';
import { encode } from '@/components/atelier/data';

export const Route = createFileRoute('/platform')({
  validateSearch: personaSearch,
  head: () => pageHead('The platform', 'BMC Atelier: a private, curated platform that joins clients, the atelier, master artisans and service partners around every commission.'),
  component: Platform,
});

function Platform() {
  const p = persona(Route.useSearch().p);
  return <div className="page">
    <div className="wrap page-head">
      <span className="label">The platform</span>
      <h2>Small on cars. <em>Rich in relationships.</em></h2>
      <p className="lead">BMC Atelier is a private platform around every commission. Four circles meet there, and BMC curates each one.</p>
    </div>

    <section className="flush"><div className="wrap">
      <div className="map">
        <div className="hub"><span className="label">The curator</span><h3>BMC</h3><p>{CURATOR}</p></div>
        {SIDES.map(s => <div className={`side ${s.id}`} key={s.id}>
          <h3>{s.name}</h3><p className="muted">{s.who}</p>
          <dl><dt>Bring</dt><dd>{s.give}</dd><dt>Receive</dt><dd>{s.get}</dd></dl>
        </div>)}
      </div>
    </div></section>

    <section><div className="wrap pillars">
      <div className="pillar"><span className="label">How BMC earns</span>{REVENUE.map(r => <p key={r.name}><b className="ivory">{r.name}</b> · {r.note}</p>)}</div>
      <div className="pillar"><span className="label">Why it grows</span>{EFFECTS.map(e => <p key={e.name}><b className="ivory">{e.name}</b>, {e.then}.</p>)}<p>Quality of the network, never its size.</p></div>
      <div className="pillar scales">
        <span className="label">What scales</span>{SCALES.map(s => <p key={s}>{s}</p>)}
        <span className="label" style={{ marginTop: 18 }}>What never scales</span>{NEVER.map(s => <p key={s} className="ivory">{s}</p>)}
      </div>
    </div></section>

    <section><div className="wrap">
      <span className="label">Four clients, four journeys</span>
      <h2 style={{ marginTop: 20 }}>One house, <em>a different path for each.</em></h2>
      <PersonaBar to="/platform" current={p.id}/>
      <div className="persona-head">
        <h3>{p.name}, {p.age}</h3>
        <p className="lead">{p.tagline}</p>
        <p className="muted">Looks for: {p.need}</p>
      </div>
      <ol className="steps-line">
        {p.journey.map((j, i) => <li key={j.step}>
          <span className="label">{String(i + 1).padStart(2, '0')} · {j.step}</span>
          <p>{j.text}</p>
          {j.to === '/configure' ? <a href={`/configure?c=${encode(p.model, p.sel)}`} className="link">See the car</a>
            : j.to === '/book' ? <Link to="/book" className="link">Book a meeting</Link>
            : <Link to={j.to} search={{ p: p.id }} className="link">Open</Link>}
        </li>)}
      </ol>
      <DemoNote/>
    </div></section>
  </div>;
}
