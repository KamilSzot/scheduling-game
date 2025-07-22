// src/game/personConfig.ts
// Shared person config for the game
import { TICKS_PER_DAY } from './roomConfig';

// PersonConfig interface moved here from person.ts
export interface PersonConfig {
  maxTiredness: number;
  maxHunger: number;
  tirednessIncrease: number;
  tirednessDecrease: number;
  hungerIncrease: number;
  hungerSleepModifier: number;
  stomachFillRate: number; // per tick, fraction filled per tick
  stomachEmptyRate: number; // per tick, fraction emptied per tick
}


const MAX_TIREDNESS = 100;
const MAX_HUNGER = 100;



// When sleeping, hunger increases 15% slower
const HUNGER_SLEEP_MODIFIER = 0.85; // 15% slower when sleeping

// Stomach fills in the kitchen, empties outside. Define as fraction of a day for clarity.
// E.g., fill in 5% of a day, empty in 10% of a day
const STOMACH_FILL_FRACTION = 0.05; // fills in 5% of a day
const STOMACH_EMPTY_FRACTION = 0.10; // empties in 10% of a day
export const PERSON_CONFIG: PersonConfig = {
  maxTiredness: MAX_TIREDNESS,
  maxHunger: MAX_HUNGER,
  // 2/3 of a day to go from 0 to 100 (awake), 1/3 of a day to go from 100 to 0 (sleep)
  tirednessIncrease: MAX_TIREDNESS / (TICKS_PER_DAY * (2/3)),
  tirednessDecrease: MAX_TIREDNESS / (TICKS_PER_DAY * (1/3)),
  // Hunger increases from 0 to 100 in 1 day (default), so per tick = 100 / TICKS_PER_DAY
  hungerIncrease: MAX_HUNGER / TICKS_PER_DAY,
  hungerSleepModifier: HUNGER_SLEEP_MODIFIER,
  // Stomach fills to 1 in STOMACH_FILL_FRACTION of a day, empties to 0 in STOMACH_EMPTY_FRACTION of a day
  stomachFillRate: 1 / (TICKS_PER_DAY * STOMACH_FILL_FRACTION), // per tick
  stomachEmptyRate: 1 / (TICKS_PER_DAY * STOMACH_EMPTY_FRACTION), // per tick
};
