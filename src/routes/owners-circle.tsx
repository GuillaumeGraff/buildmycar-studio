import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { persona, personaSearch } from '@/components/atelier/platform';
import { PersonaBar, DemoNote } from '@/components/atelier/personas';

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

// Demo sign-in: shows that the circle sits behind a members' login, without a real account.
const DEMO_KEY = 'bmc-demo-circle';
const demoEmail = (name: string) => `${name.toLowerCase().normalize('NFD').replace(/[^a-z ]/g, '').trim().replace(/ +/g, '.')}@members.bmc`;

function Circle() {
  const p = persona(Route.useSearch().p);
  const [inside, setInside] = useState(false);
  const [checking, setChecking] = useState(false);
  useEffect(() => { try { setInside(sessionStorage.getItem(DEMO_KEY) === '1'); } catch { /* storage blocked */ } }, []);
  const enter = (e: FormEvent) => {
    e.preventDefault();
    setChecking(true);
    window.setTimeout(() => {
      try { sessionStorage.setItem(DEMO_KEY, '1'); } catch { /* storage blocked */ }
      setChecking(false);
      setInside(true);
      window.scrollTo({ top: 0 });
    }, 900);
  };
  const leave = () => { try { sessionStorage.removeItem(DEMO_KEY); } catch { /* storage blocked */ } setInside(false); };
  if (!inside) return <div className="page"><div className="wrap narrow page-head gate">
    <span className="label">Members only</span>
    <h2>The Owners’ <em>Circle.</em></h2>
    <p className="lead">A private place for BMC owners. Membership comes with the keys to your car.</p>
    <form className="stack gate-form" onSubmit={enter}>
      <div className="entry"><label htmlFor="gmail">Member email</label><input id="gmail" readOnly value={demoEmail(p.name)}/></div>
      <div className="entry"><label htmlFor="gpass">Password</label><input id="gpass" type="password" readOnly value="demo-member"/></div>
      <button className="btn solid" type="submit" disabled={checking}>{checking ? 'Opening the circle…' : 'Enter the circle'}</button>
    </form>
    <p className="disclaimer">Demo access: the details are filled in for you as {p.name}, and no account is created. Real members sign in through the <Link to="/auth" className="link">Owners’ Circle login</Link>.</p>
  </div></div>;
  return <CircleInside p={p} leave={leave}/>;
}

function CircleInside({ p, leave }: { p: ReturnType<typeof persona>; leave: () => void }) {
  const [ask, setAsk] = useState('');
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
      <PersonaBar to="/owners-circle" current={p.id}/>
      <button className="link" onClick={leave}>Sign out</button>
    </div>
    <section className="flush"><div className="wrap circle">
      <div className="stack">
        <span className="label">For {p.name}, near {p.city}</span>
        {p.events.map(e => <div className="event" key={e.name}><time>{e.date}</time><div><h3>{e.name}</h3><p className="muted">{e.place}</p></div>
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
      <blockquote>Two build slots remain for 2030.</blockquote>
      <Link to="/book" className="btn solid">Reserve a conversation</Link>
      <p className="muted" style={{ fontSize: 13 }}>Members already sign in through the <Link to="/auth" className="link">Owners’ Circle login</Link>.</p>
      <DemoNote/>
    </div></section>
  </div>;
}
