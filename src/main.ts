import {
  BODYPART_COST,
  BodyPartConstant,
  CARRY,
  ERR_BUSY,
  ERR_FULL,
  ERR_INVALID_ARGS,
  ERR_INVALID_TARGET,
  ERR_NOT_ENOUGH_ENERGY,
  ERR_NOT_ENOUGH_RESOURCES,
  ERR_NOT_IN_RANGE,
  ERR_NOT_OWNER,
  ERR_NO_BODYPART,
  ERR_TIRED,
  MOVE,
  OK,
  RANGED_ATTACK,
  RESOURCE_ENERGY,
  ResourceConstant
} from "game/constants";
import { Creep, RoomPosition, Store, Structure, StructureContainer, StructureSpawn } from "game/prototypes";
import { context } from "./context";
import { getObjectsByPrototype } from "game/utils";

/*
const deltaToDirection = function (step: PathStep | RoomPosition): DirectionConstant {
  const dx = step.x;
  const dy = step.y;
  if (dx < 0) {
    if (dy < 0) {
      return TOP_LEFT;
    } else if (dy > 0) {
      return BOTTOM_LEFT;
    } else {
      return LEFT;
    }
  } else if (dx > 0) {
    if (dy < 0) {
      return TOP_RIGHT;
    } else if (dy > 0) {
      return BOTTOM_RIGHT;
    } else {
      return RIGHT;
    }
  } else {
    if (dy < 0) {
      return TOP;
    } else if (dy > 0) {
      return BOTTOM;
    } else {
      throw new Error("Step Delta is Zero");
    }
  }
};
*/

// function* awaitAny(generators: Generator<void, void, void>[]): Generator<void, void, void> {
//   let done = false;
//   for (; done; yield) {
//     const results = generators.map(g => (g.next().done ? true : false));
//     done = results.reduce((acc, v) => (acc = acc || v), true);
//   }
// }

function* awaitProduction(spawn: StructureSpawn): Generator<void, void, void> {
  while (spawn.spawning) {
    yield;
  }
}

function* awaitEngery<S extends { store: Store<ResourceConstant> }>(s: S, required: number): Generator<void, void, void> {
  while (s.store.energy < required) {
    yield;
  }
}

function* queueProduction<C extends Creep>(body: BodyPartConstant[]): Generator<void, C, void> {
  const spawn = getObjectsByPrototype(StructureSpawn).find(s => s.my === true) as StructureSpawn; // Move to Paramater /  Context

  const required = body.map(b => BODYPART_COST[b]).reduce((sum, c) => sum + c, 0);
  yield* awaitEngery(spawn, required);

  const result = spawn.spawnCreep(body);
  switch (result.error) {
    case ERR_BUSY:
      throw new Error(`Cant spawn creep [${body.toString()}] because the spawn is already busy`);
    case ERR_INVALID_ARGS:
      throw new Error(`Cant spawn creep [${body.toString()}] because body is invalid`);
    case ERR_NOT_ENOUGH_ENERGY:
      throw new Error(`Cant spawn creep [${body.toString()}] because not enough energy`);
    default:
      yield;
      break;
  }

  yield* awaitProduction(spawn);

  return result.object as C;
}

function* production(): Generator<void, void, void> {
  const c1 = yield* queueProduction<Creep>([MOVE, CARRY, CARRY, CARRY, CARRY]);
  context.add(hualer(c1));
  const c2 = yield* queueProduction<Creep>([MOVE, CARRY, CARRY, CARRY, CARRY]);
  context.add(hualer(c2));
  const c3 = yield* queueProduction<Creep>([MOVE, CARRY, CARRY, CARRY, CARRY]);
  context.add(hualer(c3));

  for (;;) {
    const c4 = yield* queueProduction<Creep>([MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]);
    const c5 = yield* queueProduction<Creep>([MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]);
    const c6 = yield* queueProduction<Creep>([MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]);
    context.add(rusher(c4));
    context.add(rusher(c5));
    context.add(rusher(c6));
  }
}

function* hualer(creep: Creep): Generator<void, void, void> {
  const spawn = getObjectsByPrototype(StructureSpawn).find(s => s.my === true) as StructureSpawn;

  for (; creep.exists && spawn.exists; ) {
    for (; creep.store.energy < 200; ) {
      const container = getObjectsByPrototype(StructureContainer)
        .filter(c => c.store.energy > 0)
        .sort((a, b) => b.getRangeTo(creep) - a.getRangeTo(creep))
        .pop();

      yield* move(creep, container);
      yield* withdraw(creep, container);
    }

    yield* move(creep, spawn);
    yield* transfer(creep, spawn);
  }
}

function* withdraw(creep: Creep, target: Structure | undefined): Generator<void, void, void> {
  if (target === undefined) return;
  if (target.exists === false) return;
  if (creep === undefined) return;
  if (creep.exists === false) return;

  const result = creep.withdraw(target, RESOURCE_ENERGY);
  switch (result) {
    case ERR_NOT_OWNER:
      throw new Error(`Creep ${creep.id} is not mine`);
    case ERR_INVALID_ARGS:
      throw new Error(`Creep ${creep.id} dose not have a CARRY body part`);
    case ERR_INVALID_TARGET:
      throw new Error(`Target ${target.id} is invalid`);
    case ERR_NOT_ENOUGH_RESOURCES:
      break;
    case ERR_FULL:
    case OK:
      yield;
      break;
    default:
      throw new Error(`Unexpected Error: ${result}`);
  }
}

function* transfer(creep: Creep, target: Structure): Generator<void, void, void> {
  if (target === undefined) return;
  if (target.exists === false) return;
  if (creep === undefined) return;
  if (creep.exists === false) return;

  const result = creep.transfer(target, RESOURCE_ENERGY);
  switch (result) {
    case ERR_NOT_OWNER:
      throw new Error(`Creep ${creep.id} is not mine`);
    case ERR_INVALID_ARGS:
      throw new Error(`Creep ${creep.id} dose not have a CARRY body part`);
    case ERR_INVALID_TARGET:
      throw new Error(`Target ${target.id} is invalid`);
    case ERR_NOT_ENOUGH_RESOURCES:
      break;
    case ERR_FULL:
    case OK:
      yield;
      break;
    default:
      throw new Error(`Unexpected Error: ${result}`);
  }
}

function* move(creep: Creep | undefined, target: RoomPosition | undefined, range = 1): Generator<void, boolean, void> {
  if (target === undefined) return false;
  if (creep === undefined) return false;
  if (creep.exists === false) return false;

  while (creep.getRangeTo(target) > range) {
    if (target === undefined) return false;
    switch (creep.moveTo(target)) {
      case ERR_NOT_OWNER:
        throw new Error(`Creep ${creep.id} is not mine`);
      case ERR_NO_BODYPART:
        return false;
      case ERR_TIRED:
      case OK:
        yield;
        break;
      default:
        throw new Error(`Unexpected Error`);
    }
  }
  return true;
}

function* attackMove(creep: Creep): Generator<void, void, void> {
  while (creep.exists) {
    const creeps = getObjectsByPrototype(Creep).filter(c => c.my === false);
    const targets = creep.findInRange(creeps, 3);
    for (const target of targets) {
      switch (creep.rangedAttack(target)) {
        case ERR_NOT_OWNER:
          throw new Error(`Creep ${creep.id} is not mine`);
        case ERR_NO_BODYPART:
          throw new Error(`Creep ${creep.id} dose not have the required body type for ranged attack`);
        case ERR_INVALID_TARGET:
        case ERR_NOT_IN_RANGE:
          continue;
        case OK:
        default:
          break;
      }
    }
    yield;
  }
}

function* attackStructures(creep: Creep): Generator<void, void, void> {
  while (creep.exists) {
    const spawns = getObjectsByPrototype(StructureSpawn).filter(c => c.my === false);
    const targets = creep.findInRange(spawns, 3);
    for (const target of targets) {
      switch (creep.rangedAttack(target)) {
        case ERR_NOT_OWNER:
          throw new Error(`Creep ${creep.id} is not mine`);
        case ERR_NO_BODYPART:
          throw new Error(`Creep ${creep.id} dose not have the required body type for ranged attack`);
        case ERR_INVALID_TARGET:
        case ERR_NOT_IN_RANGE:
          continue;
        case OK:
        default:
          break;
      }
    }
    yield;
  }
}

function* whenAll(...generators: Generator<void, void | boolean, void>[]): Generator<void, void, void> {
  let waiting = true;
  while (waiting) {
    for (const generator of generators) {
      const done = generator.next().done ? true : false;
      waiting = waiting || done;
    }
    yield;
  }
}

function* rusher(creep: Creep): Generator<void, void, void> {
  const target = getObjectsByPrototype(StructureSpawn).find(s => s.my === false) as StructureSpawn; // Move to Context
  yield* whenAll(move(creep, target), attackMove(creep)); // attackStructures(creep)
}

// Default Generators
context.add(production());

export function loop(): void {
  context.update();
}
