import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/bmc/metadata';

export const Route = createFileRoute('/team')({
  head: () => pageHead('The people of the atelier', 'The small team behind BuildMyCar — leading design, client experience, artisan craft, finance and the house in Asia and the Middle East.'),
  component: Team,
});

const team = [
  { initials: 'GG', name: 'Guillaume Graff', role: 'Managing Director', bio: 'Leads the house and the BMC Atelier platform strategy.' },
  { initials: 'CT', name: 'Clément Tavernier', role: 'Chief Design Officer', bio: 'Guides every commission from first sketch to final sign-off.' },
  { initials: 'CA', name: 'Candice Anguiley Kaack', role: 'Director of Client Experience', bio: 'Looks after each client from invitation to the Owners’ Circle.' },
  { initials: 'KS', name: 'Karl-Henry Sanon', role: 'Head of Craft & Artisan Network', bio: 'Curates the master artisans who join each commission.' },
  { initials: 'NC', name: 'Nicolas Chaumont', role: 'Chief Financial Officer', bio: 'Steers configure-to-cost and the value of each relationship.' },
  { initials: 'SN', name: 'Sharmaine Ng', role: 'Director, Asia & Middle East', bio: 'Opens the house to clients in Shanghai, Dubai and beyond.' },
];

function Team() {
  return <>
    <div className="page-intro">
      <p className="eyebrow">THE HOUSE OF BMC · EST. 1981</p>
      <h1>The people behind<br/>each commission.</h1>
      <p className="text-muted-foreground text-xs max-w-md">A deliberately small team. Twenty to thirty automobiles a year means every one of them is known personally by the people who made it.</p>
    </div>

    <section className="section-wrap">
      <div className="flex justify-between items-end border-b border-border pb-6 mb-12">
        <h2 className="editorial-heading">Six rooms,<br/>one atelier.</h2>
        <span className="hidden md:block text-[10px] tracking-[2px] text-muted-foreground">THE TEAM · 01 / 06</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
        {team.map((person, i) => (
          <article key={person.name} className="reveal">
            <div className="team-plate" aria-hidden="true"><span>{person.initials}</span></div>
            <div className="flex justify-between mt-6 text-[8px] tracking-[2px] text-muted-foreground">
              <span>0{i + 1} · BMC ATELIER</span>
              <span>{person.initials}</span>
            </div>
            <p className="eyebrow mt-5">{person.role}</p>
            <h3 className="font-display text-3xl mt-3 leading-tight">{person.name}</h3>
            <p className="text-muted-foreground text-xs leading-7 mt-4 max-w-xs">{person.bio}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-wrap border-t border-border">
      <div className="grid md:grid-cols-[1fr_.8fr] gap-12 items-center">
        <div>
          <p className="eyebrow mb-5">A PERSONAL WORLD, BUILT AROUND YOU</p>
          <h2 className="editorial-heading">You will not be<br/>a number here.</h2>
          <p className="text-muted-foreground text-xs leading-7 mt-6 max-w-md">From the first conversation to the day your commission leaves the atelier, you deal with the same few people — by name.</p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          <Button asChild variant="commission"><Link to="/studio">Begin your commission <ArrowRight /></Link></Button>
          <Button variant="atelier" asChild><Link to="/auth">Owners’ Circle <ArrowUpRight /></Link></Button>
        </div>
      </div>
    </section>
  </>;
}
