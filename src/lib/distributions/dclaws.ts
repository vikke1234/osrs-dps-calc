// noinspection PointlessArithmeticExpressionJS

import { AttackDistribution, HitDistribution, WeightedHit } from '@/lib/HitDist';

const attemptValues = (acc: number, max: number, attempt: number): [low: number, high: number, chancePer: number] => {
  const low = Math.trunc(max * (4 - attempt) / 4);
  const high = Math.trunc(max * (8 - attempt) / 4) - (attempt === 0 ? 1 : 0);
  return [
    low,
    high,
    (acc * (1 - acc) ** attempt) / (high - low + 1),
  ];
};

const dClawDist = (acc: number, max: number): AttackDistribution => {
  const dist = new HitDistribution([]);

  // 4-2-1-1
  {
    const [low, high, chancePer] = attemptValues(acc, max, 0);
    for (let dmg = low; dmg <= high; dmg++) {
      dist.addHit(new WeightedHit(
        chancePer,
        [
          Math.trunc(dmg * 4 / 8),
          Math.trunc(dmg * 2 / 8),
          Math.trunc(dmg * 1 / 8),
          Math.trunc(dmg * 1 / 8) + 1,
        ],
      ));
    }
  }

  // 0-4-2-2
  {
    const [low, high, chancePer] = attemptValues(acc, max, 1);
    for (let dmg = low; dmg <= high; dmg++) {
      dist.addHit(new WeightedHit(
        chancePer,
        [
          0,
          Math.trunc(dmg * 2 / 4),
          Math.trunc(dmg * 1 / 4),
          Math.trunc(dmg * 1 / 4) + 1,
        ],
      ));
    }
  }

  // 0-0-3-3
  {
    const [low, high, chancePer] = attemptValues(acc, max, 2);
    for (let dmg = low; dmg <= high; dmg++) {
      dist.addHit(new WeightedHit(
        chancePer,
        [
          0,
          0,
          Math.trunc(dmg * 1 / 2),
          Math.trunc(dmg * 1 / 2) + 1,
        ],
      ));
    }
  }

  // 0-0-0-5
  {
    const [low, high, chancePer] = attemptValues(acc, max, 3);
    for (let dmg = low; dmg <= high; dmg++) {
      dist.addHit(new WeightedHit(
        chancePer,
        [
          0,
          0,
          0,
          dmg + 1,
        ],
      ));
    }
  }

  const remainingAccuracy = (1 - acc) ** 4;
  dist.addHit(new WeightedHit(remainingAccuracy * 2 / 3, [0, 0, 1, 1]));
  dist.addHit(new WeightedHit(remainingAccuracy * 1 / 3, [0, 0, 0, 0]));

  return new AttackDistribution([dist]);
};

export default dClawDist;
