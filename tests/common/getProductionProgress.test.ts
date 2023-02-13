import { ERR_INVALID_ARGS, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, MAX_CREEP_SIZE, BODYPART_COST, OK, MOVE, SPAWN_HITS } from "../constants";
import { getProductionProgress } from "@App/common";
import { BodyPartConstant, ResourceConstant } from "game/constants";
import { StructureSpawn, Creep, StructureExtension, Store, Spawning, Id, OwnedStructure, OwnedStructureJSON, RoomPosition, StructureConstant } from "game/prototypes";
import { FindPathOpts, PathStep } from "game/path-finder";

type Production = { object?: Creep | undefined; error?: -4 | -10 | -6 | undefined };

class MockSpawner implements StructureSpawn {
  public id: Id<this>;
  public exists: boolean;
  public my: boolean;
  public x: number;
  public y: number;
  public store: Store<ResourceConstant>;
  public spawning: Spawning;
  public prototype: OwnedStructure<StructureConstant>;
  public hits: number;
  public hitsMax: number;
  public ticksToDecay?: number | undefined;

  public constructor(spawning: Spawning | null) {
    this.id = "test" as Id<this>;
    this.prototype = this;
    this.my = true;
    this.store = {
      energy: 0
    } as Store<ResourceConstant>;
    // @ts-ignore
    this.spawning = spawning;
    this.exists = true;
    this.x = 0;
    this.y = 0;
    this.hits = SPAWN_HITS;
    this.hitsMax = SPAWN_HITS;
    this.ticksToDecay = undefined;
  }
  toJSON(): OwnedStructureJSON {
    throw new Error("Method not implemented.");
  }
  getRangeTo(pos: RoomPosition): number {
    throw new Error("Method not implemented.");
  }
  findPathTo(pos: RoomPosition, opts?: FindPathOpts | undefined): PathStep[] {
    throw new Error("Method not implemented.");
  }
  findInRange<T extends RoomPosition>(positions: T[], range: number): T[] {
    throw new Error("Method not implemented.");
  }
  findClosestByRange<T extends RoomPosition>(positions: T[]): T | null {
    throw new Error("Method not implemented.");
  }
  findClosestByPath<T extends RoomPosition>(positions: T[], opts?: FindPathOpts | undefined): T | null {
    throw new Error("Method not implemented.");
  }
  spawnCreep(body: BodyPartConstant[]): Production {
    throw new Error("Method not implemented.");
  }
}

describe("testing getProduction function", () => {
  it("NoSpawns", () => {
    let spawns: StructureSpawn[] = [];
    expect(getProductionProgress(spawns)).toEqual([]);
  });
  it("NotSpawning", () => {
    let spawns = [new MockSpawner(null)];
    expect(getProductionProgress(spawns)).toStrictEqual([]);
  });
  it("SpawningAt10", () => {
    let creep = {
      id: "test"
    } as Creep;
    let spawning = {
      creep: creep,
      needTime: 10,
      remainingTime: 1
    } as Spawning;
    let spawns = [new MockSpawner(spawning)];
    let expected = [0.1];
    expect(getProductionProgress(spawns)).toStrictEqual(expected);
  });
  it("SpawningAt50", () => {
    let creep = {
      id: "test"
    } as Creep;
    let spawning = {
      creep: creep,
      needTime: 10,
      remainingTime: 5
    } as Spawning;
    let spawns = [new MockSpawner(spawning)];
    let expected = [0.5];
    expect(getProductionProgress(spawns)).toStrictEqual(expected);
  });
  it("SpawningAt100", () => {
    let creep = {
      id: "test"
    } as Creep;
    let spawning = {
      creep: creep,
      needTime: 10,
      remainingTime: 10
    } as Spawning;
    let spawns = [new MockSpawner(spawning)];
    let expected = [1];
    expect(getProductionProgress(spawns)).toStrictEqual(expected);
  });
});
