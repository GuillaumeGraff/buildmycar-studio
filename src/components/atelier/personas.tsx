import { Link } from '@tanstack/react-router';
import { PERSONAS, PERSONA_IDS, type PersonaId } from './platform';

type To = '/platform' | '/studio' | '/passport' | '/owners-circle';

// Switch between the four illustrative clients on any platform screen.
export function PersonaBar({ to, current }: { to: To; current: PersonaId }) {
  return <nav className="persona-bar" aria-label="Client">
    {PERSONA_IDS.map(id => <Link key={id} to={to} search={{ p: id }} replace resetScroll={false} className={id === current ? 'on' : undefined} aria-current={id === current ? 'true' : undefined} activeOptions={{ includeSearch: true }}>
      <b>{PERSONAS[id].city}</b><small>{PERSONAS[id].region}</small>
    </Link>)}
  </nav>;
}

export function DemoNote() {
  return <p className="disclaimer">An illustrative design study. The clients, artisans, cars and events shown are fictional.</p>;
}
