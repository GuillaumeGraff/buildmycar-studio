// Content for the BuildMyCat site. Edit names, figures and texts here.
export type KittenId = 'lap' | 'explorer' | 'loaf' | 'aristocrat' | 'zoomies';
export type Pose = 'side' | 'front' | 'loaf' | 'walk' | 'run';
export type Option = { id: string; name: string; note: string; hex: string; hex2?: string; stripes?: boolean; db?: number };
export type Spec = { label: string; value: string; unit?: string };
export type StepKey = 'coat' | 'eyes' | 'collar' | 'toy' | 'purr' | 'summary';
export type Step = { key: StepKey; title: string; intro: string; opts?: Option[] };

// The five temperaments, each drawn in gold by the Cat component in its own pose.
export const KITTENS: Record<KittenId, { name: string; category: string; pose: Pose; line: string; weeks: number; engine: string; specs: Spec[]; dream: string }> = {
  lap: { name: 'Velours', category: 'The Lap Cat', pose: 'side', line: 'Built around your knees, with a purr that starts before you sit down.', weeks: 5,
    engine: 'One continuous purr, tuned to the sofa', specs: [{ label: 'Naps', value: '16', unit: 'h/day' }, { label: 'Purr', value: '42', unit: 'dB' }, { label: 'On your lap', value: '4', unit: 'h' }],
    dream: 'A Sunday afternoon, a blanket, a book you will not finish, and four kilos of warm velvet that will not let you get up.' },
  explorer: { name: 'Ciel', category: 'The Explorer', pose: 'walk', line: 'Tail up, whiskers forward, every cupboard a continent.', weeks: 4,
    engine: 'Curiosity, naturally aspirated', specs: [{ label: 'To the wardrobe', value: '1.4', unit: 's' }, { label: 'Boxes', value: '120', unit: '/week' }, { label: 'Jump', value: '1.8', unit: 'm' }],
    dream: 'The top of the wardrobe by breakfast, the inside of the washing machine by lunch, and home for dinner, always.' },
  loaf: { name: 'Brioche', category: 'The Loaf', pose: 'loaf', line: 'Paws tucked, eyes half closed, perfectly risen.', weeks: 5,
    engine: 'Low-revving, extremely long range', specs: [{ label: 'Loaf factor', value: '98', unit: '%' }, { label: 'Paws visible', value: '0' }, { label: 'Naps', value: '18', unit: 'h/day' }],
    dream: 'The warm corner of the radiator, a sunbeam that moves slowly enough to follow, and nothing on the agenda.' },
  aristocrat: { name: 'Majesté', category: 'The Aristocrat', pose: 'front', line: 'Sits upright, judges quietly, accepts your home on probation.', weeks: 6,
    engine: 'Disdain, hand-finished', specs: [{ label: 'Disdain', value: '100', unit: '%' }, { label: 'Treats', value: '12', unit: '/day' }, { label: 'Keyboards', value: '3', unit: 'sat on' }],
    dream: 'The best chair in the house, a silver bowl filled on time, and a staff who understand that the door must stay open.' },
  zoomies: { name: 'Nocturne', category: 'The Night Sprinter', pose: 'run', line: 'Asleep all day. At three in the morning, a different animal.', weeks: 4,
    engine: 'Four paws and one bad idea', specs: [{ label: 'Top speed', value: '48', unit: 'km/h' }, { label: '3 a.m. laps', value: '7' }, { label: 'To full chaos', value: '2.1', unit: 's' }],
    dream: 'Seven laps of the flat at three in the morning, a skid across the parquet, and breakfast served promptly at five.' },
};

export const STEPS: Step[] = [
  { key: 'coat', title: 'Coat', intro: 'Every coat is groomed by hand, then shed generously on your best sweater.', opts: [
    { id: 'noir', name: 'Minuit', note: 'Midnight black, hand-polished', hex: '#1f1d1c' },
    { id: 'ginger', name: 'Marmalade', note: 'Ginger tabby, stripes by nature', hex: '#c97a3d', stripes: true },
    { id: 'silver', name: 'Russian Silver', note: 'Blue-grey plush, very soft', hex: '#8d9396' },
    { id: 'cream', name: 'Crème brûlée', note: 'Pale cream, slightly caramelised', hex: '#e8d4b0' }] },
  { key: 'eyes', title: 'Eyes', intro: 'Chosen to look at you with love, or at an empty bowl with deep disappointment.', opts: [
    { id: 'amber', name: 'Amber', note: 'Warm gold, best at dusk', hex: '#d9982a' },
    { id: 'emerald', name: 'Emerald', note: 'Deep green, slightly judgemental', hex: '#4e8f4a' },
    { id: 'sapphire', name: 'Sapphire', note: 'Ice blue, extremely persuasive', hex: '#4a78b8' },
    { id: 'odd', name: 'Odd-eyed', note: 'One amber, one sapphire, twice the charm', hex: '#d9982a', hex2: '#4a78b8' }] },
  { key: 'collar', title: 'Collar', intro: 'Hand-stitched in Munich from the hides we once kept for car seats. Usually removed within the hour.', opts: [
    { id: 'ivoire', name: 'Ivoire calf', note: 'Bavarian tannery', hex: '#ddd0b8' },
    { id: 'cognac', name: 'Cognac saddle', note: 'Hand-stitched, 11 stitches per inch', hex: '#87532e' },
    { id: 'nuit', name: 'Bleu Nuit', note: 'Full aniline', hex: '#1d2638' },
    { id: 'celadon', name: 'Céladon nappa', note: 'Vegetable tanned', hex: '#9fb3a2' }] },
  { key: 'toy', title: 'Signature toy', intro: 'The detail they touch every day, chosen with our foster families.', opts: [
    { id: 'feather', name: 'Feather wand', note: 'Pheasant feathers, tied by hand', hex: '#8c6d3a' },
    { id: 'box', name: 'Cardboard box', note: 'Free. Will be preferred to everything else on this page', hex: '#b48a5a' },
    { id: 'mouse', name: 'Catnip mouse', note: 'Organic Bavarian catnip, felt ears', hex: '#9a9590' },
    { id: 'laser', name: 'Red dot', note: 'Laser, uncatchable by design', hex: '#c8352d' }] },
  { key: 'purr', title: 'Purr', intro: 'One quiet design in every kitten. What changes is the engine behind the whiskers.', opts: [
    { id: 'salon', name: 'Salon', note: '25 dB · a soft hum on the sofa, tuned to the room', hex: '#b8955a', db: 25 },
    { id: 'concert', name: 'Concert', note: '35 dB · audible from the kitchen, surround included', hex: '#b8955a', db: 35 },
    { id: 'reference', name: 'Reference', note: '50 dB · at three in the morning, directly in your ear', hex: '#b8955a', db: 50 }] },
  { key: 'summary', title: 'Your kitten', intro: 'A first sketch of your kitten. The house will refine every whisker with you.' },
];

// How the collar is finished, chosen alongside its colour on the collar step.
export const STYLES = [
  { id: 'plain', name: 'Plain', note: 'The leather left whole, with an engraved tag' },
  { id: 'bell', name: 'Little bell', note: 'So the birds in the garden stand a chance' },
  { id: 'bow', name: 'Bow tie', note: 'For Sunday lunch and visiting relatives' },
  { id: 'pearl', name: 'Pearl studs', note: 'Freshwater pearls, set by hand, lost by Tuesday' },
];
export const style = (id?: string) => STYLES.find(s => s.id === id) ?? STYLES[0]!;

export const opt = (key: StepKey, id: string): Option => STEPS.find(s => s.key === key)!.opts!.find(o => o.id === id)!;

export type Selection = { coat: string; eyes: string; collar: string; toy: string; tag: string; style?: string | undefined; purr?: string | undefined };
export const DEFAULTS: Selection = { coat: 'silver', eyes: 'amber', collar: 'ivoire', toy: 'feather', tag: '', style: 'plain', purr: 'salon' };

// A kitten is shared as a link: /configure?c=lap.ginger.emerald.cognac.box..bell.concert
export const encode = (kitten: KittenId, s: Selection) => [kitten, s.coat, s.eyes, s.collar, s.toy, s.tag, s.style && s.style !== 'plain' ? s.style : '', s.purr && s.purr !== 'salon' ? s.purr : ''].join('.').replace(/\.+$/, '');
// The visitor's own kitten, remembered on this device so the studio can show it.
const MY_KITTEN = 'bmc-my-kitten';
export const rememberKitten = (kitten: KittenId, s: Selection) => { try { localStorage.setItem(MY_KITTEN, encode(kitten, s)); } catch { /* storage blocked */ } };
export const myKitten = () => { try { const c = localStorage.getItem(MY_KITTEN); return c ? decode(c) : null; } catch { return null; } };

export function decode(code: string): { kitten: KittenId; sel: Selection } | null {
  const [kitten, coat, eyes, collar, toy, tag = '', styleId, purr] = code.split('.');
  if (!kitten || !(kitten in KITTENS)) return null;
  const valid = (key: 'coat' | 'eyes' | 'collar' | 'toy' | 'purr', id?: string) => STEPS.find(st => st.key === key)!.opts!.some(o => o.id === id) ? id! : DEFAULTS[key]!;
  return { kitten: kitten as KittenId, sel: { coat: valid('coat', coat), eyes: valid('eyes', eyes), collar: valid('collar', collar), toy: valid('toy', toy), tag: tag.replace(/[^A-Z]/g, '').slice(0, 3), style: style(styleId).id, purr: valid('purr', purr) } };
}

// The punchline of the configurator: we don't build kittens, but a real cat with this coat is waiting.
export const MATCHES: Record<string, { name: string; age: string; note: string }> = {
  noir: { name: 'Minuit', age: '2 years', note: 'Black cats are adopted last. She has noticed, and forgiven no one.' },
  ginger: { name: 'Rufus', age: '10 months', note: 'Arrived with a brother, Biscuit. They would very much like to leave together.' },
  silver: { name: 'Ash', age: '4 months', note: 'Fostered in Schwabing, where he has learned to open the fridge.' },
  cream: { name: 'Crumble', age: '6 months', note: 'Sheds roughly one kitten a week. Comes with a lint roller.' },
};

// Client-facing team. Roles and languages are placeholders: edit them here.
export const TEAM = [
  { name: 'Guillaume Graff', role: 'Adoption Director, Europe', text: 'Welcomes families to the Munich cat house and follows every European adoption.', languages: ['French', 'German', 'English'], sketch: 0 },
  { name: 'Clément Tavernier', role: 'Head of Matchmaking', text: 'Pairs each cat with its person, from the first purr to the final sign-off.', languages: ['French', 'English', 'Italian'], sketch: 1 },
  { name: 'Candice Anguiley Kaack', role: 'Adoption Director, Americas', text: 'Looks after adopters in the US, from the first video call to the carrier at their door.', languages: ['English', 'French', 'Spanish'], sketch: 2 },
  { name: 'Karl-Henry Sanon', role: 'Foster Families’ Liaison', text: 'Introduces each adopter to the family who raised their kitten until it was ready.', languages: ['French', 'English', 'German'], sketch: 3 },
  { name: 'Nicolas Chaumont', role: 'Adoption Director, Middle East', text: 'Visits families at home in Dubai, Riyadh and Doha, with a carrier and a lint roller.', languages: ['Arabic', 'French', 'English'], sketch: 4 },
  { name: 'Sharmaine Ng', role: 'Adoption Director, Greater China', text: 'Opens the house to adopters in Shanghai, Hong Kong and Singapore.', languages: ['Mandarin', 'Cantonese', 'English'], sketch: 5 },
];
