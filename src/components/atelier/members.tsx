import { Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { persona } from './platform';

type P = ReturnType<typeof persona>;

// Demo sign-in shared by the members' pages (your car, its passport, the circle): no real account is created.
const DEMO_KEY = 'bmc-demo-circle';
const CHANGE = 'bmc-member-change';
const demoEmail = (name: string) => `${name.toLowerCase().normalize('NFD').replace(/[^a-z ]/g, '').trim().replace(/ +/g, '.')}@members.bmc`;
const read = () => { try { return sessionStorage.getItem(DEMO_KEY) === '1'; } catch { return false; } };
const write = (on: boolean) => {
  try { if (on) sessionStorage.setItem(DEMO_KEY, '1'); else sessionStorage.removeItem(DEMO_KEY); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(CHANGE));
};

export function useMember() {
  const [inside, setInside] = useState(false);
  useEffect(() => {
    const sync = () => setInside(read());
    sync();
    window.addEventListener(CHANGE, sync);
    return () => window.removeEventListener(CHANGE, sync);
  }, []);
  return { inside, enter: () => write(true), leave: () => write(false) };
}

export function MembersGate({ p, children }: { p: P; children: ReactNode }) {
  const { inside, enter } = useMember();
  const [checking, setChecking] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setChecking(true);
    window.setTimeout(() => { setChecking(false); enter(); window.scrollTo({ top: 0 }); }, 900);
  };
  if (inside) return <>{children}</>;
  return <div className="page"><div className="wrap narrow page-head gate">
    <span className="label">Members only</span>
    <h2>The Owners’ <em>Circle.</em></h2>
    <p className="lead">Your car in the making, its certified passport and the circle’s private events. Membership comes with your commission.</p>
    <form className="stack gate-form" onSubmit={submit}>
      <div className="entry"><label htmlFor="gmail">Member email</label><input id="gmail" readOnly value={demoEmail(p.name)}/></div>
      <div className="entry"><label htmlFor="gpass">Password</label><input id="gpass" type="password" readOnly value="demo-member"/></div>
      <button className="btn solid" type="submit" disabled={checking}>{checking ? 'Opening the circle…' : 'Enter the circle'}</button>
    </form>
    <p className="disclaimer">Demo access: the details are filled in for you as {p.name}, and no account is created. Real members sign in through the <Link to="/auth" className="link">Owners’ Circle login</Link>.</p>
  </div></div>;
}

// The three members' rooms, one tap apart, and the way out.
// Your car is your own commission; the passport and the circle follow the example client.
const ROOMS = [
  { to: '/passport', label: 'Passport' },
  { to: '/owners-circle', label: 'Circle' },
] as const;

export function MembersNav({ p }: { p: P }) {
  const { leave } = useMember();
  return <nav className="members-nav" aria-label="Owners’ Circle">
    <Link to="/studio" activeProps={{ 'aria-current': 'page' }} activeOptions={{ includeSearch: false }}>Your car</Link>
    {ROOMS.map(r => <Link key={r.to} to={r.to} search={{ p: p.id }} activeProps={{ 'aria-current': 'page' }} activeOptions={{ includeSearch: false }}>{r.label}</Link>)}
    <button className="sign-out" onClick={leave}>Sign out</button>
  </nav>;
}
