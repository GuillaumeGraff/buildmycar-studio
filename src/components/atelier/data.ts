// Content for the BMC Atelier site. Edit names, prices and texts here.
export type ModelId = 'gt' | 'roadster' | 'brake';
export type Option = { id: string; name: string; note: string; hex: string; cost: number; spokes?: number; w?: number };
export type StepKey = 'paint' | 'wheel' | 'leather' | 'material' | 'mono' | 'summary';
export type Step = { key: StepKey; title: string; intro: string; opts?: Option[] };

export const MODELS: Record<ModelId, { name: string; line: string; base: number; weeks: number; body: string; glass: string; door: string }> = {
  gt: { name: 'Grand Tourer', line: 'Four seats, a long bonnet and the range to cross a continent in one sitting.', base: 465000, weeks: 70,
    body: 'M62,232 C50,226 46,204 58,190 C92,170 150,160 214,152 C300,110 382,86 472,84 C544,84 592,104 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M304,148 C362,112 422,99 480,98 C532,98 570,113 606,140 Z', door: 'M528,146 C526,180 522,206 518,228' },
  roadster: { name: 'Roadster', line: 'Two seats, open to the sky, with a hand-stitched tonneau and a short, taut tail.', base: 420000, weeks: 62,
    body: 'M62,232 C50,226 46,206 58,194 C92,178 160,170 236,166 C262,150 300,146 326,160 L410,158 C430,150 446,146 462,148 L470,158 C560,158 720,160 902,170 C942,176 958,194 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M454,148 L470,124 L478,126 L476,158 Z', door: 'M520,160 C518,190 516,210 514,228' },
  brake: { name: 'Shooting Brake', line: 'The grand tourer with a long glass roof, for the dogs, the guns or the luggage of a long summer.', base: 495000, weeks: 76,
    body: 'M62,232 C50,226 48,204 54,180 C58,150 72,120 104,112 L470,92 C544,90 592,106 642,140 C704,150 820,156 902,168 C942,174 958,192 954,214 C952,226 942,232 922,232 L840,232 A64,64 0 0 0 712,232 L300,232 A64,64 0 0 0 172,232 Z',
    glass: 'M112,124 L470,104 C528,104 570,116 604,140 L128,148 C116,146 110,136 112,124 Z', door: 'M528,140 C526,176 522,206 518,228' },
};

export const STEPS: Step[] = [
  { key: 'paint', title: 'Exterior finish', intro: 'Every colour is mixed for one car and laid by hand, coat after coat.', opts: [
    { id: 'noir', name: 'Atelier Noir', note: 'Hand-rubbed black, 14 coats', hex: '#121314', cost: 0 },
    { id: 'jade', name: 'Imperial Jade', note: 'Fuzhou lacquer, 40 coats', hex: '#2f5f52', cost: 18000 },
    { id: 'bordeaux', name: 'Bordeaux Velours', note: 'Deep tinted clear', hex: '#4a1a20', cost: 9500 },
    { id: 'argent', name: '1981 Argent', note: 'The founding silver', hex: '#a3a6a7', cost: 4800 }] },
  { key: 'wheel', title: 'Wheels', intro: 'Forged, machined and finished in the atelier, never bought in.', opts: [
    { id: 'classic', name: 'Classic', note: 'Twelve fine spokes', hex: '#262422', cost: 0, spokes: 12, w: 1.2 },
    { id: 'wire', name: 'Wire', note: 'Twenty-four laced spokes', hex: '#5d5a55', cost: 7200, spokes: 24, w: 0.6 },
    { id: 'monobloc', name: 'Monobloc', note: 'Five sculpted arms', hex: '#8a8378', cost: 5400, spokes: 5, w: 5 }] },
  { key: 'leather', title: 'Interior leather', intro: 'Full-grain hides from a single tannery, cut so no two seats share a scar.', opts: [
    { id: 'ivoire', name: 'Ivoire calf', note: 'Bavarian tannery', hex: '#ddd0b8', cost: 0 },
    { id: 'cognac', name: 'Cognac saddle', note: 'Hand-stitched, 11 stitches per inch', hex: '#87532e', cost: 2400 },
    { id: 'nuit', name: 'Bleu Nuit', note: 'Full aniline', hex: '#1d2638', cost: 2900 },
    { id: 'celadon', name: 'Céladon nappa', note: 'Vegetable tanned', hex: '#9fb3a2', cost: 3200 }] },
  { key: 'material', title: 'Rare materials', intro: 'The detail you touch every day, chosen with our master artisans.', opts: [
    { id: 'walnut', name: 'Walnut burl', note: 'Black Forest, from one tree', hex: '#5c3a22', cost: 11500 },
    { id: 'ebony', name: 'Macassar ebony', note: 'Certified reclaimed', hex: '#2b211b', cost: 14000 },
    { id: 'pearl', name: 'Mother-of-pearl inlay', note: 'Set by hand in the fascia', hex: '#d9d4c8', cost: 16500 },
    { id: 'alu', name: 'Brushed aluminium', note: 'Machined, no veneer', hex: '#7c7f80', cost: 0 }] },
  { key: 'mono', title: 'Your monogram', intro: 'Up to three initials, embroidered in the headrests and engraved on the sill plates.' },
  { key: 'summary', title: 'Your commission', intro: 'A first sketch of your car. The atelier will refine every line with you.' },
];
export const MONOGRAM_COST = 1200;

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


export const TEAM = [
  { name: 'Guillaume Graff', role: 'Managing Director', text: 'Leads the house and its digital atelier.', sketch: 0 },
  { name: 'Clément Tavernier', role: 'Chief Design Officer', text: 'Guides every commission from first sketch to final sign-off.', sketch: 1 },
  { name: 'Candice Anguiley Kaack', role: 'Director of Client Experience', text: 'Looks after each client from invitation to delivery and beyond.', sketch: 2 },
  { name: 'Karl-Henry Sanon', role: 'Head of Craft & Artisans', text: 'Curates the master artisans who join each commission.', sketch: 3 },
  { name: 'Nicolas Chaumont', role: 'Chief Financial Officer', text: 'Keeps every commission transparent, from estimate to invoice.', sketch: 4 },
  { name: 'Sharmaine Ng', role: 'Director, Asia & Middle East', text: 'Opens the house to clients in Shanghai, Dubai and beyond.', sketch: 5 },
];

// Sample quotes written for the prototype: replace with real press coverage before public use.
export const PRESS = [
  { q: 'One of the last houses that still builds a car around a single person, and it shows in every seam.', by: 'Coachwork Review' },
  { q: 'BMC proves that scarcity is a promise, not a marketing line. Twenty-five cars, twenty-five stories.', by: 'Grand Tourisme' },
  { q: 'The configurator is only the first conversation. The real one happens in the Munich atelier.', by: "The Collector's Quarterly" },
  { q: 'A digital passport for every car is the most quietly radical idea in luxury motoring this decade.', by: 'Auto & Patrimoine' },
];

export const eur = (n: number) => '€' + n.toLocaleString('en-US');
