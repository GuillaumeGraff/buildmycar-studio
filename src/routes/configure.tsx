import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { RENDERS } from '@/components/atelier/renders';
import { MODELS, STEPS, MONOGRAM_COST, DEFAULTS, opt, eur, encode, decode, type ModelId, type Option, type Selection } from '@/components/atelier/data';

export const Route = createFileRoute('/configure')({ head: () => pageHead('Configure your car', 'Choose a silhouette, then shape your BMC finish by finish. An illustrative design study.'), component: Configure });

const top = () => window.scrollTo({ top: 0 });

// Studio lighting for the configurator stage.
const LIGHTS = [
  { id: 'day', name: 'Daylight' },
  { id: 'dusk', name: 'Dusk' },
  { id: 'night', name: 'Night' },
] as const;
type Light = (typeof LIGHTS)[number]['id'];
type View = 'render' | 'sketch';

async function share(model: ModelId, sel: Selection) {
  const url = `${window.location.origin}/configure?c=${encode(model, sel)}`;
  const title = `My BMC ${MODELS[model].name}`;
  try {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url);
    toast('Link copied · anyone with it sees your car');
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

const CHAPTERS: Record<string, string> = { paint: 'Lacquer', wheel: 'Wheels', leather: 'Leather', material: 'Materials', mono: 'Monogram', summary: 'Your car' };
const IDS = Object.keys(MODELS) as ModelId[];

function Configure() {
  const [model, setModel] = useState<ModelId | null>(null);
  const [preview, setPreview] = useState<ModelId>('gt');
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Selection>(DEFAULTS);
  const [light, setLight] = useState<Light>('day');
  const [view, setView] = useState<View>('render');

  // Open a shared commission straight on its summary.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('c');
    const shared = code && decode(code);
    if (!shared) return;
    setModel(shared.model); setSel(shared.sel); setStep(STEPS.length - 1);
  }, []);

  if (!model) return <div className="page">
    <div className="wrap chooser">
      <div className="chooser-car" aria-live="polite">
        {/* keyed so the drawing is redrawn for every silhouette */}
        <Car key={preview} model={preview} animated/>
      </div>
      <div className="chooser-list">
        <span className="label">Begin with a silhouette</span>
        <ul role="list">
          {IDS.map(k => <li key={k}>
            <button className="silhouette" aria-pressed={preview === k} onMouseEnter={() => setPreview(k)} onFocus={() => setPreview(k)} onClick={() => { setModel(k); setStep(0); setSel(DEFAULTS); top(); }}>
              <span className="name">{MODELS[k].name}</span><span className="from">From {eur(MODELS[k].base)}<b aria-hidden="true">›</b></span>
            </button>
          </li>)}
        </ul>
        <p className="muted">{MODELS[preview].line}</p>
      </div>
    </div>
  </div>;

  const m = MODELS[model], st = STEPS[step]!;
  const total = m.base + opt('paint', sel.paint).cost + opt('wheel', sel.wheel).cost + opt('leather', sel.leather).cost + opt('material', sel.material).cost + (sel.mono ? MONOGRAM_COST : 0);
  const next = STEPS[step + 1];
  const key = st.key as keyof Selection;
  const current = st.opts?.find(o => o.id === sel[key]);
  const cycle = (dir: number) => {
    if (!st.opts) return;
    const i = st.opts.findIndex(o => o.id === sel[key]);
    setSel({ ...sel, [key]: st.opts[(i + dir + st.opts.length) % st.opts.length]!.id });
  };

  return <div className="page fitting">
    <nav className="chapters wrap" aria-label="Configuration steps">
      <button className="chapter" onClick={() => { setModel(null); setPreview(model); top(); }}>{m.name}</button>
      {STEPS.map((s, i) => <button key={s.key} className="chapter" aria-current={i === step ? 'step' : undefined} data-done={i < step || undefined} onClick={() => setStep(i)}>{CHAPTERS[s.key]}</button>)}
    </nav>

    <Stage model={model} sel={sel} light={light} view={view} onSwipe={st.opts ? cycle : undefined}/>
    <div className="wrap stage-tools">
      <div className="lights" role="group" aria-label="Studio lighting">
        {LIGHTS.map(l => <button key={l.id} aria-pressed={light === l.id} onClick={() => setLight(l.id)}>{l.name}</button>)}
      </div>
      {RENDERS[model] && <div className="lights" role="group" aria-label="View">
        {(['render', 'sketch'] as const).map(v => <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'render' ? 'Render' : 'Sketch'}</button>)}
      </div>}
      <span className="price">{eur(total)}</span>
    </div>

    <div className="wrap narrow choice">
      {current && st.opts && <>
        <span className="label">{st.title}</span>
        <h2 key={current.id} className="choice-name">{current.name}</h2>
        <p className="muted choice-note">{current.note} · {current.cost ? '+' + eur(current.cost) : 'Included'}</p>
        <div className="swatches" role="radiogroup" aria-label={st.title}>
          <button className="arrow" aria-label="Previous" onClick={() => cycle(-1)}>‹</button>
          {st.opts.map(o => <button key={o.id} role="radio" aria-checked={o.id === current.id} aria-label={o.name} title={o.name} className="swatch" onClick={() => setSel({ ...sel, [key]: o.id })}>
            <Swatch o={o} wheel={st.key === 'wheel'}/>
          </button>)}
          <button className="arrow" aria-label="Next" onClick={() => cycle(1)}>›</button>
        </div>
        <p className="muted hint">{st.intro}</p>
      </>}

      {st.key === 'mono' && <>
        <span className="label">{st.title}</span>
        <label className="mono-seal" htmlFor="mono">
          <input id="mono" maxLength={3} autoComplete="off" placeholder="ABC" aria-label="Your initials" value={sel.mono} onChange={e => setSel({ ...sel, mono: e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) })}/>
        </label>
        <p className="muted hint">{st.intro} Optional · {eur(MONOGRAM_COST)}</p>
      </>}

      {st.key === 'summary' && <Summary model={model} sel={sel}/>}

      <div className="nav-row">
        <button className="link" onClick={() => { if (step === 0) { setModel(null); setPreview(model); } else setStep(step - 1); top(); }}>Back</button>
        {next ? <button className="btn solid" onClick={() => setStep(step + 1)}>{CHAPTERS[next.key]}</button>
          : <button className="link" onClick={() => void share(model, sel)}>Share this car</button>}
      </div>
    </div>
  </div>;
}

function Stage({ model, sel, light, view, onSwipe }: { model: ModelId; sel: Selection; light: Light; view: View; onSwipe?: ((dir: number) => void) | undefined }) {
  const start = useRef<number | null>(null);
  const renders = RENDERS[model];
  // The car first draws itself in gold, then the sketch gives way to the render.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!renders) return;
    const t = window.setTimeout(() => setRevealed(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2600);
    return () => window.clearTimeout(t);
  }, [renders]);
  const real = renders && view === 'render';
  return <div className={`fit-stage ${light}${real ? ' real' : ''}${real && revealed ? ' revealed' : ''}`}
    onTouchStart={e => { start.current = e.touches[0]!.clientX; }}
    onTouchEnd={e => {
      const dx = e.changedTouches[0]!.clientX - (start.current ?? 0);
      start.current = null;
      if (onSwipe && Math.abs(dx) > 40) onSwipe(dx < 0 ? 1 : -1);
    }}>
    {real && <div className="render" aria-hidden={!revealed}>
      {Object.entries(renders).map(([paint, src]) => <img key={paint} src={src} alt={paint === sel.paint ? `BMC ${MODELS[model].name} in ${opt('paint', paint).name}` : ''} className={paint === sel.paint ? 'on' : ''} decoding="async"/>)}
    </div>}
    <div className="wrap sketch">
      {sel.mono && <span className="mono">{sel.mono}</span>}
      {real ? <Car model={model} animated/> : <Car model={model} paint={sel.paint} wheel={sel.wheel} leather={sel.leather}/>}
    </div>
  </div>;
}

function Swatch({ o, wheel }: { o: Option; wheel: boolean }) {
  if (!wheel) return <i style={{ background: o.hex }}/>;
  const n = o.spokes ?? 12;
  return <svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx={20} cy={20} r={17} fill="none" stroke="currentColor" strokeWidth={1}/>
    {Array.from({ length: n }, (_, i) => { const a = (i * 2 * Math.PI) / n; return <line key={i} x1={20 + Math.cos(a) * 4} y1={20 + Math.sin(a) * 4} x2={20 + Math.cos(a) * 15} y2={20 + Math.sin(a) * 15} stroke="currentColor" strokeWidth={n === 5 ? 3 : n > 20 ? .5 : 1}/>; })}
  </svg>;
}

function Summary({ model, sel }: { model: ModelId; sel: Selection }) {
  const m = MODELS[model];
  return <div className="stack" style={{ gap: 36 }}>
    <div className="stack" style={{ gap: 14 }}>
      <span className="label">Your creation</span>
      <h2 className="choice-name">The {m.name}</h2>
      <p className="muted">{opt('paint', sel.paint).name} · {opt('wheel', sel.wheel).name} wheels · {opt('leather', sel.leather).name} · {opt('material', sel.material).name}{sel.mono ? ` · ${sel.mono}` : ''}</p>
    </div>
    <div className="stack" style={{ gap: 18, textAlign: 'left' }}>
      <span className="label">Your build, month by month</span>
      <ol className="journey">
        {STAGES.map(s => <li key={s.name}>
          <time>{s.at === 0 ? 'On signing' : monthYear(Math.round(m.weeks * s.at) + 2)}</time>
          <b>{s.name}</b><small>{s.note}</small>
        </li>)}
      </ol>
      <p className="muted" style={{ fontSize: 13 }}>About {m.weeks} weeks from sign-off, if you begin today. Illustrative estimate before taxes; the atelier confirms the final price.</p>
    </div>
    <Link to="/book" search={{ c: encode(model, sel) }} className="btn solid">Start your creation</Link>
  </div>;
}
