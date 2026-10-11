import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { RENDERS } from '@/components/atelier/renders';
import { MODELS, TEAM } from '@/components/atelier/data';
import { persona, personaSearch } from '@/components/atelier/platform';
import { PersonaBar, DemoNote } from '@/components/atelier/personas';
import { MembersGate, MembersNav } from '@/components/atelier/members';

export const Route = createFileRoute('/studio')({
  validateSearch: personaSearch,
  head: () => pageHead('Co-creation studio', 'Client, BMC designer and master artisan on one car, wherever each of them lives.'),
  component: Studio,
});

function Studio() {
  const p = persona(Route.useSearch().p);
  return <MembersGate p={p}><Room key={p.id} id={p.id}/></MembersGate>;
}

function Room({ id }: { id: string }) {
  const p = persona(id);
  const designer = TEAM[1]!;
  const people = { client: p.name, designer: `${designer.name}, BMC design`, artisan: `${p.artisan.name}, ${p.artisan.craft}` };
  const [messages, setMessages] = useState(p.studio);
  const [draft, setDraft] = useState('');
  const [decision, setDecision] = useState<'open' | 'approved' | 'changes'>('open');

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages([...messages, { from: 'client', text: draft.trim() }]);
    setDraft('');
  };

  return <div className="page">
    <div className="wrap page-head">
      <span className="label">Co-creation studio</span>
      <h2>One car. <em>Three hands.</em></h2>
      <p className="lead">The client, a BMC designer and a master artisan shape the car together, each from where they live.</p>
      <MembersNav p={p}/>
      <PersonaBar to="/studio" current={p.id}/>
    </div>
    <div className="wrap room">
      <div className="room-car">
        {RENDERS[p.model]?.[p.sel.paint] ? <div className="stage-photo"><div className="layers"><img className="car on" src={RENDERS[p.model]![p.sel.paint]} alt={`BMC ${MODELS[p.model].name}`}/></div></div>
          : <div className="fit-stage day"><div className="wrap"><Car model={p.model} paint={p.sel.paint} wheel={p.sel.wheel} leather={p.sel.leather}/></div></div>}
        <div className="room-meta">
          <span className="label">{MODELS[p.model].name} · example client, {p.city}</span>
          <ul className="recap">
            <li><span>Client</span><span>{p.name}, {p.city}</span></li>
            <li><span>Designer</span><span>{designer.name}, Munich</span></li>
            <li><span>Artisan</span><span>{p.artisan.name}, {p.artisan.city}</span></li>
            <li><span>Language</span><span>{p.language}</span></li>
          </ul>
          <div className="session"><span className="label">Next live session</span><p>{p.session}</p>
            <button className="btn" onClick={() => toast('Session reserved', { description: 'In the full product this opens a private video room.' })}>Join the session</button></div>
        </div>
      </div>
      <div className="room-feed">
        <ol className="feed">
          {messages.map((m, i) => <li key={i} className={m.from}>
            <span className="who">{people[m.from]}</span>
            <p>{m.text}</p>
            {m.swatch && <i className="sample" style={{ background: m.swatch }} aria-hidden="true"/>}
          </li>)}
        </ol>
        <div className={`proposal ${decision}`}>
          <i style={{ background: p.proposal.swatch }} aria-hidden="true"/>
          <div><span className="label">Proposal to approve</span><h3>{p.proposal.title}</h3><p className="muted">{p.proposal.note}</p></div>
          {decision === 'open' ? <div className="row-gap">
            <button className="btn solid" onClick={() => { setDecision('approved'); toast('Approved · added to your passport'); }}>Approve</button>
            <button className="link" onClick={() => setDecision('changes')}>Ask for changes</button>
          </div> : <p className="decided">{decision === 'approved' ? <>Approved. It will be recorded in the car’s passport. <Link to="/passport" search={{ p: p.id }} className="link">Open the passport</Link></> : 'Sent back to the artisan with your notes.'}</p>}
        </div>
        <form className="reply-box" onSubmit={send}>
          <label htmlFor="msg" className="label">Write to the studio</label>
          <div className="row-gap"><input id="msg" value={draft} onChange={e => setDraft(e.target.value)} placeholder="A thought, a reference, a memory…"/><button className="btn" type="submit">Send</button></div>
        </form>
        <DemoNote/>
      </div>
    </div>
  </div>;
}
