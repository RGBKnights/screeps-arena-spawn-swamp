import { getTicks } from "game/utils";

export function isFirstTick() {
  return getTicks() === 1;
}
