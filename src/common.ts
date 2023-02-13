import { ATTACK, ATTACK_POWER, BODYPART_COST, BodyPartConstant, BuildableStructure, OK, RANGED_ATTACK, RANGED_ATTACK_POWER, ResourceConstant } from "game/constants";
import { ConstructionSite, Creep, Store, StructureSpawn } from "game/prototypes";
import { cluster } from "@App/dbscan";
import { getTicks } from "game/utils";

export function groupBy<T, K extends string | number | boolean>(arr: T[], key: (i: T) => K) {
  return arr.reduce((groups, item) => {
    const value = key(item);
    const collection = groups.get(value);
    if (collection) {
      collection.push(item);
    } else {
      groups.set(value, [item]);
    }
    return groups;
  }, new Map<K, T[]>());
}

export function isFirstTick(): boolean {
  return getTicks() === 1;
}

export interface IHasStore {
  store: Store<ResourceConstant>;
}

export function getEnergy(sources: IHasStore[]): number {
  return sources.reduce((sum, _) => sum + _.store.energy, 0);
}

export function getSupply(creeps: Creep[]): number {
  return creeps.flatMap(c => c.body).reduce((sum, body) => sum + BODYPART_COST[body.type], 0);
}

export function getDurability(creeps: Creep[]): number {
  return creeps.flatMap(c => c.body).reduce((sum, body) => sum + body.hits, 0);
}

export function getDamage(creeps: Creep[]): number {
  return creeps.flatMap(c => c.body).reduce((sum, body) => sum + (body.type === ATTACK ? ATTACK_POWER : body.type === RANGED_ATTACK ? RANGED_ATTACK_POWER : 0), 0);
}

export function getParts(creeps: Creep[]): Record<BodyPartConstant, number> {
  return creeps
    .flatMap(c => c.body)
    .reduce((parts, b) => {
      parts[b.type] = parts[b.type] || 0;
      parts[b.type]++;
      return parts;
    }, {} as Record<BodyPartConstant, number>);
}

export function getClusters(creeps: Creep[]) {
  return cluster(creeps);
}

export function queueProduction(spawn: StructureSpawn, body: BodyPartConstant[]): number {
  const result = spawn.spawnCreep(body);
  if (result.error) return result.error;
  else return OK;
}

export function getTimeToProduce(body: BodyPartConstant[]): number {
  return body.length * 3;
}

export function getProduction(spawns: StructureSpawn[]): Creep[] {
  return spawns.filter(a => a.spawning).map(a => a.spawning.creep);
}

export function getProductionProgress(spawns: StructureSpawn[]): number[] {
  return spawns.filter(a => a.spawning).map(a => a.spawning.remainingTime / a.spawning.needTime);
}

export function getConstruction(spawns: ConstructionSite[]): BuildableStructure[] {
  return spawns.map(a => a.structure);
}

export function getConstructionProgress(site: ConstructionSite[]): number[] {
  return site.map(s => s.progress / s.progressTotal);
}

// export function getBody(): BodyPartConstant[] {
//   return [];
// }
