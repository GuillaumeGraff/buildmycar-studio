// Animated gold line drawing of a BMC grand tourer: the outline draws itself, the lacquer fades in,
// the headlamp lights up and a band of light sweeps along the body.
const BODY = 'M62,232 C50,226 46,204 58,190 C92,170 150,160 214,152 C300,110 382,86 472,84 C544,84 592,104 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z';
const GLASS = 'M304,148 C362,112 422,99 480,98 C532,98 570,113 606,140 Z';

const spokes = (cx: number) => Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  const p = (r: number) => `${(cx + Math.cos(a) * r).toFixed(1)},${(236 + Math.sin(a) * r).toFixed(1)}`;
  return `M${p(9)} L${p(33)}`;
}).join(' ');

function Wheel({ cx, line }: { cx: number; line: string }) {
  return <>
    <circle className={line} pathLength={1} cx={cx} cy={236} r={52}/>
    <circle className={`${line} fine`} pathLength={1} cx={cx} cy={236} r={36}/>
    <path className={`${line} fine late`} pathLength={1} d={spokes(cx)}/>
    <circle className={`${line} fine late`} pathLength={1} cx={cx} cy={236} r={6}/>
  </>;
}

function Drawing({ line }: { line: string }) {
  return <>
    <path className="lacquer" d={BODY} fill="url(#bmc-lacq)"/>
    <path className="lacquer" d={GLASS} fill="url(#bmc-glass)"/>
    <g clipPath="url(#bmc-body)"><rect className="sweep" x={-60} y={60} width={180} height={200} fill="url(#bmc-beam)"/></g>
    <path className={line} pathLength={1} d={BODY}/>
    <path className={line} pathLength={1} d={GLASS}/>
    <path className={`${line} fine`} pathLength={1} d="M84,198 C300,188 640,180 934,188"/>
    <path className={`${line} fine late`} pathLength={1} d="M528,146 C526,180 522,206 518,228"/>
    <path className={`${line} late`} pathLength={1} d="M926,182 L950,190"/>
    <path className={`${line} late`} pathLength={1} d="M56,196 L74,192"/>
    <Wheel cx={236} line={line}/><Wheel cx={776} line={line}/>
  </>;
}

export function HeroCar({ className = '' }: { className?: string }) {
  return <div className={`hero-car ${className}`}>
    <svg viewBox="0 0 1000 330" role="img" aria-label="BMC grand tourer, drawn in gold">
      <defs>
        <linearGradient id="bmc-lacq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2620"/><stop offset=".42" stopColor="#121110"/><stop offset=".43" stopColor="#1a1815"/><stop offset="1" stopColor="#050505"/></linearGradient>
        <linearGradient id="bmc-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b352b"/><stop offset="1" stopColor="#0c0c0b"/></linearGradient>
        <linearGradient id="bmc-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f3e3bd" stopOpacity="0"/><stop offset=".5" stopColor="#f3e3bd" stopOpacity=".38"/><stop offset="1" stopColor="#f3e3bd" stopOpacity="0"/></linearGradient>
        <radialGradient id="bmc-lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff6dc" stopOpacity=".9"/><stop offset="1" stopColor="#cfb88a" stopOpacity="0"/></radialGradient>
        <radialGradient id="bmc-floor" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#cfb88a" stopOpacity=".22"/><stop offset="1" stopColor="#cfb88a" stopOpacity="0"/></radialGradient>
        <linearGradient id="bmc-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset=".35" stopColor="#000"/></linearGradient>
        <mask id="bmc-mirror"><rect x={0} y={288} width={1000} height={42} fill="url(#bmc-fade)"/></mask>
        <clipPath id="bmc-body"><path d={BODY}/></clipPath>
      </defs>
      <ellipse cx={500} cy={290} rx={470} ry={14} fill="url(#bmc-floor)"/>
      <g className="mirror" mask="url(#bmc-mirror)"><g transform="translate(0,576) scale(1,-1)"><Drawing line="lnm"/></g></g>
      <Drawing line="ln"/>
      <circle className="lamp" cx={944} cy={187} r={22} fill="url(#bmc-lamp)"/>
    </svg>
  </div>;
}
