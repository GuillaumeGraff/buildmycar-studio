import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { RENDERS } from '@/components/atelier/renders';
import { DETAILS, STUDIO } from '@/components/atelier/details';
import { MODELS, STEPS, DEFAULTS, opt, encode, decode, type ModelId, type Option, type Selection, type StepKey } from '@/components/atelier/data';

export const Route = createFileRoute('/configure')({ head: () => pageHead('Configure your car', 'Choose one of five BMC cars, then shape it finish by finish. An illustrative design study.'), component: Configure });

const top = () => window.scrollTo({ top: 0 });


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
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Configure() {
  const [model, setModel] = useState<ModelId | null>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Selection>(DEFAULTS);

  // Open a shared car straight on its summary.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('c');
    const shared = code && decode(code);
    if (!shared) return;
    setModel(shared.model); setIndex(IDS.indexOf(shared.model)); setSel(shared.sel); setStep(STEPS.length - 1);
  }, []);

  if (!model) return <Showroom index={index} setIndex={setIndex} choose={k => { setModel(k); setStep(0); setSel(DEFAULTS); top(); }}/>;

  const m = MODELS[model], st = STEPS[step]!;
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
      <button className="chapter" onClick={() => { setModel(null); top(); }}>{m.name}</button>
      {STEPS.map((s, i) => <button key={s.key} className="chapter" aria-current={i === step ? 'step' : undefined} data-done={i < step || undefined} onClick={() => setStep(i)}>{CHAPTERS[s.key]}</button>)}
    </nav>

    <Stage model={model} sel={sel} step={st.key} onSwipe={st.opts ? cycle : undefined}/>

    <div className="wrap narrow choice">
      {current && st.opts && <>
        <span className="label">{st.title}</span>
        <h2 key={current.id} className="choice-name">{current.name}</h2>
        <p className="muted choice-note">{current.note}</p>
        <div className="swatches" role="radiogroup" aria-label={st.title}>
          {st.opts.map(o => <button key={o.id} role="radio" aria-checked={o.id === current.id} aria-label={o.name} title={o.name} className="swatch" onClick={() => setSel({ ...sel, [key]: o.id })}>
            <Swatch o={o} step={st.key}/>
          </button>)}
        </div>
        <p className="muted hint">{st.intro}</p>
      </>}

      {st.key === 'mono' && <>
        <span className="label">{st.title}</span>
        <label className="mono-seal" htmlFor="mono">
          <input id="mono" maxLength={3} autoComplete="off" placeholder="ABC" aria-label="Your initials" value={sel.mono} onChange={e => setSel({ ...sel, mono: e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) })}/>
        </label>
        <p className="muted hint">{st.intro}</p>
      </>}

      {st.key === 'summary' && <Summary model={model} sel={sel}/>}

      <div className="nav-row">
        <button className="link" onClick={() => { if (step === 0) setModel(null); else setStep(step - 1); top(); }}>Back</button>
        {next ? <button className="btn solid" onClick={() => setStep(step + 1)}>{CHAPTERS[next.key]}</button>
          : <button className="link" onClick={() => void share(model, sel)}>Share this car</button>}
      </div>
    </div>
  </div>;
}

// The five cars, one at a time, swiped like pages of a brochure.
function Showroom({ index, setIndex, choose }: { index: number; setIndex: (i: number) => void; choose: (k: ModelId) => void }) {
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const go = (i: number) => setIndex((i + IDS.length) % IDS.length);
  const k = IDS[index]!, m = MODELS[k];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return <div className="page showroom">
    <div className={`slides${start.current !== null ? ' dragging' : ''}`} style={{ ['--drag' as string]: `${drag}px` }}
      onPointerDown={e => { if (e.pointerType !== 'mouse') { start.current = e.clientX; setDrag(0); } }}
      onPointerMove={e => { if (start.current !== null) setDrag(e.clientX - start.current); }}
      onPointerUp={() => { if (start.current === null) return; const dx = drag; start.current = null; setDrag(0); if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); }}
      onPointerCancel={() => { start.current = null; setDrag(0); }}>
      {IDS.map((id, i) => <figure key={id} className={`slide${i === index ? ' on' : ''}`} style={{ ['--o' as string]: i - index }} aria-hidden={i !== index}>
        <Hero model={id}/>
      </figure>)}
      <button className="slide-arrow prev" aria-label="Previous car" onClick={() => go(index - 1)}>‹</button>
      <button className="slide-arrow next" aria-label="Next car" onClick={() => go(index + 1)}>›</button>
    </div>
    <div className="wrap showroom-copy" key={k} aria-live="polite">
      <span className="label">{m.category}</span>
      <h1 className="model-name">{m.name}</h1>
      <p className="engine">{m.engine}</p>
      <dl className="specs">{m.specs.map(s => <div key={s.label}><dt>{s.label}</dt><dd><Count value={s.value}/>{s.unit && <small>{s.unit}</small>}</dd></div>)}</dl>
      <p className="dream">{m.dream}</p>
      <button className="btn solid" onClick={() => choose(k)}>Create your {m.name}</button>
    </div>
    <div className="dots" role="tablist" aria-label="Cars">
      {IDS.map((id, i) => <button key={id} role="tab" aria-selected={i === index} aria-label={`${MODELS[id].name}, ${MODELS[id].category}`} onClick={() => go(i)}><i/></button>)}
    </div>
  </div>;
}

// The car in its studio, or the empty studio while its photographs are being made.
function Hero({ model, paint = 'bordeaux' }: { model: ModelId; paint?: string }) {
  const renders = RENDERS[model];
  if (renders) return <img src={renders[paint] ?? Object.values(renders)[0]} alt={`BMC ${MODELS[model].name}`} draggable={false}/>;
  return <><img src={STUDIO} alt="" draggable={false}/><span className="veil">Being photographed in the atelier</span></>;
}

// Counts a figure up from zero, keeping its format (1,480 · 2.1).
function Count({ value }: { value: string }) {
  const target = Number(value.replace(/,/g, ''));
  const decimals = value.split('.')[1]?.length ?? 0;
  const [n, setN] = useState(target);
  useEffect(() => {
    if (still()) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

// What the stage shows at each step: the car for its lacquer, close-ups for everything you touch.
function Stage({ model, sel, step, onSwipe }: { model: ModelId; sel: Selection; step: StepKey; onSwipe?: ((dir: number) => void) | undefined }) {
  const start = useRef<number | null>(null);
  const renders = RENDERS[model];
  const shown: StepKey = step === 'mono' ? 'leather' : step;
  const detail = DETAILS[shown];
  const layers: { group: string; id: string; src: string }[] = [
    ...(renders ? Object.entries(renders).map(([id, src]) => ({ group: 'car', id, src })) : [{ group: 'car', id: 'studio', src: STUDIO }]),
    ...Object.entries(DETAILS).flatMap(([group, d]) => Object.entries(d!.images).map(([id, src]) => ({ group, id, src }))),
  ];
  const group = detail ? shown : 'car';
  const active = group === 'car' ? (renders ? sel.paint : 'studio') : sel[shown as keyof Selection];
  return <div className={`stage-photo show-${group}`}
    onTouchStart={e => { start.current = e.touches[0]!.clientX; }}
    onTouchEnd={e => {
      const dx = e.changedTouches[0]!.clientX - (start.current ?? 0);
      start.current = null;
      if (onSwipe && Math.abs(dx) > 40) onSwipe(dx < 0 ? 1 : -1);
    }}>
    <div className="layers">
      {layers.map(l => <img key={`${l.group}-${l.id}`} src={l.src} decoding="async" draggable={false}
        alt={l.group === group && l.id === active ? (group === 'car' ? `BMC ${MODELS[model].name}${renders ? ' in ' + opt('paint', l.id).name : ''}` : DETAILS[group as StepKey]!.caption) : ''}
        className={`${l.group}${l.group === group && l.id === active ? ' on' : ''}`}/>)}
    </div>
    {group === 'car' && !renders && <span className="veil">Being photographed in the atelier</span>}
    {step === 'mono' && sel.mono && <span className="stitch" aria-hidden="true">{sel.mono}</span>}
    <span className="stage-caption">{step === 'mono' ? 'Embroidered in the seat' : detail ? detail.caption : `${MODELS[model].name} · ${MODELS[model].category}`}</span>
  </div>;
}

function Swatch({ o, step }: { o: Option; step: StepKey }) {
  const src = DETAILS[step]?.images[o.id];
  return src ? <i className={step} style={{ backgroundImage: `url(${src})` }}/> : <i className="lacquer" style={{ backgroundColor: o.hex }}/>;
}

function Summary({ model, sel }: { model: ModelId; sel: Selection }) {
  const m = MODELS[model];
  return <div className="stack" style={{ gap: 36 }}>
    <div className="stack" style={{ gap: 14 }}>
      <span className="label">Your {m.category}</span>
      <h2 className="choice-name">The {m.name}</h2>
      <p className="muted">{opt('paint', sel.paint).name} · {opt('wheel', sel.wheel).name} · {opt('leather', sel.leather).name} · {opt('material', sel.material).name}{sel.mono ? ` · ${sel.mono}` : ''}</p>
    </div>
    <dl className="specs">{m.specs.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}{s.unit && <small>{s.unit}</small>}</dd></div>)}</dl>
    <p className="muted">{m.engine}</p>
    <div className="stack" style={{ gap: 18, textAlign: 'left' }}>
      <span className="label">Your build, month by month</span>
      <ol className="journey">
        {STAGES.map(s => <li key={s.name}>
          <time>{s.at === 0 ? 'On signing' : monthYear(Math.round(m.weeks * s.at) + 2)}</time>
          <b>{s.name}</b><small>{s.note}</small>
        </li>)}
      </ol>
      <p className="muted" style={{ fontSize: 13 }}>About {m.weeks} weeks from sign-off, if you begin today. An illustrative estimate.</p>
    </div>
    <Link to="/book" search={{ c: encode(model, sel) }} className="btn solid">Start your creation</Link>
  </div>;
}
