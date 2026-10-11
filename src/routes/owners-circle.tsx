import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { persona, personaSearch, EVENTS } from '@/components/atelier/platform';
import { DemoNote } from '@/components/atelier/personas';
import { MembersGate, MembersRoom, Tabs } from '@/components/atelier/members';

export const Route = createFileRoute('/owners-circle')({
  validateSearch: personaSearch,
  head: () => pageHead('The Owners’ Circle', 'After delivery, owners join a private circle of events, services, introductions and their next car.'),
  component: Circle,
});

const SERVICES = [
  { name: 'Collection & care', note: 'Collected, serviced, returned' },
  { name: 'Storage', note: 'Munich, Dubai or Shanghai' },
  { name: 'Restoration', note: 'For the rest of your collection' },
];
const PARTS = ['Events', 'Concierge'] as const;

function Circle() {
  const p = persona(Route.useSearch().p);
  return <MembersGate p={p}><CircleInside p={p}/></MembersGate>;
}

function CircleInside({ p }: { p: ReturnType<typeof persona> }) {
  const [part, setPart] = useState<(typeof PARTS)[number]>('Events');
  const [region, setRegion] = useState(EVENTS[0]!.continent);
  const [open, setOpen] = useState<string | null>(null);
  const [ask, setAsk] = useState('');
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!ask.trim()) return;
    toast('Your concierge has it', { description: 'A reply within the hour, in the full product.' });
    setAsk('');
  };
  const events = EVENTS.find(c => c.continent === region)!.events;
  return <MembersRoom p={p} title={<>The <em>circle.</em></>}>
    <Tabs items={PARTS} value={part} onChange={setPart} label="The circle"/>
    {part === 'Events' ? <div className="panel" role="tabpanel">
      <Tabs small items={EVENTS.map(c => c.continent)} value={region} onChange={r => { setRegion(r); setOpen(null); }} label="Continent"/>
      <ul className="event-list">
        {events.map(e => {
          const on = open === e.name;
          return <li key={e.name} className={on ? 'on' : undefined}>
            <button type="button" className="event-row" aria-expanded={on} onClick={() => setOpen(on ? null : e.name)}>
              <time>{e.date}</time><span><b>{e.name}</b><small>{e.place}</small></span>
            </button>
            {on && <div className="event-more"><p>{e.bmc}</p>
              <button className="link" onClick={() => toast('Place reserved', { description: e.name })}>Reserve a place</button></div>}
          </li>;
        })}
      </ul>
    </div> : <div className="panel" role="tabpanel">
      <ul className="recap">{SERVICES.map(s => <li key={s.name}><span>{s.name}</span><span>{s.note}</span></li>)}</ul>
      <form className="reply-box" onSubmit={send}>
        <label htmlFor="ask" className="label">Ask your concierge</label>
        <div className="row-gap"><input id="ask" value={ask} onChange={e => setAsk(e.target.value)} placeholder="A table, a track day, a transport…"/><button className="btn" type="submit">Send</button></div>
      </form>
      <div className="next-car"><span className="label">Your next car</span><p>Two build slots remain for 2028.</p><Link to="/book" className="link">Reserve a conversation</Link></div>
    </div>}
    <DemoNote/>
  </MembersRoom>;
}
