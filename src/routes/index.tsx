import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { PRESS } from '@/components/atelier/data';

const featured = PRESS[0]!;

export const Route = createFileRoute('/')({ head: () => pageHead('Bespoke, beyond compare', 'Since 1981, BuildMyCar has united human craftsmanship and digital precision in 20–30 bespoke luxury vehicles each year.'), component: Home });

function Home() {
  return <div className="page">
    <div className="hero"><div className="wrap">
      <span className="label">BuildMyCar · Coachbuilders since 1981</span>
      <h1>Where human craftsmanship<br/>meets <em>digital precision.</em></h1>
      <div className="hero-car"><Car animated/></div>
      <div className="row-gap center"><Link to="/configure" className="btn">Configure your car</Link><Link to="/book" className="btn solid">Book a meeting</Link></div>
    </div></div>
    <section><div className="wrap">
      <span className="label">The house</span>
      <h2 style={{ marginTop: 20 }}>Twenty to thirty cars a year.<br/><em>Never more.</em></h2>
      <div className="trio">
        <Link to="/heritage" className="door"><h3>Our heritage</h3><p>Four decades of coachbuilding in Munich, one client at a time.</p><span className="link">Discover</span></Link>
        <Link to="/configure" className="door"><h3>Configure</h3><p>Choose a silhouette, then shape it finish by finish.</p><span className="link">Begin</span></Link>
        <Link to="/maison" className="door"><h3>The Maison</h3><p>Meet the six people who lead the house.</p><span className="link">Meet them</span></Link>
      </div>
    </div></section>
    <section><div className="wrap quote">
      <blockquote>“{featured.q}”</blockquote>
      <span className="label">{featured.by}</span>
      <Link to="/press" className="link" style={{ alignSelf: 'center' }}>Read the press</Link>
    </div></section>
  </div>;
}
