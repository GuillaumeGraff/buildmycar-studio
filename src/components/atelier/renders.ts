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
import saloonNoir from '@/assets/renders/saloon-noir.jpg';
import saloonJade from '@/assets/renders/saloon-jade.jpg';
import saloonBordeaux from '@/assets/renders/saloon-bordeaux.jpg';
import saloonArgent from '@/assets/renders/saloon-argent.jpg';
import hyperNoir from '@/assets/renders/hyper-noir.jpg';
import hyperJade from '@/assets/renders/hyper-jade.jpg';
import hyperBordeaux from '@/assets/renders/hyper-bordeaux.jpg';
import hyperArgent from '@/assets/renders/hyper-argent.jpg';

export const RENDERS: Partial<Record<ModelId, Record<string, string>>> = {
  gt: { noir: gtNoir, jade: gtJade, bordeaux: gtBordeaux, argent: gtArgent },
  roadster: { noir: roadsterNoir, jade: roadsterJade, bordeaux: roadsterBordeaux, argent: roadsterArgent },
  brake: { noir: brakeNoir, jade: brakeJade, bordeaux: brakeBordeaux, argent: brakeArgent },
  saloon: { noir: saloonNoir, jade: saloonJade, bordeaux: saloonBordeaux, argent: saloonArgent },
  hyper: { noir: hyperNoir, jade: hyperJade, bordeaux: hyperBordeaux, argent: hyperArgent },
};
