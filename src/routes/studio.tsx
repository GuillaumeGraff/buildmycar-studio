import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { RENDERS } from '@/components/atelier/renders';
import { MODELS, TEAM, DEFAULTS, opt, encode, decode, myCar, type ModelId, type Selection } from '@/components/atelier/data';
import { DemoNote } from '@/components/atelier/personas';

export const Route = createFileRoute('/studio')({
  validateSearch: (s: Record<string, unknown>): { c?: string | undefined } => ({ c: typeof s['c'] === 'string' ? s['c'] : undefined }),
  head: () => pageHead('Co-creation studio', 'You, a BMC designer and a master artisan shape your car together, each from where you live.'),
  component: Studio,
});

// The master artisan who works the material the client chose.
const ARTISANS: Record<string, { name: string; craft: string; city: string; work: string }> = {
  walnut: { name: 'Johann Keller', craft: 'Marquetry master', city: 'Black Forest', work: 'I will cut the veneer from the same log, so the grain runs unbroken across the fascia' },
  ebony: { name: 'Johann Keller', craft: 'Marquetry master', city: 'Black Forest', work: 'I will book-match the ebony so the stripes meet in the centre of the fascia' },
  pearl: { name: 'Rami Haddad', craft: 'Mother-of-pearl inlay master', city: 'Dubai studio', work: 'I will set the shell by hand, piece by piece, in the fascia and the sill plates' },
  alu: { name: 'Elena Brandt', craft: 'Metal finisher', city: 'Munich atelier', work: 'I will brush the aluminium by hand in one direction, so it catches the light like silk' },
};
const FALLBACK = { model: 'gt' as ModelId, sel: { ...DEFAULTS, paint: 'jade' } };

function Studio() {
  const { c } = Route.useSearch();
  // Your own car: the one in the link, else the last one you shaped in the configurator.
  const [car, setCar] = useState<{ model: ModelId; sel: Selection; own: boolean }>(() => {
    const d = c ? decode(c) : null;
    return d ? { ...d, own: true } : { ...FALLBACK, own: false };
  });
  useEffect(() => {
    if (c && decode(c)) return;
    const mine = myCar();
    if (mine) setCar({ ...mine, own: true });
  }, [c]);
  return <Room key={encode(car.model, car.sel)} model={car.model} sel={car.sel} own={car.own}/>;
}

function Room({ model, sel, own }: { model: ModelId; sel: Selection; own: boolean }) {
  const m = MODELS[model];
  const paint = opt('paint', sel.paint), leather = opt('leather', sel.leather), material = opt('material', sel.material);
  const artisan = ARTISANS[sel.material] ?? ARTISANS['walnut']!;
  const designer = TEAM[1]!;
  const people = { client: 'You', designer: `${designer.name}, BMC design`, artisan: `${artisan.name}, ${artisan.craft}` };
  const [messages, setMessages] = useState<{ from: 'client' | 'designer' | 'artisan'; text: string; swatch?: string }[]>(() => [
    { from: 'designer', text: `Here is your ${m.name} in ${paint.name}, with ${leather.name} inside. The first full-size drawings are ready for you.` },
    { from: 'client', text: `Could the ${material.name.toLowerCase()} carry something personal, very discreet, that only I would notice?` },
    { from: 'artisan', text: `${artisan.work}, with your initials hidden where your hand rests. First sample here.`, swatch: material.hex },
  ]);
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
      <p className="lead">You, a BMC designer and a master artisan shape your car together, each from where you live.</p>
    </div>
    <div className="wrap room">
      <div className="room-car">
        {RENDERS[model]?.[sel.paint] ? <div className="stage-photo"><div className="layers"><img className="car on" src={RENDERS[model]![sel.paint]} alt={`Your BMC ${m.name} in ${paint.name}`}/></div></div>
          : <div className="fit-stage day"><div className="wrap"><Car model={model} paint={sel.paint} wheel={sel.wheel} leather={sel.leather}/></div></div>}
        <div className="room-meta">
          <span className="label">Your {m.name} · in design</span>
          <ul className="recap">
            <li><span>Finish</span><span>{paint.name} · {leather.name}</span></li>
            <li><span>Designer</span><span>{designer.name}, Munich</span></li>
            <li><span>Artisan</span><span>{artisan.name}, {artisan.city}</span></li>
          </ul>
          {!own && <p className="muted hint"><Link to="/configure" className="link">Configure your car</Link> and it will appear here.</p>}
          <div className="session"><span className="label">Next live session</span><p>Thursday · 17:00, by private video</p>
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
          <i style={{ background: material.hex }} aria-hidden="true"/>
          <div><span className="label">Proposal to approve</span><h3>Your initials in the {material.name.toLowerCase()}</h3><p className="muted">By {artisan.name.split(' ')[0]}, by hand, where your hand rests</p></div>
          {decision === 'open' ? <div className="row-gap">
            <button className="btn solid" onClick={() => { setDecision('approved'); toast('Approved · added to your passport'); }}>Approve</button>
            <button className="link" onClick={() => setDecision('changes')}>Ask for changes</button>
          </div> : <p className="decided">{decision === 'approved' ? <>Approved. It will be recorded in the car’s passport. <Link to="/passport" className="link">Open the passport</Link></> : 'Sent back to the artisan with your notes.'}</p>}
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
