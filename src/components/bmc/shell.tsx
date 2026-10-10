import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const links = [
  { to: '/heritage', label: 'Heritage' },
  { to: '/configure', label: 'Configure' },
  { to: '/maison', label: 'The Maison' },
  { to: '/press', label: 'Press' },
] as const;

export function Header({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <>
    <header>
      <div className="wrap bar">
        <Link to="/" className="mark" aria-label="BuildMyCar home"><b>BMC</b><span>BuildMyCar · Est. 1981</span></Link>
        <nav className="main" aria-label="Main">
          {links.map(l => <Link key={l.to} to={l.to} activeProps={{ 'aria-current': 'page' }}>{l.label}</Link>)}
        </nav>
        <button className="menu-btn" aria-expanded={open} onClick={() => setOpen(true)}>Menu</button>
      </div>
    </header>
    {open && <div className="menu-panel">
      <button className="close" onClick={() => setOpen(false)}>Close</button>
      <Link to="/" onClick={() => setOpen(false)}>Home</Link>
      {links.map(l => <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>)}
      <Link to={signedIn ? '/circle' : '/auth'} onClick={() => setOpen(false)}>Owners’ Circle</Link>
    </div>}
  </>;
}

const COOKIE_KEY = 'bmc-cookies';
const readChoice = () => { try { return localStorage.getItem(COOKIE_KEY); } catch { return null; } };

export function Footer() {
  const [showCookies, setShowCookies] = useState(false);
  useEffect(() => { if (!readChoice()) setShowCookies(true); }, []);
  const choose = (choice: 'all' | 'essential') => {
    try { localStorage.setItem(COOKIE_KEY, choice); } catch { /* storage blocked */ }
    setShowCookies(false);
    toast(choice === 'all' ? 'Preferences saved · all cookies accepted' : 'Preferences saved · essential cookies only');
  };
  return <>
    <footer>
      <div className="wrap">
        <div className="foot">
          <div><h4>BuildMyCar</h4><span>Coachbuilders since 1981</span><span>Atelier by appointment, Munich</span><span>atelier@buildmycar.example</span></div>
          <div><h4>The house</h4>{links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}<Link to="/auth">Owners’ Circle</Link></div>
          <div><h4>Information</h4><Link to="/privacy">Privacy policy</Link><Link to="/legal">Legal notice</Link><button onClick={() => setShowCookies(true)}>Cookie settings</button></div>
        </div>
        <div className="fine-print"><span>© 2026 BuildMyCar. All rights reserved.</span><span>Prototype by Yellow Team, ESSEC · illustrative content</span></div>
      </div>
    </footer>
    {showCookies && <div className="cookie" role="dialog" aria-label="Cookie consent">
      <span className="label">Your privacy</span>
      <p>We use essential cookies to run this site and, with your consent, measurement cookies to improve it. <Link to="/privacy" className="link">Read the policy</Link></p>
      <div className="row"><button className="btn solid" onClick={() => choose('all')}>Accept</button><button className="btn" onClick={() => choose('essential')}>Essential only</button></div>
    </div>}
  </>;
}
