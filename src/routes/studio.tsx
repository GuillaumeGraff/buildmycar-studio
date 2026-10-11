import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { RENDERS } from '@/components/atelier/renders';
import { MODELS, TEAM, DEFAULTS, opt, encode, decode, myCar, type ModelId, type Selection } from '@/components/atelier/data';
import { DemoNote } from '@/components/atelier/personas';
import { persona } from '@/components/atelier/platform';
import { MembersGate, MembersNav } from '@/components/atelier/members';

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
// Where the car is on its way to you; the studio shows it in the design stage.
const STAGES = ['Design', 'Coachwork', 'Paint', 'Interior', 'Road test', 'Handover'];
const NOW = 0;
const ago = (days: number) => { const d = new Date(); d.setDate(d.getDate() - days); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

// What the designer would add to this particular car, and why.
type Touch = { id: string; title: string; why: string };
function advice(model: ModelId, sel: Selection): Touch[] {
  const paint: Record<string, Touch> = {
    noir: { id: 'coachline', title: 'A hand-painted gold coachline', why: 'One hairline along the waist, painted with a squirrel brush. On Atelier Noir it catches the light only at dusk.' },
    jade: { id: 'cloud', title: 'A cloud motif in the lacquer', why: 'Laid in the last coats of the jade, so it only shows in direct sun.' },
    bordeaux: { id: 'piping', title: 'Bordeaux piping on the seats', why: 'A thin line of the body colour on every seat edge ties the cabin to the paint.' },
    argent: { id: 'sill', title: 'A 1981 sill plate', why: 'Engraved with the founding year, as on the first BMC, in polished silver.' },
  };
  const seat: Touch = sel.seat && sel.seat !== 'smooth'
    ? { id: 'luggage', title: 'Fitted luggage in your leather', why: `Cut from the same hides as your ${opt('leather', sel.leather).name}, shaped to the boot of the ${MODELS[model].name}.` }
    : { id: 'quilt', title: 'Diamond quilting in the rear', why: 'Keep the front seats smooth and quilt only the rear. It reads as calm from the driver’s seat.' };
  const sound: Touch = sel.sound && sel.sound !== 'salon'
    ? { id: 'umbrella', title: 'Umbrellas in the doors', why: 'Two umbrellas in your leather, hidden in the door frames.' }
    : { id: 'concert', title: 'Concert sound', why: 'For long drives, the ceiling speakers put the music around you. The grilles stay the same.' };
  return [paint[sel.paint] ?? paint['argent']!, seat, sound];
}

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
  return <MembersGate p={persona()}><Room key={encode(car.model, car.sel)} model={car.model} sel={car.sel} own={car.own}/></MembersGate>;
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
  // Feedback from the team, newest first.
  const updates = [
    { when: ago(2), who: designer.name.split(' ')[0], text: `The full-size model of your ${m.name} is shaped. We lowered the waistline by 8 mm, as you asked.` },
    { when: ago(6), who: artisan.name.split(' ')[0], text: `The first ${material.name.toLowerCase()} sample is cut for your fascia. It travels to you with Thursday’s session.` },
    { when: ago(11), who: 'The atelier', text: `${paint.name} mixed for your car alone. Three test panels are drying in Munich.` },
  ];
  const touches = advice(model, sel);
  const [added, setAdded] = useState<string[]>([]);
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
      <MembersNav p={persona()}/>
    </div>
    <div className="wrap room">
      <div className="room-car">
        {RENDERS[model]?.[sel.paint] ? <div className="stage-photo"><div className="layers"><img className="car on" src={RENDERS[model]![sel.paint]} alt={`Your BMC ${m.name} in ${paint.name}`}/></div></div>
          : <div className="fit-stage day"><div className="wrap"><Car model={model} paint={sel.paint} wheel={sel.wheel} leather={sel.leather}/></div></div>}
        <div className="room-meta">
          <span className="label">Your {m.name} · in {STAGES[NOW]!.toLowerCase()}</span>
          <ol className="build-progress" aria-label="Progress">
            {STAGES.map((st, i) => <li key={st} className={i < NOW ? 'done' : i === NOW ? 'now' : undefined} aria-current={i === NOW ? 'step' : undefined}>{st}</li>)}
          </ol>
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
        <div className="advice" role="region" aria-label="Advice from your designer">
          <span className="label">{designer.name.split(' ')[0]} suggests for your {m.name}</span>
          <ul>{touches.map(t => {
            const on = added.includes(t.id);
            return <li key={t.id} className={on ? 'on' : undefined}>
              <div><b>{t.title}</b><p>{t.why}</p></div>
              <button className={on ? 'link' : 'btn'} aria-pressed={on} onClick={() => {
                setAdded(on ? added.filter(a => a !== t.id) : [...added, t.id]);
                if (!on) toast(`${t.title} · added`, { description: `${designer.name.split(' ')[0]} will confirm it at your next session.` });
              }}>{on ? 'Added ✓' : 'Add'}</button>
            </li>;
          })}</ul>
        </div>
        <div className="updates" role="region" aria-label="Latest from your team">
          <span className="label">Latest from your team</span>
          <ol>{updates.map(u => <li key={u.when + u.who}><time>{u.when}</time><p><b>{u.who}</b> · {u.text}</p></li>)}</ol>
        </div>
        <span className="label">Your conversation</span>
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
