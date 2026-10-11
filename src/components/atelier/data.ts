// Content for the BMC Atelier site. Edit names, specifications and texts here.
export type ModelId = 'gt' | 'roadster' | 'brake' | 'saloon' | 'hyper';
export type Option = { id: string; name: string; note: string; hex: string; spokes?: number; w?: number };
export type Spec = { label: string; value: string; unit?: string };
export type StepKey = 'paint' | 'wheel' | 'leather' | 'material' | 'summary';
export type Step = { key: StepKey; title: string; intro: string; opts?: Option[] };

// The five BMC cars. `body`, `glass` and `door` are the gold line drawing used on the home page.
export const MODELS: Record<ModelId, { name: string; category: string; line: string; weeks: number; engine: string; specs: Spec[]; dream: string; body: string; glass: string; door: string }> = {
  gt: { name: 'Aurelia', category: 'Grand Tourer', line: 'Four seats, a long bonnet and the range to cross a continent in one sitting.', weeks: 70,
    engine: '6.5-litre twin-turbo V12', specs: [{ label: 'Power', value: '830', unit: 'hp' }, { label: '0–100 km/h', value: '3.2', unit: 's' }, { label: 'Top speed', value: '325', unit: 'km/h' }],
    dream: 'Munich to Monaco in one sitting, with 1,000 Nm under your right foot and the cabin as quiet as a library.',
    body: 'M62,232 C50,226 46,204 58,190 C92,170 150,160 214,152 C300,110 382,86 472,84 C544,84 592,104 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M304,148 C362,112 422,99 480,98 C532,98 570,113 606,140 Z', door: 'M528,146 C526,180 522,206 518,228' },
  roadster: { name: 'Solenne', category: 'Roadster', line: 'Two seats, open to the sky, with a hand-stitched tonneau and a short, taut tail.', weeks: 62,
    engine: '6.0-litre naturally aspirated V12, 9,400 rpm', specs: [{ label: 'Power', value: '790', unit: 'hp' }, { label: '0–100 km/h', value: '2.9', unit: 's' }, { label: 'Top speed', value: '340', unit: 'km/h' }],
    dream: 'The roof folds away in eleven seconds, and the V12 sings all the way to 9,400 rpm.',
    body: 'M62,232 C50,226 46,206 58,194 C92,178 160,170 236,166 C262,150 300,146 326,160 L410,158 C430,150 446,146 462,148 L470,158 C560,158 720,160 902,170 C942,176 958,194 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M454,148 L470,124 L478,126 L476,158 Z', door: 'M520,160 C518,190 516,210 514,228' },
  brake: { name: 'Vesper', category: 'Shooting Brake', line: 'The grand tourer with a long glass roof, for the dogs, the guns or the luggage of a long summer.', weeks: 76,
    engine: '6.5-litre V12 hybrid', specs: [{ label: 'Power', value: '880', unit: 'hp' }, { label: '0–100 km/h', value: '3.0', unit: 's' }, { label: 'Top speed', value: '320', unit: 'km/h' }],
    dream: 'Two square metres of glass over your head, and a boot fitted with luggage made to measure in Munich.',
    body: 'M62,232 C50,226 48,204 54,180 C58,150 72,120 104,112 L470,92 C544,90 592,106 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M112,124 L470,104 C528,104 570,116 604,140 L128,148 C116,146 110,136 112,124 Z', door: 'M528,140 C526,176 522,206 518,228' },
  saloon: { name: 'Sovereign', category: 'Limousine', line: 'Five and a half metres of calm, built around the rear seats.', weeks: 82,
    engine: '6.75-litre V12, near-silent electric mode', specs: [{ label: 'Power', value: '720', unit: 'hp' }, { label: 'Rear recline', value: '42', unit: '°' }, { label: 'Silent range', value: '80', unit: 'km' }],
    dream: 'Reclining rear seats, a starlit headliner and a champagne cellar held at six degrees.',
    body: 'M62,232 C50,226 46,204 58,190 C92,170 150,160 214,152 C300,110 382,86 472,84 C544,84 592,104 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M304,148 C362,112 422,99 480,98 C532,98 570,113 606,140 Z', door: 'M528,146 C526,180 522,206 518,228' },
  hyper: { name: 'Nocturne', category: 'Hyper Coupé', line: 'A carbon monocoque, three electric motors and one V8, for nineteen owners only.', weeks: 96,
    engine: '4.0-litre V8 and three electric motors', specs: [{ label: 'Power', value: '1,480', unit: 'hp' }, { label: '0–100 km/h', value: '2.1', unit: 's' }, { label: 'Top speed', value: '400', unit: 'km/h' }],
    dream: 'Nineteen cars, each named after its owner, and a weekend at Spa with our test driver before delivery.',
    body: 'M62,232 C50,226 46,206 58,194 C92,178 160,170 236,166 C262,150 300,146 326,160 L410,158 C430,150 446,146 462,148 L470,158 C560,158 720,160 902,170 C942,176 958,194 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M454,148 L470,124 L478,126 L476,158 Z', door: 'M520,160 C518,190 516,210 514,228' },
};

export const STEPS: Step[] = [
  { key: 'paint', title: 'Exterior finish', intro: 'Every colour is mixed for one car and laid by hand, coat after coat.', opts: [
    { id: 'noir', name: 'Atelier Noir', note: 'Hand-rubbed black, 14 coats', hex: '#121314' },
    { id: 'jade', name: 'Imperial Jade', note: 'Fuzhou lacquer, 40 coats', hex: '#2f5f52' },
    { id: 'bordeaux', name: 'Bordeaux Velours', note: 'Deep tinted clear', hex: '#4a1a20' },
    { id: 'argent', name: '1981 Argent', note: 'The founding silver', hex: '#a3a6a7' }] },
  { key: 'wheel', title: 'Wheels', intro: 'Forged, machined and finished in the atelier, never bought in.', opts: [
    { id: 'classic', name: 'Argent turbine', note: 'Thirty forged spokes, polished by hand', hex: '#b9b4ab', spokes: 12, w: 1.2 },
    { id: 'wire', name: 'Black chrome turbine', note: 'Smoked chrome over forged aluminium', hex: '#3a3b3e', spokes: 24, w: 0.6 },
    { id: 'monobloc', name: 'Champagne turbine', note: 'Brushed, then lacquered in warm gold', hex: '#cdb07a', spokes: 5, w: 5 }] },
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
  { key: 'summary', title: 'Your creation', intro: 'A first sketch of your car. The atelier will refine every line with you.' },
];

export const opt = (key: StepKey, id: string): Option => STEPS.find(s => s.key === key)!.opts!.find(o => o.id === id)!;

export type Selection = { paint: string; wheel: string; leather: string; material: string; mono: string };
export const DEFAULTS: Selection = { paint: 'noir', wheel: 'classic', leather: 'ivoire', material: 'walnut', mono: '' };

// A commission is shared as a link: /configure?c=gt.jade.wire.cognac.walnut.ABC
export const encode = (model: ModelId, s: Selection) => [model, s.paint, s.wheel, s.leather, s.material, s.mono].join('.');
export function decode(code: string): { model: ModelId; sel: Selection } | null {
  const [model, paint, wheel, leather, material, mono = ''] = code.split('.');
  if (!model || !(model in MODELS)) return null;
  const valid = (key: 'paint' | 'wheel' | 'leather' | 'material', id?: string) => STEPS.find(st => st.key === key)!.opts!.some(o => o.id === id) ? id! : DEFAULTS[key];
  return { model: model as ModelId, sel: { paint: valid('paint', paint), wheel: valid('wheel', wheel), leather: valid('leather', leather), material: valid('material', material), mono: mono.replace(/[^A-Z]/g, '').slice(0, 3) } };
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

