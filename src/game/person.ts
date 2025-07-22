// src/game/person.ts
// Handles energy and hunger logic for the person in the room game

export interface PersonState {
  tiredness: number;
  hunger: number;
  stomach?: number; // 0..1, fills at kitchenette
}

import type { PersonConfig } from './personConfig';

export type PersonAction = 'sleep' | 'sit' | 'kitchen';

export function updatePersonState(
  state: PersonState,
  action: PersonAction,
  config: PersonConfig,
  tickMs: number = 50
): PersonState & { tirednessDelta: number } {
  let { tiredness, hunger, stomach = 0 } = state;
  let tirednessIncrease = config.tirednessIncrease;
  if (hunger > config.maxHunger - 20) tirednessIncrease *= 2;

  // Tiredness logic
  let tirednessDelta = 0;
  if (action === 'sleep') {
    tirednessDelta = -config.tirednessDecrease;
    tiredness = Math.max(0, tiredness + tirednessDelta);
  } else {
    tirednessDelta = tirednessIncrease;
    tiredness = Math.min(config.maxTiredness, tiredness + tirednessDelta);
  }

  // Hunger logic
  if (stomach > 0) {
    // Hunger decreases slowly when stomach is not empty
    const stomachEmptyRate = tickMs / 3000; // must match emptying rate below
    const hungerDecrease = 20 * (stomachEmptyRate); // slower than before, matches original snacking rate
    hunger = Math.max(0, hunger - hungerDecrease);
  } else if (action === 'sleep') {
    if (hunger > config.maxHunger - 10) {
      // Slowly recover to maxHunger - 10 (i.e., hunger decreases to 90)
      hunger = Math.max(config.maxHunger - 10, hunger - config.hungerIncrease * config.hungerSleepModifier);
    } else {
      // Increase normally while sleeping, but not above maxHunger - 10
      hunger = Math.min(config.maxHunger - 10, hunger + config.hungerIncrease * config.hungerSleepModifier);
    }
  } else {
    // Only increase hunger if stomach is empty
    hunger = Math.min(config.maxHunger, hunger + config.hungerIncrease);
  }

  // Kitchenette logic: stomach fills in kitchen, empties outside
  if (action === 'kitchen') {
    stomach = Math.min(1, stomach + tickMs / 1250); // fill in ~1.25s (twice as fast)
  } else {
    if (stomach > 0) {
      // Stomach empties slowly
      const stomachEmptyRate = tickMs / 3000; // empties in ~3s
      stomach = Math.max(0, stomach - stomachEmptyRate);
    }
  }

  return { tiredness, hunger, stomach, tirednessDelta };
}

export function getAutoAction(
  state: PersonState,
  action: PersonAction,
  config: PersonConfig
): PersonAction {
  if (state.tiredness >= config.maxTiredness) {
    return 'sleep';
  } else if (state.tiredness <= 0) {
    return 'sit';
  } else if (state.hunger > 80 && action !== 'sleep') {
    // If hunger is over 80 and not sleeping, go to kitchenette
    return 'kitchen';
  } else if (action === 'kitchen' && (state.hunger <= 0 || state.stomach !== undefined && state.stomach >= 1)) {
    // If in kitchenette and hunger is zero or stomach is full, leave (sit)
    return 'sit';
  }
  return action;
}
