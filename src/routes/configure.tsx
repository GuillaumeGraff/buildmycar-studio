import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { MODELS, STEPS, MONOGRAM_COST, opt, eur, type ModelId } from '@/components/atelier/data';

export const Route = createFileRoute('/configure')({ head: () => pageHead('Configure your car', 'Choose a silhouette, then shape your BMC finish by finish. An illustrative design study.'), component: Configure });

type Selection = { paint: string; wheel: string; leather: string; material: string; mono: string };
const DEFAULTS: Selection = { paint: 'noir', wheel: 'classic', leather: 'ivoire', material: 'walnut', mono: '' };
const top = () => window.scrollTo({ top: 0 });

// Studio lighting for the configurator stage.
const LIGHTS = [
  { id: 'day', name: 'Daylight' },
  { id: 'dusk', name: 'Dusk' },
  { id: 'night', name: 'Night' },
] as const;
type Light = (typeof LIGHTS)[number]['id'];

// A commission is shared as a link: /configure?c=gt.jade.wire.cognac.walnut.ABC
const encode = (model: ModelId, s: Selection) => [model, s.paint, s.wheel, s.leather, s.material, s.mono].join('.');
function decode(code: string): { model: ModelId; sel: Selection } | null {
  const [model, paint, wheel, leather, material, mono = ''] = code.split('.');
  if (!model || !(model in MODELS)) return null;
  const valid = (key: 'paint' | 'wheel' | 'leather' | 'material', id?: string) => STEPS.find(st => st.key === key)!.opts!.some(o => o.id === id) ? id! : DEFAULTS[key];
  return { model: model as ModelId, sel: { paint: valid('paint', paint), wheel: valid('wheel', wheel), leather: valid('leather', leather), material: valid('material', material), mono: mono.replace(/[^A-Z]/g, '').slice(0, 3) } };
}

async function share(model: ModelId, sel: Selection) {
  const url = `${window.location.origin}/configure?c=${encode(model, sel)}`;
  const title = `My BMC ${MODELS[model].name}`;
  try {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url);
    toast('Link copied · anyone with it sees your commission');
  } catch (e) {
    if ((e as Error).name !== 'AbortError') toast('Could not copy the link', { description: url });
  }
}

// Workshop stages as a share of the build time, from sign-off to handover.
const STAGES = [
  { at: 0, name: 'Design sign-off', note: 'Final drawings and materials approved together' },
  { at: 0.12, name: 'Chassis & coachwork', note: 'Aluminium panels shaped by hand on wooden bucks' },
  { at: 0.45, name: 'Paint', note: 'Each coat laid and rubbed by hand' },
  { at: 0.65, name: 'Interior', note: 'Hides cut, stitched and fitted' },
  { at: 0.88, name: 'Road test', note: 'Five hundred kilometres before the final polish' },
  { at: 1, name: 'Handover', note: 'At the Munich atelier, or at your door' },
];
const monthYear = (weeksFromNow: number) => new Date(Date.now() + weeksFromNow * 7 * 864e5).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

function Configure() {
  const [model, setModel] = useState<ModelId | null>(null);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Selection>(DEFAULTS);
  const [light, setLight] = useState<Light>('day');

  // Open a shared commission straight on its summary.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('c');
    const shared = code && decode(code);
    if (!shared) return;
    setModel(shared.model); setSel(shared.sel); setStep(STEPS.length - 1);
  }, []);

  if (!model) return <div className="page">
    <div className="wrap page-head">
      <span className="label">Configure · Step 1</span>
      <h2>Choose your <em>silhouette.</em></h2>
      <p className="lead">Three bodies, each a starting point. Everything after is yours to decide.</p>
    </div>
    <div className="wrap" style={{ paddingBottom: 104 }}><div className="models">
      {(Object.keys(MODELS) as ModelId[]).map(k => <button className="model" key={k} onClick={() => { setModel(k); setStep(0); setSel(DEFAULTS); top(); }}>
        <Car model={k} paint="noir" wheel="classic"/>
        <h3>{MODELS[k].name}</h3><p>{MODELS[k].line}</p><span className="from">From {eur(MODELS[k].base)}</span>
      </button>)}
    </div></div>
  </div>;

  const m = MODELS[model], st = STEPS[step]!;
  const total = m.base + opt('paint', sel.paint).cost + opt('wheel', sel.wheel).cost + opt('leather', sel.leather).cost + opt('material', sel.material).cost + (sel.mono ? MONOGRAM_COST : 0);
  const next = STEPS[step + 1];

  return <div className="page">
    <div className="wrap page-head" style={{ paddingBottom: 36 }}>
      <span className="label">Configure · {m.name} · Step {step + 2} of {STEPS.length + 1}</span>
      <div className="steps" aria-hidden="true">{[null, ...STEPS].map((_, i) => <i key={i} className={i <= step + 1 ? 'on' : ''}/>)}</div>
    </div>
    <div className="wrap config">
      <div className="viewer">
        <div className={`stage ${light}`}>{sel.mono && <span className="mono">{sel.mono}</span>}<Car model={model} paint={sel.paint} wheel={sel.wheel} leather={sel.leather}/></div>
        <div className="viewer-tools">
          <div className="lights" role="group" aria-label="Studio lighting">
            {LIGHTS.map(l => <button key={l.id} aria-pressed={light === l.id} onClick={() => setLight(l.id)}>{l.name}</button>)}
          </div>
          <button className="link" onClick={() => void share(model, sel)}>Share</button>
        </div>
        <p className="summary-line">{opt('paint', sel.paint).name} · {opt('wheel', sel.wheel).name} wheels · {opt('leather', sel.leather).name} · {opt('material', sel.material).name}</p>
        <div className="est"><span className="label">Estimate</span><b>{eur(total)}</b></div>
      </div>
      <div className="stack" style={{ gap: 28 }}>
        <div className="stack" style={{ gap: 12 }}><h2 style={{ fontSize: 'clamp(34px,3.6vw,48px)' }}>{st.title}</h2><p className="muted">{st.intro}</p></div>
        {st.opts && <div className="opts">{st.opts.map(o => {
          const key = st.key as keyof Selection;
          return <button className="opt" key={o.id} aria-pressed={sel[key] === o.id} onClick={() => setSel({ ...sel, [key]: o.id })}>
            <i style={{ background: o.hex }}/><span><b>{o.name}</b><small>{o.note}</small></span><em>{o.cost ? '+' + eur(o.cost) : 'Included'}</em>
          </button>;
        })}</div>}
        {st.key === 'mono' && <>
          <div className="entry"><label htmlFor="mono">Initials</label><input className="monofield" id="mono" maxLength={3} autoComplete="off" placeholder="ABC" value={sel.mono} onChange={e => setSel({ ...sel, mono: e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) })}/></div>
          <p className="muted" style={{ fontSize: 13 }}>Optional · {eur(MONOGRAM_COST)}</p>
        </>}
        {st.key === 'summary' && <Summary model={model} sel={sel}/>}
        <div className="nav-row">
          <button className="link" onClick={() => { if (step === 0) setModel(null); else setStep(step - 1); top(); }}>{step === 0 ? 'Change silhouette' : 'Back'}</button>
          {next ? <button className="btn solid" onClick={() => { setStep(step + 1); top(); }}>{next.key === 'summary' ? 'See my commission' : 'Continue'}</button>
            : <button className="link" onClick={() => { setModel(null); top(); }}>Start again</button>}
        </div>
        <p className="muted" style={{ fontSize: 12 }}>Illustrative estimate before taxes. The final price is confirmed by the atelier.</p>
      </div>
    </div>
  </div>;
}

function Summary({ model, sel }: { model: ModelId; sel: Selection }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', consent: false });
  const m = MODELS[model];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = !form.name.trim() ? 'Please add your name.'
      : !/^\S+@\S+\.\S+$/.test(form.email.trim()) ? 'Please add a valid email so the atelier can reach you.'
      : !form.consent ? 'Please confirm you agree to be contacted.' : '';
    setError(msg);
    if (msg) return;
    setSent(true);
    toast('Request received');
  };

  if (sent) return <div className="thanks"><span className="label">Request received</span><h3>Thank you.</h3><p className="muted">Your atelier contact will be in touch to arrange a private consultation. This is a prototype, so no message was actually sent.</p></div>;
  return <>
    <ul className="recap">
      <li><span>Silhouette</span><span>{m.name}</span></li>
      <li><span>Finish</span><span>{opt('paint', sel.paint).name}</span></li>
      <li><span>Wheels</span><span>{opt('wheel', sel.wheel).name}</span></li>
      <li><span>Leather</span><span>{opt('leather', sel.leather).name}</span></li>
      <li><span>Materials</span><span>{opt('material', sel.material).name}</span></li>
      <li><span>Monogram</span><span>{sel.mono || 'None'}</span></li>
    </ul>
    <div className="stack" style={{ gap: 18 }}>
      <span className="label">Your build, week by week</span>
      <ol className="journey">
        {STAGES.map(st => <li key={st.name}>
          <time>{st.at === 0 ? 'On signing' : monthYear(Math.round(m.weeks * st.at) + 2)}</time>
          <b>{st.name}</b><small>{st.note}</small>
        </li>)}
      </ol>
      <p className="muted" style={{ fontSize: 13 }}>About {m.weeks} weeks from sign-off, if you commission today. Clients are invited to the atelier at every stage.</p>
    </div>
    <form className="stack" noValidate onSubmit={submit}>
      <div className="entry"><label htmlFor="cname">Your name</label><input id="cname" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div>
      <div className="entry"><label htmlFor="cmail">Email</label><input id="cmail" type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></div>
      <label className="consent"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })}/> I agree that BuildMyCar uses these details to contact me about this commission, as described in the privacy policy.</label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="btn solid" type="submit">Request a private consultation</button>
    </form>
  </>;
}
