import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';
import { SIDES, CURATOR, REVENUE, EFFECTS, SCALES, NEVER, persona, personaSearch } from '@/components/atelier/platform';
import { PersonaBar, DemoNote } from '@/components/atelier/personas';
import { encode } from '@/components/atelier/data';

export const Route = createFileRoute('/platform')({
  validateSearch: personaSearch,
  head: () => pageHead('BMC Atelier', 'BMC Atelier: a private, curated platform that joins clients, the atelier, master artisans and service partners around every commission.'),
  component: Platform,
});

const OPEN = { '/studio': 'Enter the studio', '/passport': 'Open the passport', '/owners-circle': 'Visit the circle' } as const;

function Platform() {
  const p = persona(Route.useSearch().p);
  return <div className="page">
    <div className="wrap page-head">
      <span className="label">BMC Atelier</span>
      <h2>Your car, before, during <em>and long after.</em></h2>
      <p className="lead">One private place for every BMC client: shape the car with our designers and master artisans, follow its certified story, and join the owners who share it.</p>
      <div className="row-gap"><Link to="/book" className="btn solid">Start your creation</Link><Link to="/studio" search={{ p: p.id }} className="link">Enter the studio</Link></div>
    </div>

    <section className="flush"><div className="wrap">
      <div className="trio">
        <Link to="/studio" search={{ p: p.id }} className="door"><span className="label">During</span><h3>The studio</h3><p>Shape your car with a BMC designer and a master artisan, from wherever you live.</p><span className="link">Enter the studio</span></Link>
        <Link to="/passport" search={{ p: p.id }} className="door"><span className="label">At delivery</span><h3>The passport</h3><p>A certified record of who made your car, from what, and who has owned it.</p><span className="link">Open a passport</span></Link>
        <Link to="/owners-circle" search={{ p: p.id }} className="door"><span className="label">Long after</span><h3>The Owners’ Circle</h3><p>Rare events, a concierge who knows your car, and the first word on the next car.</p><span className="link">Visit the circle</span></Link>
      </div>
    </div></section>

    <section><div className="wrap">
      <span className="label">Choose a journey</span>
      <h2 style={{ marginTop: 20 }}>Four clients, <em>four paths through the house.</em></h2>
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
            : j.to === '/book' ? <Link to="/book" className="link">Start your creation</Link>
            : <Link to={j.to} search={{ p: p.id }} className="link">{OPEN[j.to]}</Link>}
        </li>)}
      </ol>
      <DemoNote/>
    </div></section>

    <section><div className="wrap">
      <span className="label">Behind the house</span>
      <h2 style={{ marginTop: 20, marginBottom: 48 }}>One curated circle, <em>four kinds of members.</em></h2>
      <div className="map">
        <div className="hub"><span className="label">The curator</span><h3>BMC</h3><p>{CURATOR}</p></div>
        {SIDES.map(s => <div className={`side ${s.id}`} key={s.id}>
          <h3>{s.name}</h3><p className="muted">{s.who}</p>
          <dl><dt>Bring</dt><dd>{s.give}</dd><dt>Receive</dt><dd>{s.get}</dd></dl>
        </div>)}
      </div>
      <div className="pillars" style={{ marginTop: 72 }}>
      <div className="pillar"><span className="label">How BMC earns</span>{REVENUE.map(r => <p key={r.name}><b className="ivory">{r.name}</b> · {r.note}</p>)}</div>
      <div className="pillar"><span className="label">Why it grows</span>{EFFECTS.map(e => <p key={e.name}><b className="ivory">{e.name}</b>, {e.then}.</p>)}<p>Quality of the network, never its size.</p></div>
      <div className="pillar scales">
        <span className="label">What scales</span>{SCALES.map(s => <p key={s}>{s}</p>)}
        <span className="label" style={{ marginTop: 18 }}>What never scales</span>{NEVER.map(s => <p key={s} className="ivory">{s}</p>)}
      </div>
      </div>
    </div></section>

  </div>;
}
