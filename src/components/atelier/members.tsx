import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { persona } from './platform';

type P = ReturnType<typeof persona>;

// One quiet frame for the two adoption rooms: your kitten and its passport.
// Your kitten is the one you configured; the passport follows the example adopter.
export function AdoptionRoom({ p, title, wide, children }: { p: P; title: ReactNode; wide?: boolean; children: ReactNode }) {
  return <div className="page members">
    <div className={`wrap members-head${wide ? '' : ' narrow'}`}>
      <div className="members-top"><span className="label">Your adoption</span></div>
      <h2>{title}</h2>
      <nav className="members-nav" aria-label="Your adoption">
        <Link to="/studio" activeProps={{ 'aria-current': 'page' }} activeOptions={{ includeSearch: false }}>Your kitten</Link>
        <Link to="/passport" search={{ p: p.id }} activeProps={{ 'aria-current': 'page' }} activeOptions={{ includeSearch: false }}>Passport</Link>
      </nav>
    </div>
    <div className={`wrap members-body${wide ? '' : ' narrow'}`}>{children}</div>
  </div>;
}

// A row of quiet text tabs, used inside a room so it never runs long.
export function Tabs<T extends string>({ items, value, onChange, label, small }: { items: readonly T[]; value: T; onChange: (v: T) => void; label: string; small?: boolean }) {
  return <div className={`tabs${small ? ' small' : ''}`} role="tablist" aria-label={label}>
    {items.map(it => <button key={it} type="button" role="tab" aria-selected={value === it} onClick={() => onChange(it)}>{it}</button>)}
  </div>;
}
