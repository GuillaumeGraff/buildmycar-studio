import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Car } from '@/components/atelier/car';
import { MODELS, opt } from '@/components/atelier/data';
import { persona, personaSearch } from '@/components/atelier/platform';
import { PersonaBar, DemoNote } from '@/components/atelier/personas';
import { MembersGate, MembersNav } from '@/components/atelier/members';

export const Route = createFileRoute('/passport')({
  validateSearch: personaSearch,
  head: () => pageHead('Digital passport', 'Every BMC car carries a certified record of its build, its makers, its materials and its owners.'),
  component: Passport,
});

function Passport() {
  const p = persona(Route.useSearch().p);
  return <MembersGate p={p}><Certificate p={p}/></MembersGate>;
}

function Certificate({ p }: { p: ReturnType<typeof persona> }) {
  const pp = p.passport;
  return <div className="page">
    <div className="wrap page-head">
      <span className="label">Digital passport</span>
      <h2>The story of the car, <em>certified.</em></h2>
      <p className="lead">Who made it, from what, and who has owned it. Signed by the atelier and kept for the life of the car.</p>
      <MembersNav p={p}/>
      <PersonaBar to="/passport" current={p.id}/>
    </div>
    <div className="wrap narrow">
      <article className="passport">
        <header>
          <div><span className="label">Certificate</span><h3>{pp.chassis}</h3></div>
          <span className="seal" aria-hidden="true">BMC</span>
        </header>
        <Car model={p.model} paint={p.sel.paint} wheel={p.sel.wheel} leather={p.sel.leather}/>
        <ul className="recap">
          <li><span>Model</span><span>{MODELS[p.model].name}</span></li>
          <li><span>Finish</span><span>{opt('paint', p.sel.paint).name}</span></li>
          <li><span>Delivered</span><span>{pp.delivered}</span></li>
          <li><span>Hand work</span><span>{pp.hours.toLocaleString('en-US')} hours</span></li>
        </ul>
        <div className="pass-block"><span className="label">Origin of materials</span>
          {pp.origins.map(o => <p key={o.what}><b className="ivory">{o.what}</b> · {o.from}</p>)}</div>
        <div className="pass-block"><span className="label">Signed by</span>
          <p className="sigs"><span>Clément</span><span>{p.artisan.name.split(' ')[0]}</span><span>Karl-Henry</span></p></div>
        <div className="pass-block"><span className="label">Owners</span>{pp.owners.map(o => <p key={o}>{o}</p>)}</div>
        <div className="pass-block"><span className="label">Care</span>{pp.services.map(s => <p key={s}>{s}</p>)}</div>
        <div className="row-gap">
          <button className="btn solid" onClick={() => toast('Passport verified', { description: `${pp.chassis} · signed by the BMC atelier` })}>Verify</button>
          <button className="link" onClick={() => toast('Private link created', { description: 'Shared read-only with the insurer for 30 days.' })}>Share with an insurer</button>
        </div>
      </article>
      <DemoNote/>
    </div>
  </div>;
}
