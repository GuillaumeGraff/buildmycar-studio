import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { persona, personaSearch, EVENTS } from '@/components/atelier/platform';
import { DemoNote } from '@/components/atelier/personas';
import { MembersGate, MembersNav } from '@/components/atelier/members';

export const Route = createFileRoute('/owners-circle')({
  validateSearch: personaSearch,
  head: () => pageHead('The Owners’ Circle', 'After delivery, owners join a private circle of events, services, introductions and their next car.'),
  component: Circle,
});

const SERVICES = [
  { name: 'Collection & care', note: 'We collect the car, service it and bring it back.' },
  { name: 'Storage', note: 'Climate-controlled, in Munich, Dubai or Shanghai.' },
  { name: 'Restoration', note: 'Our partners care for the rest of your collection too.' },
];

function Circle() {
  const p = persona(Route.useSearch().p);
  return <MembersGate p={p}><CircleInside p={p}/></MembersGate>;
}

function CircleInside({ p }: { p: ReturnType<typeof persona> }) {
  const [ask, setAsk] = useState('');
  const [region, setRegion] = useState(0);
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!ask.trim()) return;
    toast('Your concierge has it', { description: 'A reply within the hour, in the full product.' });
    setAsk('');
  };
  return <div className="page">
    <div className="wrap page-head">
      <span className="label">The Owners’ Circle</span>
      <h2>After the car, <em>the circle.</em></h2>
      <p className="lead">A private circle for BMC owners: rare events, a concierge who knows the car, and the first word on the next car.</p>
      <MembersNav p={p}/>
    </div>
    <section className="flush"><div className="wrap circle">
      <div className="stack">
        <span className="label">Private events, open to every member</span>
        <div className="chips continents" role="radiogroup" aria-label="Continent">
          {EVENTS.map((c, i) => <button type="button" role="radio" aria-checked={region === i} key={c.continent} className="chip" onClick={() => setRegion(i)}>{c.continent}</button>)}
        </div>
        {EVENTS[region]!.events.map(e => <div className="event" key={e.name}><time>{e.date}</time><div><h3>{e.name}</h3><p className="event-place">{e.place}</p><p className="muted event-bmc">{e.bmc}</p></div>
          <button className="link" onClick={() => toast('Place reserved', { description: e.name })}>Reserve</button></div>)}
      </div>
      <div className="stack">
        <span className="label">Services</span>
        {SERVICES.map(s => <p key={s.name}><b className="ivory">{s.name}</b> · {s.note}</p>)}
        <form className="reply-box" onSubmit={send}>
          <label htmlFor="ask" className="label">Ask your concierge</label>
          <div className="row-gap"><input id="ask" value={ask} onChange={e => setAsk(e.target.value)} placeholder="A table, a track day, a transport…"/><button className="btn" type="submit">Send</button></div>
        </form>
      </div>
    </div></section>
    <section><div className="wrap quote">
      <span className="label">Your next car</span>
      <blockquote>Two build slots remain for 2028.</blockquote>
      <Link to="/book" className="btn solid">Reserve a conversation</Link>
      <p className="muted" style={{ fontSize: 13 }}>Members already sign in through the <Link to="/auth" className="link">Owners’ Circle login</Link>.</p>
      <DemoNote/>
    </div></section>
  </div>;
}
