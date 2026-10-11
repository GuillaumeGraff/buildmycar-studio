import type { StepKey } from './data';
import wheelClassic from '@/assets/details/wheel-classic.jpg';
import wheelWire from '@/assets/details/wheel-wire.jpg';
import wheelMonobloc from '@/assets/details/wheel-monobloc.jpg';
import leatherIvoire from '@/assets/details/leather-ivoire.jpg';
import leatherCognac from '@/assets/details/leather-cognac.jpg';
import leatherNuit from '@/assets/details/leather-nuit.jpg';
import leatherCeladon from '@/assets/details/leather-celadon.jpg';
import walnut from '@/assets/details/material-walnut.jpg';
import ebony from '@/assets/details/material-ebony.jpg';
import pearl from '@/assets/details/material-pearl.jpg';
import alu from '@/assets/details/material-alu.jpg';
import studio from '@/assets/details/studio.jpg';

// Close-ups shown instead of the car while choosing wheels, leather and materials.
// The same few images serve every car, so the configurator stays light.
export const DETAILS: Partial<Record<StepKey, { caption: string; images: Record<string, string> }>> = {
  wheel: { caption: 'Forged and polished in the atelier', images: { classic: wheelClassic, wire: wheelWire, monobloc: wheelMonobloc } },
  leather: { caption: 'Cut and stitched by hand in Munich', images: { ivoire: leatherIvoire, cognac: leatherCognac, nuit: leatherNuit, celadon: leatherCeladon } },
  material: { caption: 'From the material library', images: { walnut, ebony, pearl, alu } },
};

// The empty studio, shown for a car whose photographs are still being made.
export const STUDIO = studio;
