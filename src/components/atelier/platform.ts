// Content for the BuildMyCat adoption demo. Every person, cat and family here is illustrative.
import type { KittenId, Selection } from './data';

export type PersonaId = 'europe' | 'us' | 'uae' | 'china';
type Msg = { from: 'client' | 'designer' | 'artisan'; text: string; swatch?: string };
export type Persona = {
  id: PersonaId; name: string; age: number; city: string; region: string; tagline: string; need: string;
  cat: string; kitten: KittenId; sel: Selection; foster: { name: string; craft: string; city: string };
  language: string; session: string; studio: Msg[]; proposal: { title: string; note: string; swatch: string };
  passport: { chip: string; homecoming: string; hours: number; origins: { what: string; from: string }[]; humans: string[]; care: string[] };
  journey: { step: string; text: string; to: '/configure' | '/studio' | '/passport' | '/book' }[];
};

export const PERSONAS: Record<PersonaId, Persona> = {
  europe: {
    id: 'europe', name: 'Klaus Brenner', age: 61, city: 'Munich', region: 'European adopter', tagline: 'Has lived with cats since 1971 and wants one that will outlast his armchair.',
    need: 'Calm, a known history and a cat that tolerates opera.',
    cat: 'Otto', kitten: 'lap', sel: { coat: 'noir', eyes: 'amber', collar: 'cognac', toy: 'feather', tag: 'KB' },
    foster: { name: 'Hanna Vogel', craft: 'Foster family', city: 'Schwabing' },
    language: 'German', session: 'Thursday · 10:00 at the Munich cat house',
    studio: [
      { from: 'designer', text: 'Klaus, Otto has met your armchair by video. He approves of it, with reservations.' },
      { from: 'client', text: 'Good. Does he mind Wagner? The Ring is four evenings.' },
      { from: 'artisan', text: 'We played him Tannhäuser last night. He slept through the overture and purred at the pilgrims. Here is his collar sample.', swatch: '#87532e' },
    ],
    proposal: { title: 'Cognac collar with an engraved tag', note: 'Hand-stitched, his name on one side, your number on the other', swatch: '#87532e' },
    passport: { chip: '250 268 500 019 812', homecoming: 'November 2026', hours: 620, origins: [{ what: 'Found', from: 'Asleep in the wheel arch of a 1964 roadster, Munich' }, { what: 'Vaccines', from: 'Typhus and cat flu, signed by Dr Brandt' }, { what: 'Diet', from: 'Chicken. On Sundays, one sardine' }], humans: ['Klaus Brenner, from 2026'], care: ['2027 · First check-up, Munich', '2028 · Dental polish, under protest'] },
    journey: [
      { step: 'Discover', text: 'Meets Guillaume, our Adoption Director for Europe, at the Munich cat house on a Saturday.', to: '/book' },
      { step: 'Configure', text: 'Configures a black Lap Cat for fun, then laughs at the punchline.', to: '/configure' },
      { step: 'Meet', text: 'Meets Otto in person and by video with his foster family in Schwabing.', to: '/studio' },
      { step: 'Passport', text: 'Receives Otto’s passport and asks for his late cats to be remembered in it too.', to: '/passport' },
    ],
  },
  us: {
    id: 'us', name: 'Rachel Morgan', age: 44, city: 'Los Angeles', region: 'US adopter', tagline: 'Tech founder who adopts by video between two board meetings.',
    need: 'Speed, transparency and a cat that does not mind a standing desk.',
    cat: 'Pixel', kitten: 'explorer', sel: { coat: 'silver', eyes: 'sapphire', collar: 'nuit', toy: 'laser', tag: 'RM' },
    foster: { name: 'Tomás Ruiz', craft: 'Cat behaviourist', city: 'Los Angeles lounge' },
    language: 'English', session: 'Tuesday · 08:00 Los Angeles, 17:00 Munich',
    studio: [
      { from: 'designer', text: 'Rachel, here is Pixel. Silver, sapphire eyes, and already interested in your cables.' },
      { from: 'client', text: 'Love him. Can he handle a standing desk and three monitors?' },
      { from: 'artisan', text: 'He has handled four, and walked across all of them during my call. A Bleu Nuit collar, nothing else. Sample attached.', swatch: '#1d2638' },
    ],
    proposal: { title: 'Bleu Nuit collar, no bell', note: 'He needs to sneak up on the laser dot', swatch: '#1d2638' },
    passport: { chip: '250 268 500 019 907', homecoming: 'December 2026', hours: 410, origins: [{ what: 'Found', from: 'In a delivery box, Santa Monica. He chose it' }, { what: 'Vaccines', from: 'Core vaccines and microchip, Los Angeles lounge' }, { what: 'Diet', from: 'Salmon, served at desk height' }], humans: ['Rachel Morgan, from 2026'], care: ['2026 · Delivered to Malibu in a climate-controlled carrier', '2027 · Check-up at home by a travelling vet'] },
    journey: [
      { step: 'Discover', text: 'Hears about BuildMyCat from a friend and books a video call with Candice the same evening.', to: '/book' },
      { step: 'Configure', text: 'Configures a silver Explorer on her phone between two meetings.', to: '/configure' },
      { step: 'Meet', text: 'Meets Pixel by video, then in person at the Los Angeles lounge.', to: '/studio' },
      { step: 'Passport', text: 'Follows his vaccines week by week and receives the passport with the cat.', to: '/passport' },
    ],
  },
  uae: {
    id: 'uae', name: 'Omar Al Mansouri', age: 38, city: 'Dubai', region: 'UAE adopter', tagline: 'Runs a family office and adopts two littermates, one for himself and one for his brother.',
    need: 'Privacy, home visits and two cats who will not be separated.',
    cat: 'Zafran & Noor', kitten: 'aristocrat', sel: { coat: 'cream', eyes: 'odd', collar: 'ivoire', toy: 'mouse', tag: 'OAM', style: 'pearl' },
    foster: { name: 'Layla Haddad', craft: 'Foster family', city: 'Jumeirah' },
    language: 'English and Arabic', session: 'Sunday · at the family majlis, Dubai',
    studio: [
      { from: 'designer', text: 'Omar, Zafran and Noor are littermates. They will share the cream coat, and each has their own collar.' },
      { from: 'client', text: 'My brother takes Noor. Zafran stays with me. They will visit every Friday.' },
      { from: 'artisan', text: 'They already sleep in one basket, so Friday suits them. Pearl studs for both, set by hand. First sample here.', swatch: '#ddd0b8' },
    ],
    proposal: { title: 'Two pearl collars, a pair', note: 'Freshwater pearls, set by hand, two cats', swatch: '#e2ddd1' },
    passport: { chip: '784 093 000 210 021 & 022', homecoming: 'January 2027', hours: 1240, origins: [{ what: 'Found', from: 'Born in a palm garden, Jumeirah' }, { what: 'Vaccines', from: 'Core vaccines, both cats, Dubai' }, { what: 'Diet', from: 'Fresh fish. Never the same dish as each other' }], humans: ['The Al Mansouri brothers, from 2027'], care: ['2027 · Climate-controlled summer room, Dubai', '2027 · Friday visits between the two houses'] },
    journey: [
      { step: 'Discover', text: 'Is introduced by a friend, then visited at home by Nicolas, in Arabic.', to: '/book' },
      { step: 'Configure', text: 'Configures two cream Aristocrats, one for each brother.', to: '/configure' },
      { step: 'Meet', text: 'Meets the littermates at home with their foster family, every session private.', to: '/studio' },
      { step: 'Passport', text: 'Holds two linked passports in the family office, shared only with the vet.', to: '/passport' },
    ],
  },
  china: {
    id: 'china', name: 'Li Wei', age: 35, city: 'Shanghai', region: 'Chinese adopter', tagline: 'First-time adopter who wants a cat whose name brings good fortune.',
    need: 'An adoption that honours Chinese symbols, with a European house and a homecoming on the 8th.',
    cat: 'Mochi', kitten: 'loaf', sel: { coat: 'ginger', eyes: 'emerald', collar: 'celadon', toy: 'box', tag: 'LW', style: 'bell' },
    foster: { name: 'Lin Yuhua', craft: 'Foster family', city: 'Former French Concession' },
    language: 'Mandarin, with Sharmaine', session: 'Wednesday · 16:00 Shanghai, 10:00 Munich',
    studio: [
      { from: 'designer', text: 'Li Wei, here is Mochi. Ginger, as you hoped, the colour of good fortune.' },
      { from: 'client', text: 'She is perfect. Could her collar carry a small gold bell, for luck?' },
      { from: 'artisan', text: 'A céladon collar with a gold bell, like a temple chime. She already loafs on the red cushion. Sample attached.', swatch: '#9fb3a2' },
    ],
    proposal: { title: 'Céladon collar with a gold bell', note: 'A temple-chime bell, rung only when she wants dinner', swatch: '#9fb3a2' },
    passport: { chip: '156 100 000 288 888', homecoming: 'August 2027, on the 8th', hours: 880, origins: [{ what: 'Found', from: 'In a teahouse courtyard, Shanghai' }, { what: 'Vaccines', from: 'Core vaccines, Shanghai lounge vet' }, { what: 'Diet', from: 'Steamed fish. Strong opinions about rice' }], humans: ['Li Wei, from 2027'], care: ['2027 · Homecoming ceremony, the Bund, Shanghai', '2028 · Check-up with the BuildMyCat partner vet'] },
    journey: [
      { step: 'Discover', text: 'Meets Sharmaine at a private Shanghai salon and books a first session in Mandarin.', to: '/book' },
      { step: 'Configure', text: 'Configures a ginger Loaf with emerald eyes.', to: '/configure' },
      { step: 'Meet', text: 'Meets Mochi with her foster family in the Former French Concession, in Mandarin.', to: '/studio' },
      { step: 'Passport', text: 'Receives a bilingual passport that tells Mochi’s story, and a homecoming on the 8th.', to: '/passport' },
    ],
  },
};
export const PERSONA_IDS = Object.keys(PERSONAS) as PersonaId[];
export const persona = (id?: string) => PERSONAS[(id && id in PERSONAS ? id : 'china') as PersonaId];
export const personaSearch = (s: Record<string, unknown>): { p?: PersonaId | undefined } => {
  const p = s['p'];
  return { p: typeof p === 'string' && p in PERSONAS ? (p as PersonaId) : undefined };
};
