// Realistic renders, one per finish. Add a model here once its four images exist in src/assets/renders.
import type { ModelId } from './data';
import gtNoir from '@/assets/renders/gt-noir.jpg';
import gtJade from '@/assets/renders/gt-jade.jpg';
import gtBordeaux from '@/assets/renders/gt-bordeaux.jpg';
import gtArgent from '@/assets/renders/gt-argent.jpg';

export const RENDERS: Partial<Record<ModelId, Record<string, string>>> = {
  gt: { noir: gtNoir, jade: gtJade, bordeaux: gtBordeaux, argent: gtArgent },
};
