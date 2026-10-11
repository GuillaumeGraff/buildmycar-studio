import type { StepKey } from './data';
import wheelClassic from '@/assets/details/wheel-classic.jpg';
import wheelWire from '@/assets/details/wheel-wire.jpg';
import wheelMonobloc from '@/assets/details/wheel-monobloc.jpg';
import walnut from '@/assets/details/material-walnut.jpg';
import ebony from '@/assets/details/material-ebony.jpg';
import pearl from '@/assets/details/material-pearl.jpg';
import alu from '@/assets/details/material-alu.jpg';
import sound from '@/assets/details/sound.jpg';
import studio from '@/assets/details/studio.jpg';

// Seats: one photograph per finish and leather colour, named seat-<finish>-<colour>.jpg.
const seats = import.meta.glob<string>('@/assets/details/seat-*.jpg', { eager: true, import: 'default' });
const seatImages = Object.fromEntries(Object.entries(seats).map(([path, src]) => [path.match(/seat-([a-z]+-[a-z]+)\.jpg$/)![1]!, src]));

// Close-ups shown instead of the car while choosing wheels, seats, materials and sound.
// The same few images serve every car, so the configurator stays light.
// Leather images are keyed `<finish>-<colour>`, for example `quilted-cognac`.
export const DETAILS: Partial<Record<StepKey, { caption: string; images: Record<string, string> }>> = {
  wheel: { caption: 'Forged and polished in the atelier', images: { classic: wheelClassic, wire: wheelWire, monobloc: wheelMonobloc } },
  leather: { caption: 'Cut and stitched by hand in Munich', images: seatImages },
  material: { caption: 'From the material library', images: { walnut, ebony, pearl, alu } },
  sound: { caption: 'Tuned by ear in Munich', images: { salon: sound, concert: sound, reference: sound } },
};

// The empty studio, shown for a car whose photographs are still being made.
export const STUDIO = studio;
