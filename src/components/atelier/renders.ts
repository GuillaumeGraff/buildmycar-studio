// Realistic renders, one per finish. Add a model here once its four images exist in src/assets/renders.
import type { ModelId } from './data';
import gtNoir from '@/assets/renders/gt-noir.jpg';
import gtJade from '@/assets/renders/gt-jade.jpg';
import gtBordeaux from '@/assets/renders/gt-bordeaux.jpg';
import gtArgent from '@/assets/renders/gt-argent.jpg';
import roadsterNoir from '@/assets/renders/roadster-noir.jpg';
import roadsterJade from '@/assets/renders/roadster-jade.jpg';
import roadsterBordeaux from '@/assets/renders/roadster-bordeaux.jpg';
import roadsterArgent from '@/assets/renders/roadster-argent.jpg';
import brakeNoir from '@/assets/renders/brake-noir.jpg';
import brakeJade from '@/assets/renders/brake-jade.jpg';
import brakeBordeaux from '@/assets/renders/brake-bordeaux.jpg';
import brakeArgent from '@/assets/renders/brake-argent.jpg';

export const RENDERS: Partial<Record<ModelId, Record<string, string>>> = {
  gt: { noir: gtNoir, jade: gtJade, bordeaux: gtBordeaux, argent: gtArgent },
  roadster: { noir: roadsterNoir, jade: roadsterJade, bordeaux: roadsterBordeaux, argent: roadsterArgent },
  brake: { noir: brakeNoir, jade: brakeJade, bordeaux: brakeBordeaux, argent: brakeArgent },
};
