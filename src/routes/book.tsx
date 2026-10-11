import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { TEAM, MODELS, decode, opt } from '@/components/atelier/data';

type Search = { c?: string | undefined; with?: number | undefined };

export const Route = createFileRoute('/book')({
  validateSearch: (s: Record<string, unknown>): Search => {
    const w = Number(s['with']);
    return { c: typeof s['c'] === 'string' ? s['c'] : undefined, with: s['with'] !== undefined && Number.isInteger(w) && w >= 0 && w < TEAM.length ? w : undefined };
  },
  head: () => pageHead('Start your creation', 'Meet the BuildMyCar team at the Munich atelier, by video or at your home to begin your car.'),
  component: Book,
});

const PLACES = [
  { id: 'atelier', phrase: 'at the Munich atelier', name: 'At the Munich atelier', note: 'Coffee, the material library and the cars in progress' },
  { id: 'video', phrase: 'by private video call', name: 'By private video call', note: 'Forty-five minutes, wherever you are' },
  { id: 'home', phrase: 'at your home', name: 'At your home', note: 'A designer travels to you with samples' },
];
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
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BuildMyCar//Atelier//EN', 'BEGIN:VEVENT', `UID:${start.getTime()}@buildmycar.example`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`, `LOCATION:${where}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
}

function Book() {
  const search = Route.useSearch();
  const commission = search.c ? decode(search.c) : null;
  const days = useMemo(nextDays, []);
  const [who, setWho] = useState<number | null>(search.with ?? null);
  const [place, setPlace] = useState('atelier');
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(TIMES[0]!);
  const [form, setForm] = useState({ name: '', email: '', note: '', consent: false });
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ when: Date; ics: string } | null>(null);

  const host = who === null ? 'The atelier' : TEAM[who]!.name;
  const where = PLACES.find(p => p.id === place)!;
  const placeName = where.name;
  const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = !form.name.trim() ? 'Please add your name.'
      : !/^\S+@\S+\.\S+$/.test(form.email.trim()) ? 'Please add a valid email so the atelier can confirm.'
      : !form.consent ? 'Please confirm you agree to be contacted.' : '';
    setError(msg);
    if (msg) return;
    const [h, min] = time.split(':').map(Number);
    const when = new Date(days[day]!);
    when.setHours(h!, min!);
    setSent({ when, ics: icsFile(when, `BuildMyCar · meeting with ${host}`, placeName) });
    toast('Appointment requested');
    window.scrollTo({ top: 0 });
  };

  if (sent) return <div className="page"><div className="wrap narrow page-head booked">
    <span className="label">Appointment requested</span>
    <h2>Until {sent.when.toLocaleDateString('en-GB', { weekday: 'long' })}, <em>{form.name.trim().split(' ')[0]}.</em></h2>
    <p className="lead">{host} will meet you {where.phrase} on {longDate(sent.when)} at {time}. A confirmation will follow by email.</p>
    <div className="row-gap">
      <a className="btn solid" href={sent.ics} download="buildmycar-meeting.ics">Add to my calendar</a>
      <Link to="/" className="link">Return home</Link>
    </div>
    <p className="disclaimer">This is a prototype, so no meeting was actually booked and no message was sent.</p>
  </div></div>;

  return <div className="page">
    <div className="wrap narrow page-head">
      <span className="label">Start your creation</span>
      <h2>Every car begins <em>with a conversation.</em></h2>
      <p className="lead">Choose who you would like to meet, where and when. There is no commitment at this stage.</p>
      {commission && <p className="commission-note">About your {MODELS[commission.model].name} in {opt('paint', commission.sel.paint).name}, with {opt('leather', commission.sel.leather).name} and {opt('material', commission.sel.material).name}.</p>}
    </div>
    <form className="wrap narrow booking" noValidate onSubmit={submit}>
      <fieldset>
        <legend className="label">With</legend>
        <div className="chips">
          <button type="button" className="chip" aria-pressed={who === null} onClick={() => setWho(null)}>Whoever suits best</button>
          {TEAM.map((t, i) => <button type="button" key={t.name} className="chip" aria-pressed={who === i} onClick={() => setWho(i)}>{t.name.split(' ')[0]}<small>{t.role}</small><small className="langs">{t.languages.join(' · ')}</small></button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">Where</legend>
        <div className="places">
          {PLACES.map(p => <button type="button" key={p.id} className="place" aria-pressed={place === p.id} onClick={() => setPlace(p.id)}><b>{p.name}</b><small>{p.note}</small></button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">When</legend>
        <div className="dates" role="radiogroup" aria-label="Day">
          {days.map((d, i) => <button type="button" role="radio" aria-checked={day === i} key={d.toISOString()} className="date" onClick={() => setDay(i)}>
            <small>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>{d.getDate()}</b><small>{d.toLocaleDateString('en-GB', { month: 'short' })}</small>
          </button>)}
        </div>
        <div className="chips times" role="radiogroup" aria-label="Time">
          {TIMES.map(t => <button type="button" role="radio" aria-checked={time === t} key={t} className="chip" onClick={() => setTime(t)}>{t}</button>)}
        </div>
      </fieldset>
      <fieldset className="stack">
        <legend className="label">You</legend>
        <div className="entry"><label htmlFor="bname">Your name</label><input id="bname" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div>
        <div className="entry"><label htmlFor="bmail">Email</label><input id="bmail" type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></div>
        <div className="entry"><label htmlFor="bnote">Anything we should know (optional)</label><textarea id="bnote" rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}/></div>
        <label className="consent"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })}/> <span>I agree that BuildMyCar uses these details to arrange this meeting, as described in the <Link to="/privacy" className="link">privacy policy</Link>.</span></label>
      </fieldset>
      <div className="confirm">
        <p>{host} · {placeName} · {longDate(days[day]!)} at {time}</p>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="btn solid" type="submit">Request my private appointment</button>
      </div>
    </form>
  </div>;
}
