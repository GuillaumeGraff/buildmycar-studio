// Content for the BMC Atelier platform demo. Every person, car and event here is illustrative.
import type { ModelId, Selection } from './data';

export type PersonaId = 'europe' | 'us' | 'uae' | 'china';
type Msg = { from: 'client' | 'designer' | 'artisan'; text: string; swatch?: string };
export type Persona = {
  id: PersonaId; name: string; age: number; city: string; region: string; tagline: string; need: string;
  model: ModelId; sel: Selection; artisan: { name: string; craft: string; city: string };
  language: string; session: string; studio: Msg[]; proposal: { title: string; note: string; swatch: string };
  passport: { chassis: string; delivered: string; hours: number; origins: { what: string; from: string }[]; owners: string[]; services: string[] };
  journey: { step: string; text: string; to: '/configure' | '/studio' | '/passport' | '/owners-circle' | '/book' }[];
};

export const PERSONAS: Record<PersonaId, Persona> = {
  europe: {
   id: 'europe', name: 'Klaus Brenner', age: 61, city: 'Munich', region: 'EUROPEAN CLIENT', tagline: 'Owns four coachbuilt cars from the 1960s and wants his first new one.',
    need: 'Provenance, history and a car that will hold its value for his children.',
    model: 'gt', sel: { paint: 'noir', wheel: 'wire', leather: 'cognac', material: 'walnut', mono: 'KB' },
    artisan: { name: 'Johann Keller', craft: 'Marquetry master', city: 'Black Forest' },
    language: 'German', session: 'Thursday · 10:00 at the Munich atelier',
    studio: [
      { from: 'designer', text: 'Klaus, the third sketch keeps the 1964 roofline you liked, with a longer rear overhang.' },
      { from: 'client', text: 'Better. The tail is right now. Could the fascia echo my father’s Adler typewriter?' },
      { from: 'artisan', text: 'I have a walnut burl from a single tree near Freudenstadt. Here is a first sample for the fascia.', swatch: '#5c3a22' },
    ],
    proposal: { title: 'Walnut fascia with brass inlay', note: 'Single-tree burl, typewriter-key brass detail', swatch: '#6b4528' },
    passport: { chassis: 'BMC-2027-014', delivered: 'March 2028', hours: 5200, origins: [{ what: 'Figured walnut', from: 'One tree, Freudenstadt, Black Forest' }, { what: 'Cognac hides', from: 'Single tannery, Bavaria' }, { what: 'Atelier Noir', from: '14 coats, Munich paint shop' }], owners: ['Klaus Brenner, from 2028'], services: ['2029 · First service, Munich', '2031 · Concours preparation, Villa d’Este'] },
    journey: [
      { step: 'Discover', text: 'Meets Guillaume, our Client Director for Europe, at a Munich concours and visits the atelier.', to: '/book' },
      { step: 'Configure', text: 'Starts from the Grand Tourer in Atelier Noir with wire wheels, close to his 1960s cars.', to: '/configure' },
      { step: 'Co-create', text: 'Works in person and in the studio with a designer and a Black Forest marquetry master.', to: '/studio' },
      { step: 'Passport', text: 'Receives a certified passport, and asks for his four classic cars to be documented too.', to: '/passport' },
      { step: 'Circle', text: 'Shows the car at Villa d’Este and uses the circle’s restoration partners for his classics.', to: '/owners-circle' },
    ],
  },
  us: {
    id: 'us', name: 'Rachel Morgan', age: 44, city: 'Los Angeles', region: 'US client', tagline: 'Tech founder who has never visited Munich and never will before delivery.',
    need: 'Speed, transparency and a process that fits between board meetings.',
    model: 'roadster', sel: { paint: 'argent', wheel: 'monobloc', leather: 'cognac', material: 'alu', mono: 'RM' },
    artisan: { name: 'Marco Ferri', craft: 'Saddle-leather master', city: 'Bologna' },
    language: 'English', session: 'Tuesday · 08:00 Los Angeles, 17:00 Munich',
    studio: [
      { from: 'designer', text: 'Rachel, here is the Roadster in 1981 Argent with the machined aluminium interior.' },
      { from: 'client', text: 'Love it. I want the cabin to feel like a camera, not a living room.' },
      { from: 'artisan', text: 'Then a cognac saddle leather, stitched by hand at 11 stitches per inch, and nothing else. Sample attached.', swatch: '#87532e' },
    ],
    proposal: { title: 'Saddle-leather wrap on the aluminium dash', note: 'Hand-stitched, no veneer anywhere', swatch: '#8a5631' },
    passport: { chassis: 'BMC-2027-019', delivered: 'June 2028', hours: 4300, origins: [{ what: 'Saddle leather', from: 'Hand-stitched in Bologna' }, { what: 'Aluminium', from: 'Machined in Munich, no veneer' }, { what: '1981 Argent', from: 'The founding silver, 12 coats' }], owners: ['Rachel Morgan, from 2028'], services: ['2028 · Delivered to Malibu by enclosed transport', '2029 · Service at home by a travelling technician'] },
    journey: [
      { step: 'Discover', text: 'Hears about BMC from an owner and books a video call with Candice the same evening.', to: '/book' },
      { step: 'Configure', text: 'Shapes a Roadster in 1981 Argent on her phone between two meetings.', to: '/configure' },
      { step: 'Co-create', text: 'Approves every choice in the studio, with a Bologna leather master joining by video.', to: '/studio' },
      { step: 'Passport', text: 'Follows the build week by week and receives the passport with the car.', to: '/passport' },
      { step: 'Circle', text: 'Has the car serviced at home and joins the owners’ breakfast at Pebble Beach.', to: '/owners-circle' },
    ],
  },
  uae: {
   id: 'uae', name: 'Omar Al Mansouri', age: 38, city: 'Dubai', region: 'UAE CLIENT', tagline: 'Runs a family office and orders cars for himself and his brother.',
    need: 'Absolute privacy, home visits and pieces that carry the family’s story.',
    model: 'brake', sel: { paint: 'bordeaux', wheel: 'classic', leather: 'ivoire', material: 'pearl', mono: 'OAM' },
    artisan: { name: 'Rami Haddad', craft: 'Mother-of-pearl inlay master', city: 'Damascus tradition, Dubai studio' },
    language: 'English and Arabic', session: 'Sunday · at the family majlis, Dubai',
    studio: [
      { from: 'designer', text: 'Omar, the two Shooting Brakes share the Bordeaux, and each has its own inlay pattern.' },
      { from: 'client', text: 'My brother’s should carry our grandfather’s falcon. Mine the palm of our first farm.' },
      { from: 'artisan', text: 'I will set both motifs in mother-of-pearl, by hand, in the fascia and the sill plates. First sample here.', swatch: '#d9d4c8' },
    ],
    proposal: { title: 'Falcon and palm inlays, a pair', note: 'Mother-of-pearl, set by hand, two cars', swatch: '#e2ddd1' },
    passport: { chassis: 'BMC-2027-021 & 022', delivered: 'October 2028', hours: 10400, origins: [{ what: 'Mother-of-pearl', from: 'Set by hand in Dubai' }, { what: 'Bordeaux Velours', from: 'Deep tinted clear, Munich' }, { what: 'Ivoire calf', from: 'Bavarian tannery' }], owners: ['The Al Mansouri family office, from 2028'], services: ['2028 · Climate-controlled storage, Dubai', '2029 · Summer storage and service, Munich'] },
    journey: [
      { step: 'Discover', text: 'Is introduced by a Circle member, then visited at home by Nicolas, in Arabic.', to: '/book' },
      { step: 'Configure', text: 'Chooses two Shooting Brakes in Bordeaux Velours, one for each brother.', to: '/configure' },
      { step: 'Co-create', text: 'Shapes two family inlays with a mother-of-pearl master, every session private.', to: '/studio' },
      { step: 'Passport', text: 'Holds two linked passports in the family office, shared only with the insurer.', to: '/passport' },
      { step: 'Circle', text: 'Keeps the cars in Dubai in winter and Munich in summer, through the circle’s partners.', to: '/owners-circle' },
    ],
  },
  china: {
   id: 'china', name: 'Li Wei', age: 35, city: 'Shanghai', region: 'CHINESE CLIENT', tagline: 'First-generation collector who wants a European car that speaks of China.',
    need: 'Co-creation that honours Chinese craft and symbols, as Hongqi does, with a European house.',
    model: 'gt', sel: { paint: 'jade', wheel: 'classic', leather: 'celadon', material: 'ebony', mono: 'LW' },
    artisan: { name: 'Lin Yuhua', craft: 'Fuzhou lacquer master', city: 'Fuzhou' },
    language: 'Mandarin, with Sharmaine', session: 'Wednesday · 16:00 Shanghai, 10:00 Munich',
    studio: [
      { from: 'designer', text: 'Li Wei, here is the Grand Tourer in Imperial Jade. We kept the bonnet long, as you asked.' },
      { from: 'client', text: 'Beautiful. Could the lacquer carry a cloud pattern, very faint, only visible in the sun?' },
      { from: 'artisan', text: 'Fuzhou bodiless lacquer, forty coats, with the auspicious cloud in the final layers. Sample attached.', swatch: '#2f5f52' },
    ],
    proposal: { title: 'Auspicious cloud in the jade lacquer', note: 'Fuzhou lacquer, visible only in direct sun', swatch: '#356b5c' },
    passport: { chassis: 'BMC-2027-018', delivered: 'August 2028, on the 8th', hours: 6100, origins: [{ what: 'Imperial Jade', from: 'Fuzhou lacquer, 40 coats by Lin Yuhua' }, { what: 'Macassar ebony', from: 'Certified reclaimed' }, { what: 'Céladon nappa', from: 'Vegetable tanned, Bavaria' }], owners: ['Li Wei, from 2028'], services: ['2028 · Delivery ceremony, the Bund, Shanghai', '2029 · Service by the BMC partner in Shanghai'] },
    journey: [
      { step: 'Discover', text: 'Meets Sharmaine at a private Shanghai salon and books a first session in Mandarin.', to: '/book' },
      { step: 'Configure', text: 'Starts from the Grand Tourer in Imperial Jade with Céladon leather.', to: '/configure' },
      { step: 'Co-create', text: 'Co-creates with a Munich designer and a Fuzhou lacquer master, in Mandarin.', to: '/studio' },
      { step: 'Passport', text: 'Receives a bilingual passport that tells the lacquer’s story, and a delivery on the 8th.', to: '/passport' },
      { step: 'Circle', text: 'Hosts the circle’s lantern evening in Shanghai and introduces two friends.', to: '/owners-circle' },
    ],
  },
};
export const PERSONA_IDS = Object.keys(PERSONAS) as PersonaId[];
export const persona = (id?: string) => PERSONAS[(id && id in PERSONAS ? id : 'china') as PersonaId];
export const personaSearch = (s: Record<string, unknown>): { p?: PersonaId | undefined } => {
  const p = s['p'];
  return { p: typeof p === 'string' && p in PERSONAS ? (p as PersonaId) : undefined };
};

// Private events open to every member, wherever they live, set around the great weeks of each city,
// each with what BMC itself does there. Illustrative.
export type CircleEvent = { date: string; name: string; place: string; bmc: string };
export const EVENTS: { continent: string; events: CircleEvent[] }[] = [
  { continent: 'Europe', events: [
    { date: 'April', name: 'Design Week salon', place: 'Milan · Design Week', bmc: 'BMC takes a palazzo in Brera for the week. Owners preview next year’s leathers and woods with our artisans, then dine in the courtyard.' },
    { date: 'May', name: 'Grand Prix terrace', place: 'Monaco · Grand Prix weekend', bmc: 'Our terrace above the harbour for qualifying and the race, and an owners’ convoy along the Corniche on Sunday morning.' },
    { date: 'September', name: 'Atelier open evening', place: 'Munich · the BMC atelier', bmc: 'The one night a year the atelier opens to owners: next year’s cars in build, and the hands that build them.' },
    { date: 'October', name: 'Fashion Week dinner', place: 'Paris · Fashion Week', bmc: 'An owners’ dinner on the Left Bank with the couture ateliers whose craft inspires our trims, and one car shown in private.' },
  ] },
  { continent: 'Middle East', events: [
    { date: 'January', name: 'Desert drive at dawn', place: 'Dubai · Al Qudra', bmc: 'Six owners and their BMCs on a sunrise run into the dunes, breakfast in the desert, our engineers along for the drive.' },
    { date: 'March', name: 'Collectors’ evening', place: 'Dubai · Art Dubai week', bmc: 'BMC shows one commissioned car beside the artist who designed its interior, for owners and their guests.' },
    { date: 'December', name: 'Season finale', place: 'Abu Dhabi · Grand Prix', bmc: 'A BMC suite above Yas Marina for the last race of the year, and a track morning for owners the day after.' },
  ] },
  { continent: 'Asia', events: [
    { date: 'February', name: 'Lantern evening', place: 'Shanghai · The Bund', bmc: 'Owners meet the Fuzhou lacquer masters who work with BMC, and a jade-lacquered car is unveiled by lantern light.' },
    { date: 'March', name: 'Art fair preview', place: 'Hong Kong · Art Basel week', bmc: 'A private walk through the fair before it opens, then an owners’ dinner above Victoria Harbour with our designers.' },
    { date: 'September', name: 'Night race suite', place: 'Singapore · Grand Prix', bmc: 'The BMC suite over Marina Bay for the night race, with a late supper for owners after the chequered flag.' },
  ] },
  { continent: 'Americas', events: [
    { date: 'February', name: 'Fashion Week dinner', place: 'New York · Fashion Week', bmc: 'An owners’ dinner in Tribeca before the shows, with a first look at the cars BMC will build next year.' },
    { date: 'August', name: 'Car Week breakfast', place: 'Monterey · Pebble Beach', bmc: 'BMC’s breakfast on the lawn, a convoy along 17-Mile Drive, and our team caring for owners’ cars all week.' },
    { date: 'December', name: 'Collectors’ evening', place: 'Miami Beach · Art Basel week', bmc: 'One commissioned car shown beside the work that inspired it, for owners and the collectors they bring.' },
  ] },
];
