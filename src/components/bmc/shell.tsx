import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Car } from '@/components/atelier/car';

const links = [
  { to: '/heritage', label: 'Heritage' },
  { to: '/configure', label: 'Configure' },
  { to: '/platform', label: 'Atelier' },
  { to: '/maison', label: 'The Maison' },
  { to: '/press', label: 'Press' },
] as const;

export function Header({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => panel.current?.querySelector('a')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const onWide = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onWide);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onWide); };
  }, [open]);
  const close = () => setOpen(false);
  const circle = signedIn ? '/circle' : '/owners-circle';
  return <>
    <a className="skip" href="#content">Skip to content</a>
    <header className={open ? 'menu-open' : undefined}>
      <div className="wrap bar">
        <Link to="/" className="mark" aria-label="BuildMyCar home"><b>BMC</b><span>BuildMyCar · Est. 1981</span></Link>
        <nav className="main" aria-label="Main">
          {links.map(l => <Link key={l.to} to={l.to} activeProps={{ 'aria-current': 'page' }}>{l.label}</Link>)}
          <Link to={circle} activeProps={{ 'aria-current': 'page' }}>Owners’ Circle</Link>
        </nav>
        <div className="bar-end">
          <Link to="/book" className="book-btn" activeProps={{ 'aria-current': 'page' }}><span className="long">Private rendezvous</span><span className="short">Rendezvous</span></Link>
          <button ref={btn} className="burger" aria-expanded={open} aria-controls="menu-panel" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(o => !o)}><i/><i/><i/></button>
        </div>
      </div>
      {/* Always rendered so it can unfold from the burger and fold back into it. */}
      <nav ref={panel} id="menu-panel" className={`menu-panel${open ? ' open' : ''}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
        <Link to="/" onClick={close}>Home</Link>
        {links.map(l => <Link key={l.to} to={l.to} activeProps={{ 'aria-current': 'page' }} onClick={close}>{l.label}</Link>)}
        <Link to={circle} activeProps={{ 'aria-current': 'page' }} onClick={close}>Owners’ Circle</Link>
        <Link to="/book" className="menu-rdv" onClick={close}>Private rendezvous</Link>
      </nav>
    </header>
    <div className={`menu-backdrop${open ? ' open' : ''}`} onClick={close} aria-hidden="true"/>
  </>;
}

const COOKIE_KEY = 'bmc-cookies';
const readChoice = () => { try { return localStorage.getItem(COOKIE_KEY); } catch { return null; } };

export function Footer() {
  const [showCookies, setShowCookies] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { if (!readChoice()) setShowCookies(true); }, []);
  const choose = (choice: 'all' | 'essential') => {
    try { localStorage.setItem(COOKIE_KEY, choice); } catch { /* storage blocked */ }
    // The little car drives off with the choice, then the card closes.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLeaving(true);
    window.setTimeout(() => { setShowCookies(false); setLeaving(false); }, still ? 0 : 1100);
    toast(choice === 'all' ? 'Preferences saved · all cookies accepted' : 'Preferences saved · essential cookies only');
  };
  return <>
    <footer>
      <div className="wrap">
        <div className="foot">
          <div><h4>BuildMyCar</h4><span>Coachbuilders since 1981</span><span>Atelier by appointment, Munich</span><span>atelier@buildmycar.example</span></div>
          <div><h4>The house</h4>{links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}<Link to="/book">Start your creation</Link><Link to="/owners-circle">Owners’ Circle</Link></div>
          <div><h4>Information</h4><Link to="/privacy">Privacy policy</Link><Link to="/legal">Legal notice</Link><button onClick={() => setShowCookies(true)}>Cookie settings</button></div>
        </div>
        <div className="fine-print"><span>© 2026 BuildMyCar. All rights reserved.</span><span>Prototype by Yellow Team, ESSEC · illustrative content</span></div>
      </div>
    </footer>
    {showCookies && <div className={`cookie${leaving ? ' leaving' : ''}`} role="dialog" aria-label="Cookie consent">
      <div className="cookie-car" aria-hidden="true"><Car animated/></div>
      <span className="label">Your privacy</span>
      <p>We use essential cookies to run this site and, with your consent, measurement cookies to improve it. <Link to="/privacy" className="link">Read the policy</Link></p>
      <div className="row"><button className="btn solid" onClick={() => choose('all')}>Accept</button><button className="btn" onClick={() => choose('essential')}>Essential only</button></div>
    </div>}
  </>;
}
