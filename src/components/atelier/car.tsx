import { useId } from 'react';
import { MODELS, opt, type ModelId } from './data';

// Gold line drawing of a BMC car. `animated` draws it in, fills the lacquer and lights the headlamp;
// otherwise the body is painted with the chosen finish.
export function Car({ model = 'gt', animated = false, paint, wheel = 'classic', leather }: { model?: ModelId; animated?: boolean; paint?: string; wheel?: string; leather?: string }) {
  const m = MODELS[model];
  const id = useId().replace(/:/g, '');
  const w = opt('wheel', wheel);
  const n = w.spokes ?? 12;
  const spokes = (cx: number) => Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n - Math.PI / 2;
    const p = (r: number) => `${(cx + Math.cos(a) * r).toFixed(1)},${(236 + Math.sin(a) * r).toFixed(1)}`;
    return `M${p(n === 5 ? 10 : 9)} L${p(33)}`;
  }).join(' ');
  const fill = paint ? opt('paint', paint).hex : `url(#${id}l)`;
  const glassFill = leather ? opt('leather', leather).hex : `url(#${id}g)`;
  const drawing = (ln: string) => <>
    <path className="lacquer paint" d={m.body} fill={fill}/>
    {paint && <path d={m.body} fill={`url(#${id}s)`}/>}
    <path className="lacquer" d={m.glass} fill={glassFill} opacity={leather ? 0.85 : 1}/>
    <g clipPath={`url(#${id}c)`}><rect className="sweep" x={-60} y={60} width={180} height={200} fill={`url(#${id}b)`}/></g>
    <path className={ln} pathLength={1} d={m.body}/>
    <path className={ln} pathLength={1} d={m.glass}/>
    <path className={`${ln} fine`} pathLength={1} d="M84,198 C300,188 640,180 934,188"/>
    <path className={`${ln} fine late`} pathLength={1} d={m.door}/>
    <path className={`${ln} late`} pathLength={1} d="M926,182 L950,190"/>
    <path className={`${ln} late`} pathLength={1} d="M56,198 L74,194"/>
    {[236, 776].map(cx => <g key={cx}>
      <circle className={ln} pathLength={1} cx={cx} cy={236} r={52}/>
      <circle className={`${ln} fine`} pathLength={1} cx={cx} cy={236} r={36}/>
      <path className={`${ln} fine late`} pathLength={1} style={{ strokeWidth: w.w }} d={spokes(cx)}/>
      <circle className={`${ln} fine late`} pathLength={1} cx={cx} cy={236} r={6}/>
    </g>)}
  </>;
  return <div className={`car ${animated ? 'anim' : 'still'}`}>
    <svg viewBox="0 0 1000 330" role="img" aria-label={`BMC ${m.name}${paint ? ' in ' + opt('paint', paint).name : ''}`}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2620"/><stop offset=".42" stopColor="#121110"/><stop offset=".43" stopColor="#1a1815"/><stop offset="1" stopColor="#050505"/></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".22"/><stop offset=".45" stopColor="#fff" stopOpacity="0"/><stop offset=".46" stopColor="#000" stopOpacity=".08"/><stop offset="1" stopColor="#000" stopOpacity=".45"/></linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b352b"/><stop offset="1" stopColor="#0c0c0b"/></linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f3e3bd" stopOpacity="0"/><stop offset=".5" stopColor="#f3e3bd" stopOpacity=".34"/><stop offset="1" stopColor="#f3e3bd" stopOpacity="0"/></linearGradient>
        <radialGradient id={`${id}h`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff6dc" stopOpacity=".9"/><stop offset="1" stopColor="#cfb88a" stopOpacity="0"/></radialGradient>
        <radialGradient id={`${id}f`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#cfb88a" stopOpacity=".22"/><stop offset="1" stopColor="#cfb88a" stopOpacity="0"/></radialGradient>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset=".35" stopColor="#000"/></linearGradient>
        <mask id={`${id}m`}><rect x={0} y={288} width={1000} height={42} fill={`url(#${id}d)`}/></mask>
        <clipPath id={`${id}c`}><path d={m.body}/></clipPath>
      </defs>
      <ellipse cx={500} cy={290} rx={470} ry={14} fill={`url(#${id}f)`}/>
      <g className="mirror" mask={`url(#${id}m)`}><g transform="translate(0,576) scale(1,-1)">{drawing('lnm')}</g></g>
      {drawing('ln')}
      <circle className="lamp" cx={944} cy={187} r={22} fill={`url(#${id}h)`}/>
    </svg>
  </div>;
}
