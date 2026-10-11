import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { RENDERS } from '@/components/atelier/renders';
import { DETAILS, STUDIO } from '@/components/atelier/details';
import { MODELS, STEPS, SEATS, DEFAULTS, opt, seat, encode, decode, type ModelId, type Option, type Selection, type StepKey } from '@/components/atelier/data';

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

const CHAPTERS: Record<string, string> = { paint: 'Lacquer', wheel: 'Wheels', leather: 'Leather', material: 'Materials', sound: 'Sound', summary: 'Your car' };
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

  return <div className={`page fitting step-${st.key}`}>
    <nav className="chapters wrap" aria-label="Configuration steps">
      <div className="chapters-head">
        <button className="chapters-car" onClick={() => { setModel(null); top(); }} aria-label={`Back to the cars, ${m.name}`}>‹ {m.name}</button>
        <span key={st.key} className="chapters-now">{CHAPTERS[st.key]}<small>{step + 1} / {STEPS.length}</small></span>
      </div>
      <div className="chapters-bar">
        {STEPS.map((s, i) => <button key={s.key} className="chapter" aria-label={CHAPTERS[s.key]} aria-current={i === step ? 'step' : undefined} data-done={i < step || undefined} onClick={() => setStep(i)}/>)}
      </div>
    </nav>

    <Stage model={model} sel={sel} step={st.key} onSwipe={st.opts ? cycle : undefined}/>

    <div className="wrap narrow choice">
      {current && st.opts && <>
        <span className="label">{st.title}</span>
        <h2 key={current.id} className="choice-name">{current.name}</h2>
        <p className="muted choice-note">{st.key === 'leather' ? `${seat(sel.seat).name} · ${seat(sel.seat).note}` : current.note}</p>
        <div className="swatches" role="radiogroup" aria-label={st.key === 'leather' ? 'Leather colour' : st.title}>
          {st.opts.map(o => <button key={o.id} role="radio" aria-checked={o.id === current.id} aria-label={o.name} title={o.name} className="swatch" onClick={() => setSel({ ...sel, [key]: o.id })}>
            <Swatch o={o} step={st.key} finish={seat(sel.seat).id}/>
          </button>)}
        </div>
        {st.key === 'leather' && <div className="seat-finish" role="radiogroup" aria-label="Seat finish">
          {SEATS.map(s => <button key={s.id} role="radio" aria-checked={seat(sel.seat).id === s.id} className={`seat-chip seat-${s.id}`} onClick={() => setSel({ ...sel, seat: s.id })}><i aria-hidden="true"/>{s.name}</button>)}
        </div>}
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
    <div className="car-strip" role="tablist" aria-label="Cars">
      {IDS.map((id, i) => <button key={id} role="tab" aria-selected={i === index} aria-label={`${MODELS[id].name}, ${MODELS[id].category}`} onClick={() => go(i)}>
        <Car model={id}/><span>{MODELS[id].name}</span>
      </button>)}
    </div>
    <div className={`slides${start.current !== null ? ' dragging' : ''}`} style={{ ['--drag' as string]: `${drag}px` }}
      onPointerDown={e => { if (e.pointerType !== 'mouse') { start.current = e.clientX; setDrag(0); } }}
      onPointerMove={e => { if (start.current !== null) setDrag(e.clientX - start.current); }}
      onPointerUp={() => { if (start.current === null) return; const dx = drag; start.current = null; setDrag(0); if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); }}
      onPointerCancel={() => { start.current = null; setDrag(0); }}>
      {IDS.map((id, i) => <figure key={id} className={`slide${i === index ? ' on' : ''}`} style={{ ['--o' as string]: i - index }} aria-hidden={i !== index}>
        <Hero model={id} active={i === index}/>
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
  </div>;
}

// The car in its studio, or the empty studio while its photographs are being made.
function Hero({ model, active = true, paint = 'argent' }: { model: ModelId; active?: boolean; paint?: string }) {
  const renders = RENDERS[model];
  if (renders) return <img src={renders[paint] ?? Object.values(renders)[0]} alt={`BMC ${MODELS[model].name}`} draggable={false}/>;
  // Until its photographs exist, the car is drawn in gold in the empty studio, redrawn each time it comes into view.
  return <><img src={STUDIO} alt="" draggable={false}/>
    <div className="hero-sketch" role="img" aria-label={`BMC ${MODELS[model].name}, drawing`}>{active ? <Car key="on" model={model} animated/> : <Car key="off" model={model} paint={paint}/>}</div>
    <span className="veil">Photograph in the making</span></>;
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
  const shown = step;
  const detail = DETAILS[shown];
  const layers: { group: string; id: string; src: string }[] = [
    ...(renders ? Object.entries(renders).map(([id, src]) => ({ group: 'car', id, src })) : [{ group: 'car', id: 'studio', src: STUDIO }]),
    ...Object.entries(DETAILS).flatMap(([group, d]) => Object.entries(d!.images).map(([id, src]) => ({ group, id, src }))),
  ];
  const group = detail ? shown : 'car';
  const active = group === 'car' ? (renders ? sel.paint : 'studio') : group === 'leather' ? `${seat(sel.seat).id}-${sel.leather}` : sel[shown as keyof Selection];
  return <div className={`stage-photo show-${group} seat-${seat(sel.seat).id}`}
    onTouchStart={e => { start.current = e.touches[0]!.clientX; }}
    onTouchEnd={e => {
      const dx = e.changedTouches[0]!.clientX - (start.current ?? 0);
      start.current = null;
      if (onSwipe && Math.abs(dx) > 40) onSwipe(dx < 0 ? 1 : -1);
    }}>
    <div className="layers">
      {layers.filter(l => l.group === 'car' || l.group === group).map(l => <img key={`${l.group}-${l.id}`} src={l.src} decoding="async" draggable={false}
        alt={l.group === group && l.id === active ? (group === 'car' ? `BMC ${MODELS[model].name}${renders ? ' in ' + opt('paint', l.id).name : ''}` : DETAILS[group as StepKey]!.caption) : ''}
        className={`${l.group}${l.group === group && l.id === active ? ' on' : ''}`}/>)}
    </div>
    {group === 'car' && !renders && <div className="hero-sketch"><Car model={model} paint={sel.paint} wheel={sel.wheel} leather={sel.leather}/></div>}
    <span className="stage-caption">{detail ? detail.caption : `${MODELS[model].name} · ${MODELS[model].category}`}</span>
  </div>;
}

function Swatch({ o, step, finish }: { o: Option; step: StepKey; finish: string }) {
  const src = DETAILS[step]?.images[step === 'leather' ? `${finish}-${o.id}` : o.id];
  if (o.speakers) return <i className="sound"><b>{o.speakers}</b></i>;
  return src ? <i className={step} style={{ backgroundImage: `url(${src})` }}/> : <i className="lacquer" style={{ backgroundColor: o.hex }}/>;
}

function Summary({ model, sel }: { model: ModelId; sel: Selection }) {
  const m = MODELS[model];
  return <div className="stack" style={{ gap: 36 }}>
    <div className="stack" style={{ gap: 14 }}>
      <span className="label">Your {m.category}</span>
      <h2 className="choice-name">The {m.name}</h2>
      <p className="muted">{opt('paint', sel.paint).name} · {opt('wheel', sel.wheel).name} · {opt('leather', sel.leather).name}, {seat(sel.seat).name.toLowerCase()} · {opt('material', sel.material).name} · {opt('sound', sel.sound ?? 'salon').name} sound</p>
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
