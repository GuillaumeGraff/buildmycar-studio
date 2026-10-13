import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { pageHead } from '@/components/bmc/metadata';
import { Cat } from '@/components/atelier/cat';
import { KITTENS, opt } from '@/components/atelier/data';
import { persona, personaSearch } from '@/components/atelier/platform';
import { DemoNote } from '@/components/atelier/personas';
import { AdoptionRoom } from '@/components/atelier/members';

export const Route = createFileRoute('/passport')({
  validateSearch: personaSearch,
  head: () => pageHead('Cat passport', 'Every BuildMyCat cat leaves with a signed record of where it was found, who fostered it, its vaccines and its humans.'),
  component: Passport,
});

function Passport() {
  const p = persona(Route.useSearch().p);
  const pp = p.passport;
  return <AdoptionRoom p={p} title={<>The <em>passport.</em></>}>
      <article className="passport">
        <header>
          <div><span className="label">Certificate · microchip</span><h3>{pp.chip}</h3></div>
          <span className="seal" aria-hidden="true">BMC</span>
        </header>
        <Cat kitten={p.kitten} coat={p.sel.coat} eyes={p.sel.eyes} collar={p.sel.collar} collarStyle={p.sel.style}/>
        <ul className="recap">
          <li><span>Name</span><span>{p.cat}</span></li>
          <li><span>Temperament</span><span>{KITTENS[p.kitten].category}</span></li>
          <li><span>Coat</span><span>{opt('coat', p.sel.coat).name} · {opt('eyes', p.sel.eyes).name} eyes</span></li>
          <li><span>Homecoming</span><span>{pp.homecoming}</span></li>
          <li><span>Foster cuddles</span><span>{pp.hours.toLocaleString('en-US')} hours</span></li>
        </ul>
        <div className="pass-block"><span className="label">Story</span>
          {pp.origins.map(o => <p key={o.what}><b className="ivory">{o.what}</b> · {o.from}</p>)}</div>
        <div className="pass-block"><span className="label">Signed by</span>
          <p className="sigs"><span>Clément</span><span>{p.foster.name.split(' ')[0] === 'The' ? p.foster.name.split(' ')[1] : p.foster.name.split(' ')[0]}</span><span>Karl-Henry</span></p></div>
        <div className="pass-block"><span className="label">Humans</span>{pp.humans.map(o => <p key={o}>{o}</p>)}</div>
        <div className="pass-block"><span className="label">Care</span>{pp.care.map(s => <p key={s}>{s}</p>)}</div>
        <div className="row-gap">
          <button className="btn solid" onClick={() => toast('Passport verified', { description: `${pp.chip} · signed by the BuildMyCat house vet` })}>Verify</button>
          <button className="link" onClick={() => toast('Private link created', { description: 'Shared read-only with your cat sitter for 30 days, feeding notes included.' })}>Share with the cat sitter</button>
        </div>
      </article>
      <DemoNote/>
  </AdoptionRoom>;
}
