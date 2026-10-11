// Content for the BMC Atelier site. Edit names, specifications and texts here.
export type ModelId = 'gt' | 'roadster' | 'brake' | 'saloon' | 'hyper';
export type Option = { id: string; name: string; note: string; hex: string; spokes?: number; w?: number; speakers?: number };
export type Spec = { label: string; value: string; unit?: string };
export type StepKey = 'paint' | 'wheel' | 'leather' | 'material' | 'sound' | 'summary';
export type Step = { key: StepKey; title: string; intro: string; opts?: Option[] };

// The five BMC cars. `body`, `glass` and `door` draw each one in gold on the home page.
export const MODELS: Record<ModelId, { name: string; category: string; line: string; months: number; engine: string; specs: Spec[]; dream: string; body: string; glass: string; door: string }> = {
  gt: { name: 'Meridian', category: 'Grand Tourer', line: 'Four seats, a long bonnet and the range to cross a continent in one sitting.', months: 30,
    engine: '6.5-litre twin-turbo V12', specs: [{ label: 'Power', value: '830', unit: 'hp' }, { label: '0–100 km/h', value: '3.2', unit: 's' }, { label: 'Top speed', value: '325', unit: 'km/h' }],
    dream: 'Munich to Monaco in one sitting, with 1,000 Nm under your right foot and the cabin as quiet as a library.',
    body: 'M62,232 C50,226 46,204 58,190 C92,170 150,160 214,152 C300,110 382,86 472,84 C544,84 592,104 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M304,148 C362,112 422,99 480,98 C532,98 570,113 606,140 Z', door: 'M528,146 C526,180 522,206 518,228' },
  roadster: { name: 'Ciel', category: 'Roadster', line: 'Two seats, open to the sky, with a hand-stitched tonneau and a short, taut tail.', months: 28,
    engine: '6.0-litre naturally aspirated V12, 8,500 rpm', specs: [{ label: 'Power', value: '620', unit: 'hp' }, { label: '0–100 km/h', value: '3.4', unit: 's' }, { label: 'Top speed', value: '300', unit: 'km/h' }],
    dream: 'A low windscreen, a buttoned leather tonneau and a V12 that sings to 8,500 rpm.',
    body: 'M62,232 C50,226 46,206 58,194 C92,178 160,170 236,166 C262,150 300,146 326,160 L410,158 C430,150 446,146 462,148 L470,158 C560,158 720,160 902,170 C942,176 958,194 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M454,148 L470,124 L478,126 L476,158 Z', door: 'M520,160 C518,190 516,210 514,228' },
  brake: { name: 'Vesper', category: 'Shooting Brake', line: 'The grand tourer with a long glass roof, for the dogs, the guns or the luggage of a long summer.', months: 32,
    engine: '6.5-litre V12 hybrid', specs: [{ label: 'Power', value: '880', unit: 'hp' }, { label: '0–100 km/h', value: '3.0', unit: 's' }, { label: 'Top speed', value: '320', unit: 'km/h' }],
    dream: 'Two square metres of glass over your head, and a boot fitted with luggage made to measure in Munich.',
    body: 'M62,232 C50,226 48,204 54,180 C58,150 72,120 104,112 L470,92 C544,90 592,106 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M112,124 L470,104 C528,104 570,116 604,140 L128,148 C116,146 110,136 112,124 Z', door: 'M528,140 C526,176 522,206 518,228' },
  saloon: { name: 'Sovereign', category: 'Limousine', line: 'Five and a half metres of calm, built around the rear seats.', months: 34,
    engine: '6.6-litre V12 plug-in hybrid', specs: [{ label: 'Power', value: '720', unit: 'hp' }, { label: 'Rear recline', value: '42', unit: '°' }, { label: 'Silent range', value: '80', unit: 'km' }],
    dream: 'Reclining rear seats, a starlit headliner and a champagne cellar held at six degrees.',
    body: 'M58,232 C46,226 44,204 54,186 C80,172 130,166 196,162 C256,120 336,100 436,96 C526,94 604,104 662,140 C732,150 832,156 906,168 C944,174 960,192 956,214 C954,226 944,232 924,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M230,156 C286,120 356,106 436,106 C514,106 582,116 630,140 Z', door: 'M434,110 C432,170 430,206 428,228' },
  hyper: { name: 'Nocturne', category: 'Hyper Coupé', line: 'A carbon monocoque, three electric motors and one V8, for nineteen owners only.', months: 40,
    engine: '4.0-litre V8 and three electric motors', specs: [{ label: 'Power', value: '1,480', unit: 'hp' }, { label: '0–100 km/h', value: '2.1', unit: 's' }, { label: 'Top speed', value: '400', unit: 'km/h' }],
    dream: 'Nineteen cars, each named after its owner, and a weekend at Spa with our test driver before delivery.',
    body: 'M70,232 C56,226 52,208 60,196 C92,186 160,178 232,170 C330,140 424,124 522,122 C592,122 642,140 694,160 C782,170 880,180 940,192 C958,198 962,214 956,224 C952,230 944,232 926,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M382,146 C442,130 500,128 550,130 C600,134 640,148 668,160 Z', door: 'M562,156 C558,182 554,206 550,228' },
};

export const STEPS: Step[] = [
  { key: 'paint', title: 'Exterior finish', intro: 'Every colour is mixed for one car and laid by hand, coat after coat.', opts: [
    { id: 'noir', name: 'Atelier Noir', note: 'Hand-rubbed black, 14 coats', hex: '#121314' },
    { id: 'jade', name: 'Imperial Jade', note: 'Fuzhou lacquer, 40 coats', hex: '#2f5f52' },
    { id: 'bordeaux', name: 'Bordeaux Velours', note: 'Deep tinted clear', hex: '#4a1a20' },
    { id: 'argent', name: '1981 Argent', note: 'The founding silver', hex: '#a3a6a7' }] },
  { key: 'wheel', title: 'Wheels', intro: 'Forged, machined and finished in the atelier, never bought in.', opts: [
    { id: 'classic', name: 'Turbine', note: 'Thirty forged blades, polished by hand', hex: '#b9b4ab', spokes: 12, w: 1.2 },
    { id: 'wire', name: 'Wire', note: 'Hand-laced chrome spokes and a central spinner', hex: '#3a3b3e', spokes: 24, w: 0.6 },
    { id: 'monobloc', name: 'Monobloc', note: 'Five sculpted spokes in champagne gold', hex: '#cdb07a', spokes: 5, w: 5 }] },
  { key: 'leather', title: 'Interior leather', intro: 'Full-grain hides from a single tannery, cut so no two seats share a scar.', opts: [
    { id: 'ivoire', name: 'Ivoire calf', note: 'Bavarian tannery', hex: '#ddd0b8' },
    { id: 'cognac', name: 'Cognac saddle', note: 'Hand-stitched, 11 stitches per inch', hex: '#87532e' },
    { id: 'nuit', name: 'Bleu Nuit', note: 'Full aniline', hex: '#1d2638' },
    { id: 'celadon', name: 'Céladon nappa', note: 'Vegetable tanned', hex: '#9fb3a2' }] },
  { key: 'material', title: 'Rare materials', intro: 'The detail you touch every day, chosen with our master artisans.', opts: [
    { id: 'walnut', name: 'Figured walnut', note: 'Black Forest, from one tree', hex: '#5c3a22' },
    { id: 'ebony', name: 'Macassar ebony', note: 'Certified reclaimed', hex: '#2b211b' },
    { id: 'pearl', name: 'Mother-of-pearl inlay', note: 'Set by hand in the fascia', hex: '#d9d4c8' },
    { id: 'alu', name: 'Brushed aluminium', note: 'Machined, no veneer', hex: '#7c7f80' }] },
  { key: 'sound', title: 'Sound', intro: 'One quiet design in every car. What changes is the system behind the grilles, tuned by ear in Munich.', opts: [
    { id: 'salon', name: 'Salon', note: '16 speakers · 1,200 W · clear and natural, tuned to the cabin', hex: '#b8955a', speakers: 16 },
    { id: 'concert', name: 'Concert', note: '24 speakers · 2,100 W · ceiling speakers put the stage around you', hex: '#b8955a', speakers: 24 },
    { id: 'reference', name: 'Reference', note: '34 speakers · 3,200 W · seat exciters, the studio master in your car', hex: '#b8955a', speakers: 34 }] },
  { key: 'summary', title: 'Your creation', intro: 'A first sketch of your car. The atelier will refine every line with you.' },
];

// How the seat leather is worked, chosen alongside its colour on the leather step.
export const SEATS = [
  { id: 'smooth', name: 'Smooth hide', note: 'The leather left whole, as the tannery delivers it' },
  { id: 'quilted', name: 'Diamond quilted', note: 'Stitched by hand, a thousand diamonds per seat' },
  { id: 'perforated', name: 'Perforated', note: 'Drilled in a fine pattern, cool in summer' },
  { id: 'suede', name: 'Suede', note: 'Brushed to a soft nap, warm to the touch' },
];
export const seat = (id?: string) => SEATS.find(s => s.id === id) ?? SEATS[0]!;

export const opt = (key: StepKey, id: string): Option => STEPS.find(s => s.key === key)!.opts!.find(o => o.id === id)!;

export type Selection = { paint: string; wheel: string; leather: string; material: string; mono: string; seat?: string | undefined; sound?: string | undefined };
export const DEFAULTS: Selection = { paint: 'argent', wheel: 'classic', leather: 'ivoire', material: 'walnut', mono: '', seat: 'smooth', sound: 'salon' };

// A car is shared as a link: /configure?c=gt.jade.wire.cognac.walnut..velvet.quilted
export const encode = (model: ModelId, s: Selection) => [model, s.paint, s.wheel, s.leather, s.material, s.mono, '', s.seat && s.seat !== 'smooth' ? s.seat : '', s.sound && s.sound !== 'salon' ? s.sound : ''].join('.').replace(/\.+$/, '');
// The visitor's own car, remembered on this device so the studio can show it.
const MY_CAR = 'bmc-my-car';
export const rememberCar = (model: ModelId, s: Selection) => { try { localStorage.setItem(MY_CAR, encode(model, s)); } catch { /* storage blocked */ } };
export const myCar = () => { try { const c = localStorage.getItem(MY_CAR); return c ? decode(c) : null; } catch { return null; } };

export function decode(code: string): { model: ModelId; sel: Selection } | null {
  const [model, paint, wheel, leather, material, mono = '', , seatId, sound] = code.split('.');
  if (!model || !(model in MODELS)) return null;
  const valid = (key: 'paint' | 'wheel' | 'leather' | 'material' | 'sound', id?: string) => STEPS.find(st => st.key === key)!.opts!.some(o => o.id === id) ? id! : DEFAULTS[key]!;
  return { model: model as ModelId, sel: { paint: valid('paint', paint), wheel: valid('wheel', wheel), leather: valid('leather', leather), material: valid('material', material), mono: mono.replace(/[^A-Z]/g, '').slice(0, 3), seat: seat(seatId).id, sound: valid('sound', sound) } };
}


// Client-facing team. Roles and languages are placeholders: edit them here.
export const TEAM = [
  { name: 'Guillaume Graff', role: 'Client Director, Europe', text: 'Welcomes collectors to the Munich atelier and follows every European client.', languages: ['French', 'German', 'English'], sketch: 0 },
  { name: 'Clément Tavernier', role: 'Design Director', text: 'Draws each car with its client, from the first sketch to the final sign-off.', languages: ['French', 'English', 'Italian'], sketch: 1 },
  { name: 'Candice Anguiley Kaack', role: 'Client Director, Americas', text: 'Looks after clients in the US, from the first video call to delivery at their door.', languages: ['English', 'French', 'Spanish'], sketch: 2 },
  { name: 'Karl-Henry Sanon', role: 'Artisans’ Liaison', text: 'Introduces each client to the master artisans who work on their car.', languages: ['French', 'English', 'German'], sketch: 3 },
  { name: 'Nicolas Chaumont', role: 'Client Director, Middle East', text: 'Visits clients at home in Dubai, Riyadh and Doha, always in private.', languages: ['Arabic', 'French', 'English'], sketch: 4 },
  { name: 'Sharmaine Ng', role: 'Client Director, Greater China', text: 'Opens the house to clients in Shanghai, Hong Kong and Singapore.', languages: ['Mandarin', 'Cantonese', 'English'], sketch: 5 },
];

// Sample quotes written for the prototype: replace with real press coverage before public use.
export const PRESS = [
  { q: 'One of the last houses that still builds a car around a single person, and it shows in every seam.', by: 'Coachwork Review' },
  { q: 'BMC proves that scarcity is a promise, not a marketing line. Twenty-five cars, twenty-five stories.', by: 'Grand Tourisme' },
  { q: 'The configurator is only the first conversation. The real one happens in the Munich atelier.', by: "The Collector's Quarterly" },
  { q: 'A digital passport for every car is the most quietly radical idea in luxury motoring this decade.', by: 'Auto & Patrimoine' },
];

