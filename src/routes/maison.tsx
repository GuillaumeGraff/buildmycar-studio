import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';
import { Portrait } from '@/components/atelier/portrait';
import { TEAM } from '@/components/atelier/data';

export const Route = createFileRoute('/maison')({ head: () => pageHead('The Maison', 'The six people who lead BuildMyCar and every commission.'), component: Maison });

function Maison() {
  return <div className="page">
    <div className="wrap page-head">
      <span className="label">The Maison</span>
      <h2>The people behind <em>every commission.</em></h2>
      <p className="lead">A small house by design. Six people lead BuildMyCar, between the Munich atelier, our designers and the master artisans we invite into each car.</p>
    </div>
    <div className="wrap" style={{ paddingBottom: 104 }}><div className="team">
      {TEAM.map(t => <div className="member" key={t.name}><Portrait sketch={t.sketch}/><h3>{t.name}</h3><span className="role">{t.role}</span><p>{t.text}</p><span className="sig">{t.name.split(' ')[0]}</span></div>)}
    </div></div>
  </div>;
}
