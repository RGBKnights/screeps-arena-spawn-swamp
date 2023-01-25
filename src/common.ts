import { Creep, StructureContainer, StructureExtension, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype, getTicks } from "game/utils";
import { BODYPART_COST } from "game/constants";

export function isFirstTick(): boolean {
  return getTicks() === 1;
}

export function getAvaiableEnergy(): number {
  const containers = getObjectsByPrototype(StructureContainer);
  return containers.reduce((sum, _) => sum + _.store.energy, 0);
}

export function getClaimedEnergy(mine: boolean): number {
  const spawns = getObjectsByPrototype(StructureSpawn).filter(_ => _.my === mine);
  const extensions = getObjectsByPrototype(StructureExtension).filter(_ => _.my === mine);
  const total = spawns.reduce((sum, _) => sum + _.store.energy, 0) + extensions.reduce((sum, _) => sum + _.store.energy, 0);
  return total;
}

export function getSupply(mine: boolean): number {
  const creeps = getObjectsByPrototype(Creep).filter(_ => _.my === mine);
  return creeps.reduce((sum, _) => sum + _.body.filter(s => s.hits > 0).reduce((s, b) => s + BODYPART_COST[b.type], 0), 0);
}
