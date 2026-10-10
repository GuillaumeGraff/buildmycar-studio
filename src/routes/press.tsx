import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';
import { PRESS } from '@/components/atelier/data';

export const Route = createFileRoute('/press')({ head: () => pageHead('Press', 'What the specialist press writes about BuildMyCar.'), component: Press });

function Press() {
  return <div className="page">
    <div className="wrap page-head"><span className="label">Press</span><h2>What they <em>write.</em></h2></div>
    <div className="wrap" style={{ paddingBottom: 104 }}>
      <div className="press">{PRESS.map(p => <div className="cutting" key={p.by}><blockquote>“{p.q}”</blockquote><cite>{p.by}</cite></div>)}</div>
      <p className="disclaimer">Sample quotes written for this prototype. Replace them with real press coverage before any public use.</p>
    </div>
  </div>;
}
