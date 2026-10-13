import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Cat } from '@/components/atelier/cat';
import { KITTENS, TEAM, DEFAULTS, MATCHES, opt, style, encode, decode, myKitten, type KittenId, type Selection } from '@/components/atelier/data';
import { DemoNote } from '@/components/atelier/personas';
import { persona } from '@/components/atelier/platform';
import { AdoptionRoom, Tabs } from '@/components/atelier/members';

export const Route = createFileRoute('/studio')({
  validateSearch: (s: Record<string, unknown>): { c?: string | undefined } => ({ c: typeof s['c'] === 'string' ? s['c'] : undefined }),
  head: () => pageHead('Your kitten', 'You, a BuildMyCat matchmaker and the foster family prepare your adoption together, each from where you live.'),
  component: Studio,
});

// Who looks after the kitten until homecoming, matched to the toy the adopter chose.
const FOSTERS: Record<string, { name: string; craft: string; city: string; work: string }> = {
  feather: { name: 'Hanna Vogel', craft: 'Foster family', city: 'Schwabing', work: 'We play with the feather every evening, so it already smells of home' },
  box: { name: 'The Okafor family', craft: 'Foster family', city: 'Giesing', work: 'We have kept the box the sofa came in. It is now the most valuable object in the flat' },
  mouse: { name: 'Dr Lena Brandt', craft: 'House vet', city: 'Munich cat house', work: 'I checked the catnip mouse for safety, and lost it under the radiator twice' },
  laser: { name: 'Tomás Ruiz', craft: 'Cat behaviourist', city: 'Los Angeles lounge', work: 'We limit the red dot to ten minutes, and always end on a real toy they can catch' },
};
// Where the adoption is, on its way home; the studio shows it at the first stage.
const STAGES = ['Match', 'Meet', 'Home visit', 'Vet check', 'Homecoming'];
const NOW = 0;
const ago = (days: number) => { const d = new Date(); d.setDate(d.getDate() - days); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

// What the matchmaker would add for this particular kitten, and why.
type Touch = { id: string; title: string; why: string };
function advice(kitten: KittenId, sel: Selection): Touch[] {
  const coat: Record<string, Touch> = {
    noir: { id: 'tag', title: 'A gold name tag', why: 'On a black coat it is the only thing you will see in the dark hallway at night.' },
    ginger: { id: 'pair', title: 'A second kitten', why: 'Marmalades come in pairs. Rufus has a brother, Biscuit, who would like a word.' },
    silver: { id: 'perch', title: 'A window perch', why: 'Silver coats are made for watching pigeons. It also saves the curtains.' },
    cream: { id: 'roller', title: 'A lint roller subscription', why: 'Delivered monthly, in your collar leather. Your navy suits will thank us.' },
  };
  const collar: Touch = sel.style && sel.style !== 'plain'
    ? { id: 'post', title: 'A scratching post in walnut', why: `Wrapped in the same hide as the ${opt('collar', sel.collar).name} collar, so the sofa is spared, in theory.` }
    : { id: 'bell', title: 'A little bell', why: 'Plain collars are elegant. A bell lets the birds in the garden enjoy them too.' };
  const purr: Touch = sel.purr && sel.purr !== 'salon'
    ? { id: 'earplugs', title: 'Silk earplugs', why: `${KITTENS[kitten].name}s with a ${opt('purr', sel.purr).name} purr start at three in the morning. We include two pairs.` }
    : { id: 'concert', title: 'Concert purr', why: 'For long evenings, a fuller purr puts the sound all around the sofa. The whiskers stay the same.' };
  return [coat[sel.coat] ?? coat['silver']!, collar, purr];
}

const PARTS = ['Conversation', 'Ideas', 'News'] as const;

const FALLBACK = { kitten: 'loaf' as KittenId, sel: { ...DEFAULTS, coat: 'ginger', eyes: 'emerald' } };

function Studio() {
  const { c } = Route.useSearch();
  // Your own kitten: the one in the link, else the last one you shaped in the configurator.
  const [mine, setMine] = useState<{ kitten: KittenId; sel: Selection; own: boolean }>(() => {
    const d = c ? decode(c) : null;
    return d ? { ...d, own: true } : { ...FALLBACK, own: false };
  });
  useEffect(() => {
    if (c && decode(c)) return;
    const saved = myKitten();
    if (saved) setMine({ ...saved, own: true });
  }, [c]);
  return <Room key={encode(mine.kitten, mine.sel)} kitten={mine.kitten} sel={mine.sel} own={mine.own}/>;
}

function Room({ kitten, sel, own }: { kitten: KittenId; sel: Selection; own: boolean }) {
  const coat = opt('coat', sel.coat), collar = opt('collar', sel.collar), toy = opt('toy', sel.toy);
  const match = MATCHES[sel.coat] ?? MATCHES['silver']!;
  const foster = FOSTERS[sel.toy] ?? FOSTERS['feather']!;
  const matchmaker = TEAM[1]!;
  const first = matchmaker.name.split(' ')[0];
  const people = { client: 'You', designer: `${matchmaker.name}, matchmaking`, artisan: `${foster.name}, ${foster.craft.toLowerCase()}` };
  const [messages, setMessages] = useState<{ from: 'client' | 'designer' | 'artisan'; text: string; swatch?: string }[]>(() => [
    { from: 'designer', text: `Here is ${match.name}, in ${coat.name}, the real cat closest to the ${KITTENS[kitten].name} you configured. The first video visit is ready for you.` },
    { from: 'client', text: `Could the ${collar.name} collar carry something personal, very discreet, that only I would notice?` },
    { from: 'artisan', text: `${foster.work}. And yes, your initials on the back of the tag. First sample here.`, swatch: collar.hex },
  ]);
  // News from the house, newest first.
  const updates = [
    { when: ago(2), who: first, text: `${match.name} sat on your application form during our meeting. We are taking it as a yes.` },
    { when: ago(6), who: foster.name.split(' ')[0] === 'The' ? foster.name : foster.name.split(' ')[0], text: `The ${toy.name.toLowerCase()} is a success. It has been carried to bed every night this week.` },
    { when: ago(11), who: 'The cat house', text: `${match.name}’s vaccines are done and signed in the passport. Weight steady, opinions strong.` },
  ];
  const touches = advice(kitten, sel);
  const [added, setAdded] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [decision, setDecision] = useState<'open' | 'approved' | 'changes'>('open');
  const [part, setPart] = useState<(typeof PARTS)[number]>('Conversation');

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages([...messages, { from: 'client', text: draft.trim() }]);
    setDraft('');
  };

  return <AdoptionRoom p={persona()} wide title={<>Your <em>{match.name}.</em></>}>
    <div className="room">
      <div className="room-cat">
        <div className="stage-photo stage-cat room-stage"><div className="hero-sketch"><Cat kitten={kitten} coat={sel.coat} eyes={sel.eyes} collar={sel.collar} collarStyle={sel.style} toy={sel.toy}/></div></div>
        <div className="room-meta">
          <ol className="build-progress" aria-label="Progress">
            {STAGES.map((st, i) => <li key={st} className={i < NOW ? 'done' : i === NOW ? 'now' : undefined} aria-current={i === NOW ? 'step' : undefined}>{st}</li>)}
          </ol>
          <ul className="recap">
            <li><span>Kitten</span><span>{coat.name} · {opt('eyes', sel.eyes).name} eyes</span></li>
            <li><span>Collar</span><span>{collar.name} · {style(sel.style).name}</span></li>
            <li><span>Your people</span><span>{matchmaker.name} · {foster.name}</span></li>
            <li><span>Next visit</span><button className="link" onClick={() => toast('Visit reserved', { description: 'Thursday, 17:00. In the full product this opens a private video room, with the cat.' })}>Thursday, 17:00</button></li>
          </ul>
          {!own && <p className="muted hint"><Link to="/configure" className="link">Configure your kitten</Link> and it will appear here.</p>}
        </div>
      </div>
      <div className="room-feed">
        <Tabs items={PARTS} value={part} onChange={setPart} label="Your kitten"/>
        {part === 'Conversation' && <div className="panel" role="tabpanel">
          <ol className="feed">
            {messages.map((m, i) => <li key={i} className={m.from}>
              <span className="who">{m.swatch && <i className="sample" style={{ background: m.swatch }} aria-hidden="true"/>}{people[m.from]}</span>
              <p>{m.text}</p>
            </li>)}
          </ol>
          <div className={`proposal ${decision}`}>
            <i style={{ background: collar.hex }} aria-hidden="true"/>
            <div><span className="label">To approve</span><h3>Your initials on the collar tag</h3></div>
            {decision === 'open' ? <div className="row-gap">
              <button className="btn solid" onClick={() => { setDecision('approved'); toast('Approved · added to the passport'); }}>Approve</button>
              <button className="link" onClick={() => setDecision('changes')}>Ask for changes</button>
            </div> : <p className="decided">{decision === 'approved' ? <>Approved. It will be recorded in the passport. <Link to="/passport" className="link">Open the passport</Link></> : 'Sent back to the foster family with your notes.'}</p>}
          </div>
          <form className="reply-box" onSubmit={send}>
            <label htmlFor="msg" className="sr-only">Write to the house</label>
            <div className="row-gap"><input id="msg" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write to the house…"/><button className="btn" type="submit">Send</button></div>
          </form>
        </div>}
        {part === 'Ideas' && <div className="panel advice" role="tabpanel" aria-label={`${first} suggests`}>
          <p className="muted">{first} suggests, for {match.name}</p>
          <ul>{touches.map(t => {
            const on = added.includes(t.id);
            return <li key={t.id} className={on ? 'on' : undefined}>
              <div><b>{t.title}</b><p>{t.why}</p></div>
              <button className="link" aria-pressed={on} onClick={() => {
                setAdded(on ? added.filter(a => a !== t.id) : [...added, t.id]);
                if (!on) toast(`${t.title} · added`, { description: `${first} will confirm it at your next visit.` });
              }}>{on ? 'Added' : 'Add'}</button>
            </li>;
          })}</ul>
        </div>}
        {part === 'News' && <div className="panel updates" role="tabpanel">
          <ol>{updates.map(u => <li key={u.when + u.who}><time>{u.when}</time><p><b>{u.who}</b> · {u.text}</p></li>)}</ol>
        </div>}
        <DemoNote/>
      </div>
    </div>
  </AdoptionRoom>;
}
