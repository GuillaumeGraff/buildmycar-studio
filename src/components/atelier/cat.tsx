import { useId } from 'react';
import { KITTENS, opt, style as collarStyle, type KittenId, type Pose } from './data';

// Gold line drawing of a BuildMyCat kitten. `animated` draws it in, then fills the coat and lights the eyes;
// otherwise it is shown finished, dressed with the chosen coat, eyes, collar, toy and purr.
// `focus="face"` frames the head, for the eyes and collar steps of the configurator.

type Pt = [number, number];
const GROUND = 362;

// A leg or a tail as a closed, tapering shape from `a` to `b`, so it can be filled and outlined like the body.
function limb([ax, ay]: Pt, [bx, by]: Pt, w: number) {
  const len = Math.hypot(bx - ax, by - ay) || 1;
  const nx = -(by - ay) / len, ny = (bx - ax) / len, dx = (bx - ax) / len, dy = (by - ay) / len;
  const e = w * 0.8;
  const f = (n: number) => n.toFixed(1);
  return `M${f(ax + nx * w)},${f(ay + ny * w)} L${f(bx + nx * e)},${f(by + ny * e)} Q${f(bx + dx * e * 1.6)},${f(by + dy * e * 1.6)} ${f(bx - nx * e)},${f(by - ny * e)} L${f(ax - nx * w)},${f(ay - ny * w)} Z`;
}

type Shape = { head: [number, number, number]; body: string; tail: string; tailFront?: boolean; legs?: [Pt, Pt][]; lines?: string[]; toy: number };

const SHAPES: Record<Pose, Shape> = {
  // Sitting in profile, the tail wrapped round the front paws.
  side: { head: [404, 148, 62], toy: 540,
    body: 'M372,186 C306,204 262,262 262,312 C262,346 286,362 322,362 L440,362 C452,362 456,350 447,344 C444,300 450,244 436,198 Z',
    tail: 'M300,356 C350,374 424,374 474,352 C486,346 488,332 479,329 C470,327 467,338 458,342 C410,358 350,358 304,345 Z', tailFront: true,
    lines: ['M420,250 C418,292 420,332 424,360', 'M300,362 C292,322 318,294 352,302'] },
  // Sitting upright, facing you.
  front: { head: [320, 134, 64], toy: 160,
    body: 'M286,190 C254,232 240,302 248,362 L392,362 C400,302 386,232 354,190 Z',
    tail: 'M388,358 C430,364 464,346 464,316 C464,296 450,288 440,298 C450,302 452,314 450,322 C446,340 420,348 392,342 Z',
    lines: ['M302,256 C300,304 298,340 298,362', 'M338,256 C340,304 342,340 342,362', 'M282,362 Q298,350 314,362', 'M326,362 Q342,350 358,362'] },
  // The loaf: paws tucked, tail tucked, head resting on the front.
  loaf: { head: [430, 200, 60], toy: 560,
    body: 'M206,362 C182,362 172,330 182,300 C198,262 254,242 334,240 C404,238 458,256 472,302 C482,336 472,362 446,362 Z',
    tail: 'M214,360 C254,372 334,372 384,360 C388,352 380,348 374,352 C334,360 264,360 218,350 Z', tailFront: true,
    lines: ['M250,300 C280,286 320,282 352,288'] },
  // Walking, tail up like a question mark.
  walk: { head: [478, 156, 56], toy: 590,
    body: 'M252,182 C302,166 402,166 442,182 C472,196 474,240 452,256 C422,266 302,266 262,258 C226,250 216,202 252,182 Z',
    tail: 'M254,196 C216,186 194,150 198,110 C200,86 222,80 228,96 C220,100 214,110 214,122 C212,150 228,174 260,182 Z',
    legs: [[[436, 236], [442, GROUND - 6]], [[410, 244], [400, GROUND - 6]], [[268, 240], [252, GROUND - 6]], [[294, 248], [300, GROUND - 6]]] },
  // Full sprint at three in the morning.
  run: { head: [530, 172, 50], toy: 618,
    body: 'M182,214 C252,186 382,180 472,196 C506,204 512,240 490,252 C432,268 292,268 216,258 C182,252 162,232 182,214 Z',
    tail: 'M192,222 C152,200 102,190 52,200 C44,202 44,214 54,213 C102,206 150,214 188,238 Z',
    legs: [[[476, 240], [588, 282]], [[456, 248], [528, 318]], [[212, 246], [112, 300]], [[236, 252], [172, 336]]] },
};

export function Cat({ kitten = 'lap', animated = false, coat, eyes = 'amber', collar, collarStyle: cs, toy, purr, focus }: {
  kitten?: KittenId; animated?: boolean; coat?: string | undefined; eyes?: string | undefined; collar?: string | undefined; collarStyle?: string | undefined; toy?: string | undefined; purr?: string | undefined; focus?: 'face' | undefined;
}) {
  const k = KITTENS[kitten];
  const s = SHAPES[k.pose];
  const [hx, hy, r] = s.head;
  const id = useId().replace(/:/g, '');
  const c = coat ? opt('coat', coat) : undefined;
  const e = opt('eyes', eyes);
  const fill = c ? c.hex : `url(#${id}l)`;
  const P = (x: number, y: number) => `${(hx + x * r).toFixed(1)},${(hy + y * r).toFixed(1)}`;

  const head = `M${P(-1, .1)} L${P(-.86, -.5)} L${P(-.72, -1.42)} L${P(-.22, -.9)} Q${P(0, -.98)} ${P(.22, -.9)} L${P(.72, -1.42)} L${P(.86, -.5)} L${P(1, .1)} C${P(1, .62)} ${P(.55, .88)} ${P(0, .88)} C${P(-.55, .88)} ${P(-1, .62)} ${P(-1, .1)} Z`;
  const ears = `M${P(-.7, -1.14)} L${P(-.66, -.62)} M${P(.7, -1.14)} L${P(.66, -.62)}`;
  const eye = (x: number) => `M${P(x - .19, .04)} Q${P(x, -.2)} ${P(x + .19, .04)} Q${P(x, .26)} ${P(x - .19, .04)} Z`;
  const whiskers = [-1, 1].map(d => [.22, .38, .54].map((y, i) => `M${P(d * .3, .42)} L${P(d * 1.38, y + (i - 1) * .06)}`).join(' ')).join(' ');
  const legs = (s.legs ?? []).map(([a, b]) => limb(a, b, 10));
  const silhouette = [s.body, ...legs, s.tail];

  const fur = (d: string, key: string) => <g key={key}>
    <path className="lacquer coat" d={d} fill={fill}/>
    {c?.stripes && <path className="lacquer" d={d} fill={`url(#${id}t)`}/>}
    {c && <path className="lacquer" d={d} fill={`url(#${id}s)`}/>}
    <path className="ln" pathLength={1} d={d}/>
  </g>;

  const view = focus === 'face' ? `${hx - r * 2.6} ${hy - r * 1.75} ${r * 5.2} ${r * 3.2}` : '0 0 640 400';
  return <div className={`cat ${animated ? 'anim' : 'still'}`}>
    <svg viewBox={view} role="img" aria-label={`${k.name}, ${k.category}${c ? ' in ' + c.name : ''}`}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf7ef"/><stop offset="1" stopColor="#e2d5bc"/></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".2"/><stop offset=".5" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".28"/></linearGradient>
        <pattern id={`${id}t`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><rect width="7" height="22" fill="#5a2a0c" opacity=".28"/></pattern>
        <radialGradient id={`${id}f`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#cfb88a" stopOpacity=".3"/><stop offset="1" stopColor="#cfb88a" stopOpacity="0"/></radialGradient>
        <radialGradient id={`${id}r`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#ff4a3a" stopOpacity=".55"/><stop offset="1" stopColor="#ff4a3a" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx={320} cy={GROUND + 4} rx={260} ry={10} fill={`url(#${id}f)`}/>
      {silhouette.filter(d => d !== s.tail || !s.tailFront).map((d, i) => fur(d, `b${i}`))}
      {s.lines?.map((d, i) => <path key={i} className="ln fine late" pathLength={1} d={d}/>)}
      {s.tailFront && fur(s.tail, 'tail')}
      {fur(head, 'head')}
      <path className="ln fine late" pathLength={1} d={ears}/>
      <g className="lamp eyes">
        {[-.38, .38].map((x, i) => <g key={x}>
          <path d={eye(x)} fill={i === 1 && e.hex2 ? e.hex2 : e.hex}/>
          <ellipse cx={hx + x * r} cy={hy + .04 * r} rx={r * .045} ry={r * .13} fill="#141210"/>
          <circle cx={hx + (x - .05) * r} cy={hy - .02 * r} r={r * .03} fill="#fff" opacity=".8"/>
        </g>)}
      </g>
      <path className="ln fine" pathLength={1} d={`${eye(-.38)} ${eye(.38)}`}/>
      <path className="lacquer" d={`M${P(-.08, .3)} L${P(.08, .3)} L${P(0, .4)} Z`} fill="#c98b84"/>
      <path className="ln fine late" pathLength={1} d={`M${P(0, .4)} Q${P(-.1, .52)} ${P(-.2, .46)} M${P(0, .4)} Q${P(.1, .52)} ${P(.2, .46)}`}/>
      <path className="ln fine late whiskers" pathLength={1} d={whiskers}/>
      {collar && <Collar P={P} r={r} hex={opt('collar', collar).hex} kind={collarStyle(cs).id}/>}
      {toy && <Toy kind={toy} x={s.toy} id={id}/>}
      {purr && <Purr P={P} level={opt('purr', purr).db ?? 25}/>}
    </svg>
  </div>;
}

function Collar({ P, r, hex, kind }: { P: (x: number, y: number) => string; r: number; hex: string; kind: string }) {
  const band = `M${P(-.62, .74)} Q${P(0, 1.06)} ${P(.62, .74)}`;
  const [tx, ty] = P(0, .97).split(',').map(Number) as [number, number];
  return <g className="collar">
    <path d={band} fill="none" stroke={hex} strokeWidth={r * .14} strokeLinecap="round"/>
    <path className="ln fine" pathLength={1} d={band}/>
    {kind === 'plain' && <circle cx={tx} cy={ty + r * .1} r={r * .09} className="gold-fill"/>}
    {kind === 'bell' && <g><circle cx={tx} cy={ty + r * .12} r={r * .12} className="gold-fill"/><path d={`M${tx - r * .08},${ty + r * .16} L${tx + r * .08},${ty + r * .16}`} stroke="#5c4523" strokeWidth={1.2}/></g>}
    {kind === 'bow' && <path d={`M${tx},${ty} L${tx - r * .26},${ty - r * .12} L${tx - r * .26},${ty + r * .14} Z M${tx},${ty} L${tx + r * .26},${ty - r * .12} L${tx + r * .26},${ty + r * .14} Z`} fill={hex} stroke="var(--gold)" strokeWidth={1}/>}
    {kind === 'pearl' && [-.44, -.22, 0, .22, .44].map(x => <circle key={x} cx={Number(P(x, 0).split(',')[0])} cy={Number(P(0, .9 - x * x * .55).split(',')[1])} r={r * .055} fill="#f6f1e6" stroke="#c9b48a" strokeWidth={.8}/>)}
  </g>;
}

function Toy({ kind, x, id }: { kind: string; x: number; id: string }) {
  const g = GROUND;
  if (kind === 'feather') return <g className="toy">
    <path className="ln fine" pathLength={1} d={`M${x - 46},${g} C${x - 30},${g - 40} ${x - 6},${g - 70} ${x + 12},${g - 92}`}/>
    <path d={`M${x + 12},${g - 92} C${x + 4},${g - 120} ${x + 18},${g - 148} ${x + 40},${g - 158} C${x + 44},${g - 132} ${x + 34},${g - 106} ${x + 12},${g - 92} Z`} fill="#b08a52" className="lacquer"/>
    <path className="ln" pathLength={1} d={`M${x + 12},${g - 92} C${x + 4},${g - 120} ${x + 18},${g - 148} ${x + 40},${g - 158} C${x + 44},${g - 132} ${x + 34},${g - 106} ${x + 12},${g - 92} Z M${x + 12},${g - 92} L${x + 36},${g - 150}`}/>
  </g>;
  if (kind === 'box') return <g className="toy">
    <path className="lacquer" d={`M${x - 48},${g - 54} L${x + 48},${g - 54} L${x + 48},${g} L${x - 48},${g} Z`} fill="#c9a06b"/>
    <path className="ln" pathLength={1} d={`M${x - 48},${g - 54} L${x + 48},${g - 54} L${x + 48},${g} L${x - 48},${g} Z M${x - 48},${g - 54} L${x - 66},${g - 76} M${x + 48},${g - 54} L${x + 64},${g - 80} M${x - 20},${g - 30} L${x + 20},${g - 30}`}/>
  </g>;
  if (kind === 'mouse') return <g className="toy">
    <path className="lacquer" d={`M${x - 24},${g - 2} C${x - 24},${g - 26} ${x + 10},${g - 30} ${x + 26},${g - 6} Z`} fill="#9a9590"/>
    <path className="ln" pathLength={1} d={`M${x - 24},${g - 2} C${x - 24},${g - 26} ${x + 10},${g - 30} ${x + 26},${g - 6} Z M${x - 24},${g - 4} C${x - 44},${g - 2} ${x - 50},${g - 18} ${x - 64},${g - 10}`}/>
    <circle cx={x + 8} cy={g - 24} r={6} fill="#c9a8a0" className="lacquer"/>
  </g>;
  return <g className="toy laser">
    <circle cx={x} cy={g - 2} r={22} fill={`url(#${id}r)`}/>
    <circle cx={x} cy={g - 2} r={4.5} fill="#e0362c"/>
  </g>;
}

// Purr waves beside the head: one for Salon, two for Concert, three for Reference.
function Purr({ P, level }: { P: (x: number, y: number) => string; level: number }) {
  const n = level >= 50 ? 3 : level >= 35 ? 2 : 1;
  return <g className="purr">
    {Array.from({ length: n }, (_, i) => {
      const d = 1.25 + i * .32;
      return <path key={i} style={{ animationDelay: `${i * .25}s` }} d={`M${P(-d, -.45)} Q${P(-d - .22, .1)} ${P(-d, .65)}`}/>;
    })}
  </g>;
}
