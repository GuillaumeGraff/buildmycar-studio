import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Cat } from '@/components/atelier/cat';
import { KITTENS, STEPS, STYLES, DEFAULTS, MATCHES, opt, style, encode, decode, rememberKitten, type KittenId, type Option, type Selection, type StepKey } from '@/components/atelier/data';

export const Route = createFileRoute('/configure')({ head: () => pageHead('Configure your kitten', 'Choose one of five temperaments, then shape your kitten coat by coat. A joke, and an introduction to a real cat.'), component: Configure });

const top = () => window.scrollTo({ top: 0 });

async function share(kitten: KittenId, sel: Selection) {
  const url = `${window.location.origin}/configure?c=${encode(kitten, sel)}`;
  const title = `My BuildMyCat ${KITTENS[kitten].name}`;
  try {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url);
    toast('Link copied · anyone with it sees your kitten');
  } catch (e) {
    if ((e as Error).name !== 'AbortError') toast('Could not copy the link', { description: url });
  }
}

// From the first conversation to the homecoming, in weeks.
const STAGES = [
  { at: 0, name: 'First conversation', note: 'With your adoption director, in Munich or wherever you are' },
  { at: 0.2, name: 'Meet at the cat house', note: 'An hour on the floor, letting the cat decide' },
  { at: 0.4, name: 'Home visit', note: 'We check the windows, the balcony and the sofa’s structural integrity' },
  { at: 0.6, name: 'Vet check & microchip', note: 'Vaccines, chip and a first check-up, signed in the passport' },
  { at: 0.8, name: 'Kitten-proofing', note: 'Cables hidden, plants moved, expectations lowered' },
  { at: 1, name: 'Homecoming', note: 'A carrier, a blanket that smells of the foster family, and your sofa' },
];
const weekOf = (weeksFromNow: number) => { const d = new Date(); d.setDate(d.getDate() + weeksFromNow * 7); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }); };

const CHAPTERS: Record<StepKey, string> = { coat: 'Coat', eyes: 'Eyes', collar: 'Collar', toy: 'Toy', purr: 'Purr', summary: 'Your kitten' };
const IDS = Object.keys(KITTENS) as KittenId[];
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Configure() {
  const [kitten, setKitten] = useState<KittenId | null>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Selection>(DEFAULTS);

  // Open a shared kitten straight on its summary.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('c');
    const shared = code && decode(code);
    if (!shared) return;
    setKitten(shared.kitten); setIndex(IDS.indexOf(shared.kitten)); setSel(shared.sel); setStep(STEPS.length - 1);
  }, []);

  // Remember the kitten as it is shaped, so the studio opens on it.
  useEffect(() => { if (kitten) rememberKitten(kitten, sel); }, [kitten, sel]);

  if (!kitten) return <Showroom index={index} setIndex={setIndex} choose={k => { setKitten(k); setStep(0); setSel(DEFAULTS); top(); }}/>;

  const m = KITTENS[kitten], st = STEPS[step]!;
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
        <button className="chapters-back" onClick={() => { setKitten(null); top(); }} aria-label={`Back to the kittens, ${m.name}`}>‹ {m.name}</button>
        <span key={st.key} className="chapters-now">{CHAPTERS[st.key]}<small>{step + 1} / {STEPS.length}</small></span>
      </div>
      <div className="chapters-bar">
        {STEPS.map((s, i) => <button key={s.key} className="chapter" aria-label={CHAPTERS[s.key]} aria-current={i === step ? 'step' : undefined} data-done={i < step || undefined} onClick={() => setStep(i)}/>)}
      </div>
    </nav>

    <Stage kitten={kitten} sel={sel} step={st.key} stepIndex={step} onSwipe={st.opts ? cycle : undefined}/>

    <div className="wrap narrow choice">
      {current && st.opts && <>
        <span className="label">{st.title}</span>
        <h2 key={current.id} className="choice-name">{current.name}</h2>
        <p className="muted choice-note">{st.key === 'collar' ? `${current.name} · ${style(sel.style).name}, ${style(sel.style).note.toLowerCase()}` : current.note}</p>
        <div className="swatches" role="radiogroup" aria-label={st.key === 'collar' ? 'Collar colour' : st.title}>
          {st.opts.map(o => <button key={o.id} role="radio" aria-checked={o.id === current.id} aria-label={o.name} title={o.name} className="swatch" onClick={() => setSel({ ...sel, [key]: o.id })}>
            <Swatch o={o} step={st.key}/>
          </button>)}
        </div>
        {st.key === 'collar' && <div className="seat-finish" role="radiogroup" aria-label="Collar style">
          {STYLES.map(s => <button key={s.id} role="radio" aria-checked={style(sel.style).id === s.id} className={`seat-chip collar-${s.id}`} onClick={() => setSel({ ...sel, style: s.id })}><i aria-hidden="true"/>{s.name}</button>)}
        </div>}
        <p className="muted hint">{st.intro}</p>
      </>}

      {st.key === 'summary' && <Summary kitten={kitten} sel={sel}/>}

      <div className="nav-row">
        <button className="link" onClick={() => { if (step === 0) setKitten(null); else setStep(step - 1); top(); }}>Back</button>
        {next ? <button className="btn solid" onClick={() => setStep(step + 1)}>{CHAPTERS[next.key]}</button>
          : <button className="link" onClick={() => void share(kitten, sel)}>Share this kitten</button>}
      </div>
    </div>
  </div>;
}

// The five temperaments, one at a time, swiped like pages of a brochure.
function Showroom({ index, setIndex, choose }: { index: number; setIndex: (i: number) => void; choose: (k: KittenId) => void }) {
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const go = (i: number) => setIndex((i + IDS.length) % IDS.length);
  const k = IDS[index]!, m = KITTENS[k];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return <div className="page showroom">
    <div className="cat-strip" role="tablist" aria-label="Temperaments">
      {IDS.map((id, i) => <button key={id} role="tab" aria-selected={i === index} aria-label={`${KITTENS[id].name}, ${KITTENS[id].category}`} onClick={() => go(i)}>
        <Cat kitten={id}/><span>{KITTENS[id].name}</span>
      </button>)}
    </div>
    <div className={`slides${start.current !== null ? ' dragging' : ''}`} style={{ ['--drag' as string]: `${drag}px` }}
      onPointerDown={e => { if (e.pointerType !== 'mouse') { start.current = e.clientX; setDrag(0); } }}
      onPointerMove={e => { if (start.current !== null) setDrag(e.clientX - start.current); }}
      onPointerUp={() => { if (start.current === null) return; const dx = drag; start.current = null; setDrag(0); if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); }}
      onPointerCancel={() => { start.current = null; setDrag(0); }}>
      {IDS.map((id, i) => <figure key={id} className={`slide${i === index ? ' on' : ''}`} aria-hidden={i !== index}>
        <div className="hero-sketch">{i === index ? <Cat key="on" kitten={id} coat={DEFAULTS.coat} animated/> : <Cat key="off" kitten={id} coat={DEFAULTS.coat}/>}</div>
      </figure>)}
      <span className="render-note">Illustrative drawing</span>
      <button className="slide-arrow prev" aria-label="Previous temperament" onClick={() => go(index - 1)}>‹</button>
      <button className="slide-arrow next" aria-label="Next temperament" onClick={() => go(index + 1)}>›</button>
    </div>
    <div className="wrap showroom-copy" key={k} aria-live="polite">
      <span className="label">{m.category}</span>
      <h1 className="model-name">{m.name}</h1>
      <p className="engine">{m.engine}</p>
      <dl className="specs">{m.specs.map(s => <div key={s.label}><dt>{s.label}</dt><dd><Count value={s.value}/>{s.unit && <small>{s.unit}</small>}</dd></div>)}</dl>
      <p className="dream">{m.dream}</p>
      <button className="btn solid" onClick={() => choose(k)}>Configure your {m.name}</button>
    </div>
  </div>;
}

// Counts a figure up from zero, keeping its format (1.4 · 120).
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

// What the stage shows at each step: the whole kitten, framed on its face for the eyes and the collar.
const CAPTIONS: Partial<Record<StepKey, string>> = { eyes: 'Looking at you, or at the empty bowl', collar: 'Stitched by hand in Munich', toy: 'Chosen with our foster families', purr: 'Tuned by ear in Munich' };
function Stage({ kitten, sel, step, stepIndex, onSwipe }: { kitten: KittenId; sel: Selection; step: StepKey; stepIndex: number; onSwipe?: ((dir: number) => void) | undefined }) {
  const start = useRef<number | null>(null);
  const face = step === 'eyes' || step === 'collar';
  const toyStep = STEPS.findIndex(s => s.key === 'toy');
  return <div className={`stage-photo stage-cat${face ? ' face' : ''}`}
    onTouchStart={e => { start.current = e.touches[0]!.clientX; }}
    onTouchEnd={e => {
      const dx = e.changedTouches[0]!.clientX - (start.current ?? 0);
      start.current = null;
      if (onSwipe && Math.abs(dx) > 40) onSwipe(dx < 0 ? 1 : -1);
    }}>
    <div className="hero-sketch">
      <Cat kitten={kitten} coat={sel.coat} eyes={sel.eyes} collar={sel.collar} collarStyle={sel.style} toy={stepIndex >= toyStep ? sel.toy : undefined} purr={step === 'purr' ? sel.purr : undefined} focus={face ? 'face' : undefined}/>
    </div>
    <span className="render-note">Illustrative drawing</span>
    <span className="stage-caption">{CAPTIONS[step] ?? `${KITTENS[kitten].name} · ${KITTENS[kitten].category}`}</span>
  </div>;
}

function Swatch({ o, step }: { o: Option; step: StepKey }) {
  if (o.db) return <i className="sound"><b>{o.db}</b></i>;
  if (step === 'toy') return <i className={`toy-swatch toy-${o.id}`} style={{ backgroundColor: o.hex }}/>;
  if (o.hex2) return <i className="lacquer" style={{ background: `linear-gradient(90deg, ${o.hex} 50%, ${o.hex2} 50%)` }}/>;
  return <i className={`lacquer${o.stripes ? ' stripes' : ''}`} style={{ backgroundColor: o.hex }}/>;
}

function Summary({ kitten, sel }: { kitten: KittenId; sel: Selection }) {
  const m = KITTENS[kitten];
  const match = MATCHES[sel.coat] ?? MATCHES['silver']!;
  return <div className="stack" style={{ gap: 36 }}>
    <div className="stack" style={{ gap: 14 }}>
      <span className="label">Your {m.category.replace(/^The /, '')}</span>
      <h2 className="choice-name">The {m.name}</h2>
      <p className="muted">{opt('coat', sel.coat).name} · {opt('eyes', sel.eyes).name} eyes · {opt('collar', sel.collar).name} collar, {style(sel.style).name.toLowerCase()} · {opt('toy', sel.toy).name} · {opt('purr', sel.purr ?? 'salon').name} purr</p>
    </div>
    <dl className="specs">{m.specs.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}{s.unit && <small>{s.unit}</small>}</dd></div>)}</dl>
    <div className="confession">
      <span className="label">A small confession</span>
      <p>We don’t build kittens. Nobody should. But <em>{match.name}</em>, {match.age}, is waiting at our Munich house and looks a lot like yours.</p>
      <p className="muted">{match.note}</p>
    </div>
    <div className="stack" style={{ gap: 18, textAlign: 'left' }}>
      <span className="label">From first purr to homecoming</span>
      <ol className="journey">
        {STAGES.map(s => <li key={s.name}>
          <time>{s.at === 0 ? 'Today' : `Week of ${weekOf(Math.round(m.weeks * s.at))}`}</time>
          <b>{s.name}</b><small>{s.note}</small>
        </li>)}
      </ol>
      <p className="muted" style={{ fontSize: 13 }}>About {m.weeks} weeks from the first conversation, if you begin today and the cat agrees. An illustrative estimate.</p>
    </div>
    <Link to="/book" search={{ c: encode(kitten, sel) }} className="btn solid">Meet {match.name}</Link>
    <Link to="/studio" search={{ c: encode(kitten, sel) }} className="link">Open it in the studio</Link>
  </div>;
}
