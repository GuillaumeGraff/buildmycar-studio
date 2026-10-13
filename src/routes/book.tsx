import { createFileRoute, Link } from '@tanstack/react-router';
import { Fragment, useMemo, useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { TEAM, KITTENS, decode, opt } from '@/components/atelier/data';

type Search = { c?: string | undefined; with?: number | undefined };

export const Route = createFileRoute('/book')({
  validateSearch: (s: Record<string, unknown>): Search => {
    const w = Number(s['with']);
    return { c: typeof s['c'] === 'string' ? s['c'] : undefined, with: s['with'] !== undefined && Number.isInteger(w) && w >= 0 && w < TEAM.length ? w : undefined };
  },
  head: () => pageHead('Meet a cat', 'Meet the BuildMyCat team and the cats at the Munich cat house, in a cat lounge, by video or at your home.'),
  component: Book,
});

const PLACES = [
  { id: 'atelier', phrase: 'at the Munich cat house', name: 'At the Munich cat house', note: 'Coffee, forty cats and a lint roller at the door' },
  { id: 'showroom', phrase: 'at the cat lounge', name: 'In one of our cat lounges', note: 'A private salon, with a cat to sit on you' },
  { id: 'video', phrase: 'by private video call', name: 'By private video call', note: 'Forty-five minutes. A cat may walk across the keyboard' },
  { id: 'home', phrase: 'at your home', name: 'At your home', note: 'The home visit every adoption needs, tape measure for the windows included' },
];
// Our cat lounges, one in each city where our adoption directors live. Edit them here.
const SHOWROOMS = [
  { id: 'munich', name: 'Munich', note: 'Maximilianstraße' },
  { id: 'la', name: 'Los Angeles', note: 'Beverly Hills' },
  { id: 'dubai', name: 'Dubai', note: 'DIFC' },
  { id: 'shanghai', name: 'Shanghai', note: 'The Bund' },
];

// Mondays of the next six weeks, for visits planned around the adopter.
function nextWeeks() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7) + 7);
  return Array.from({ length: 6 }, (_, i) => new Date(d.getTime() + i * 7 * 864e5));
}
const STAGES = ['With', 'Where', 'When', 'You'] as const;
const TIMES = ['10:00', '11:30', '14:00', '16:30'];

// The next ten weekdays, starting tomorrow.
function nextDays() {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

function icsFile(start: Date, title: string, where: string) {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BuildMyCat//CatHouse//EN', 'BEGIN:VEVENT', `UID:${start.getTime()}@buildmycat.example`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`, `LOCATION:${where}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
}

function Book() {
  const search = Route.useSearch();
  const commission = search.c ? decode(search.c) : null;
  const days = useMemo(nextDays, []);
  const weeks = useMemo(nextWeeks, []);
  const [showroom, setShowroom] = useState(SHOWROOMS[0]!.id);
  const [week, setWeek] = useState(0);
  const [who, setWho] = useState<number | null>(search.with ?? null);
  const [place, setPlace] = useState('atelier');
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(TIMES[0]!);
  const [form, setForm] = useState({ name: '', email: '', note: '', consent: false });
  const [error, setError] = useState('');
  const [stage, setStage] = useState(0);
  const [sent, setSent] = useState<{ when: Date; ics: string } | null>(null);

  const host = who === null ? 'Your adoption director' : TEAM[who]!.name;
  const where = PLACES.find(p => p.id === place)!;
  // Cat house and home visits are planned by the week; lounges and video calls take a precise slot.
  const home = place === 'atelier' || place === 'home';
  const city = SHOWROOMS.find(a => a.id === showroom)!.name;
  const placeName = place === 'showroom' ? `The ${city} cat lounge` : where.name;
  const phrase = place === 'showroom' ? `at the ${city} cat lounge` : where.phrase;
  const weekName = (d: Date) => `the week of ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;
  const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = !form.name.trim() ? 'Please add your name.'
      : !/^\S+@\S+\.\S+$/.test(form.email.trim()) ? 'Please add a valid email so the house can confirm.'
      : !form.consent ? 'Please confirm you agree to be contacted.' : '';
    setError(msg);
    if (msg) return;
    const [h, min] = time.split(':').map(Number);
    const when = new Date(home ? weeks[week]! : days[day]!);
    when.setHours(h!, min!);
    setSent({ when, ics: home ? '' : icsFile(when, `BuildMyCat · meeting with ${host}`, placeName) });
    toast('Appointment requested');
    window.scrollTo({ top: 0 });
  };

  if (sent) return <div className="page"><div className="wrap narrow page-head booked">
    <span className="label">Appointment requested</span>
    <h2>{home ? 'Until soon' : `Until ${sent.when.toLocaleDateString('en-GB', { weekday: 'long' })}`}, <em>{form.name.trim().split(' ')[0]}.</em></h2>
    <p className="lead">{home ? `${host} will ${place === 'home' ? 'visit you at home' : 'welcome you at the Munich cat house'} during ${weekName(sent.when)}, and will call first to agree the day and time that suit you.` : `${host} will meet you ${phrase} on ${longDate(sent.when)} at ${time}. A confirmation will follow by email.`}</p>
    <div className="row-gap">
      {!home && <a className="btn solid" href={sent.ics} download="buildmycat-meeting.ics">Add to my calendar</a>}
      <Link to="/" className="link">Return home</Link>
    </div>
    <p className="disclaimer">This is a prototype, so no meeting was actually booked and no message was sent.</p>
  </div></div>;

  // One choice per screen: each pick moves on by itself, Back or a swipe returns.
  const advance = () => window.setTimeout(() => setStage(s => Math.min(s + 1, STAGES.length - 1)), 380);
  const swipe = useRef<number | null>(null);
  const stageName = STAGES[stage]!;

  return <div className="page rdv">
    <nav className="chapters wrap narrow" aria-label="Rendezvous steps">
      <div className="chapters-head">
        {stage > 0 ? <button type="button" className="chapters-back" onClick={() => setStage(stage - 1)}>‹ Back</button> : <span className="chapters-back">Meet a cat</span>}
        <span key={stageName} className="chapters-now">{stageName}<small>{stage + 1} / {STAGES.length}</small></span>
      </div>
      <div className="chapters-bar">
        {STAGES.map((n, i) => <button type="button" key={n} className="chapter" aria-label={n} aria-current={i === stage ? 'step' : undefined} data-done={i < stage || undefined} onClick={() => setStage(i)}/>)}
      </div>
    </nav>
    <form className="wrap narrow booking" noValidate onSubmit={submit}
      onTouchStart={e => { swipe.current = e.touches[0]!.clientX; }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0]!.clientX - (swipe.current ?? 0);
        swipe.current = null;
        if (Math.abs(dx) > 60 && !(e.target as HTMLElement).closest('.dates')) setStage(s => Math.max(0, Math.min(STAGES.length - 1, s + (dx < 0 ? 1 : -1))));
      }}>
      <div className="rdv-stage" key={stage}>
      {stage === 0 && <fieldset>
        <h2 className="rdv-title">Every adoption begins <em>with a conversation.</em></h2>
        <legend className="label">Who would you like to meet?</legend>
        {commission && <p className="commission-note">About your {KITTENS[commission.kitten].name} in {opt('coat', commission.sel.coat).name}.</p>}
        <div className="chips team-chips">
          <button type="button" className="chip" aria-pressed={who === null} onClick={() => { setWho(null); advance(); }}>Whoever suits best<small>Your adoption director</small></button>
          {TEAM.map((t, i) => <button type="button" key={t.name} className="chip" aria-pressed={who === i} onClick={() => { setWho(i); advance(); }}>{t.name.split(' ')[0]}<small>{t.role}</small><small className="langs">{t.languages.join(' · ')}</small></button>)}
        </div>
      </fieldset>}
      {stage === 1 && <fieldset>
        <legend className="label">Where?</legend>
        <div className="places">
          {PLACES.map(p => <Fragment key={p.id}>
            <button type="button" className="place" aria-pressed={place === p.id} onClick={() => { setPlace(p.id); if (p.id !== 'showroom') advance(); }}><b>{p.name}</b><small>{p.note}</small></button>
            {/* The city opens right under the showroom choice, where the eye already is. */}
            {p.id === 'showroom' && place === 'showroom' && <div className="chips showroom-cities" role="radiogroup" aria-label="Cat lounge">
              {SHOWROOMS.map(a => <button type="button" role="radio" aria-checked={showroom === a.id} key={a.id} className="chip" onClick={() => { setShowroom(a.id); advance(); }}>{a.name}<small>{a.note}</small></button>)}
            </div>}
          </Fragment>)}
        </div>
      </fieldset>}
      {stage === 2 && (home ? <fieldset>
        <legend className="label">Which week?</legend>
        <div className="chips week-chips" role="radiogroup" aria-label="Week">
          {weeks.map((w, i) => <button type="button" role="radio" aria-checked={week === i} key={w.toISOString()} className="chip" onClick={() => { setWeek(i); advance(); }}>Week of {w.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</button>)}
        </div>
        <p className="muted hint">Your adoption director will call to agree the day and time with you.</p>
      </fieldset> : <fieldset>
        <legend className="label">When?</legend>
        <div className="dates" role="radiogroup" aria-label="Day">
          {days.map((d, i) => <button type="button" role="radio" aria-checked={day === i} key={d.toISOString()} className="date" onClick={() => setDay(i)}>
            <small>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>{d.getDate()}</b><small>{d.toLocaleDateString('en-GB', { month: 'short' })}</small>
          </button>)}
        </div>
        <div className="chips times" role="radiogroup" aria-label="Time">
          {TIMES.map(t => <button type="button" role="radio" aria-checked={time === t} key={t} className="chip" onClick={() => { setTime(t); advance(); }}>{t}</button>)}
        </div>
        <p className="muted hint">Choose a day, then a time.</p>
      </fieldset>)}
      {stage === 3 && <fieldset className="stack">
        <legend className="label">Your details</legend>
        <p className="rdv-summary">{host} · {placeName} · {home ? `Week of ${weeks[week]!.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}` : `${longDate(days[day]!)} at ${time}`}</p>
        <div className="entry"><label htmlFor="bname">Your name</label><input id="bname" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div>
        <div className="entry"><label htmlFor="bmail">Email</label><input id="bmail" type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></div>
        <div className="entry"><label htmlFor="bnote">Anything we should know (optional)</label><input id="bnote" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}/></div>
        <label className="consent"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })}/> <span>I agree that BuildMyCat uses these details to arrange this meeting, as described in the <Link to="/privacy" className="link">privacy policy</Link>.</span></label>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="btn solid" type="submit">Request my visit</button>
      </fieldset>}
      </div>
    </form>
  </div>;
}
