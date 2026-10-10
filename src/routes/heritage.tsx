import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';

export const Route = createFileRoute('/heritage')({ head: () => pageHead('Heritage', 'Four decades of coachbuilding in Munich, one client and one car at a time.'), component: Heritage });

const ERAS = [
  ['1981', 'The first commission', 'A small workshop in Munich builds one car for one client. The rule is set: the car begins with a conversation, not a catalogue.'],
  ['1990s', 'The coachbuilder’s hand', 'Aluminium bodies are still shaped over wooden bucks, panel by panel. Each car takes more than two thousand hours.'],
  ['2000s', 'A circle of artisans', 'Leather masters, cabinet makers and lacquer artists join the house, invited one commission at a time.'],
  ['Today', 'The digital atelier', 'Clients co-create from anywhere, and every car receives a certified digital passport that records its story for life.'],
];

function Heritage() {
  return <div className="page">
    <div className="wrap page-head">
      <span className="label">Heritage</span>
      <h2>Four decades.<br/>One uncompromising <em>pursuit.</em></h2>
      <p className="lead">Since 1981, BuildMyCar has followed a single idea: the most remarkable car is the one that could only belong to you.</p>
    </div>
    <div className="wrap" style={{ paddingBottom: 96 }}>
      {ERAS.map(([t, h, p]) => <div className="era" key={t}><time>{t}</time><div><h3>{h}</h3><p>{p}</p></div></div>)}
    </div>
    <section><div className="wrap">
      <span className="label">What never changes</span>
      <div className="pillars" style={{ marginTop: 36 }}>
        <div className="pillar"><h3>One client, <em>one car.</em></h3><p>No series, no stock. Every BMC exists because one person asked for it.</p></div>
        <div className="pillar"><h3>Made by <em>hand.</em></h3><p>Coachwork, leather and wood are finished by craftspeople who sign their work.</p></div>
        <div className="pillar"><h3>Rare by <em>intention.</em></h3><p>Twenty to thirty cars a year. The relationship grows, the volume never does.</p></div>
      </div>
    </div></section>
  </div>;
}
