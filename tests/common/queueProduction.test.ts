import { ERR_INVALID_ARGS, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, MAX_CREEP_SIZE, BODYPART_COST, OK, MOVE, SPAWN_HITS } from "../constants";

jest.mock("game/constants", () => ({
  OK: OK
}));

import { queueProduction } from "@App/common";
import { BodyPartConstant, ResourceConstant } from "game/constants";
import { StructureSpawn, Creep, StructureExtension, Store, Spawning, Id, OwnedStructure, OwnedStructureJSON, RoomPosition, StructureConstant } from "game/prototypes";
import { FindPathOpts, PathStep } from "game/path-finder";

type Production = { object?: Creep | undefined; error?: -4 | -10 | -6 | undefined };

class MockSpawner implements StructureSpawn {
  private extensions: StructureExtension[];
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

  public constructor(my: boolean = true, busy: boolean = false, energy: number = 0, extensions: StructureExtension[] = []) {
    this.extensions = extensions;
    this.id = "test" as Id<this>;
    this.prototype = this;
    this.my = my;
    this.store = {
      energy: energy
    } as Store<ResourceConstant>;
    if (busy) {
      this.spawning = {
        needTime: 0,
        remainingTime: 0
      } as Spawning;
    } else {
      // @ts-ignore
      this.spawning = null;
    }
    this.exists = true;
    this.x = 0;
    this.y = 0;
    this.hits = SPAWN_HITS;
    this.hitsMax = SPAWN_HITS;
    this.ticksToDecay = undefined;
  }
  private returnError(error: number): Production {
    return {
      error: error,
      object: undefined
    } as Production;
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
    if (!this.my) {
      return this.returnError(ERR_NOT_OWNER);
    }
    if (this.spawning) {
      return this.returnError(ERR_BUSY);
    }
    if (body.length === 0 || body.length > MAX_CREEP_SIZE) {
      return this.returnError(ERR_INVALID_ARGS);
    }
    const available = this.store.energy + this.extensions.reduce((sum, x) => sum + x.store.energy, 0);
    const required = body.reduce((sum, i) => sum + BODYPART_COST[i], 0);
    if (available < required) {
      return this.returnError(ERR_NOT_ENOUGH_ENERGY);
    }
    return {
      object: {} as Creep
    } as Production;
  }
}

describe("testing queueProduction function", () => {
  it("not_owner", () => {
    let spawn = new MockSpawner(false);
    let body = new Array<BodyPartConstant>();
    expect(queueProduction(spawn, body)).toBe(ERR_NOT_OWNER);
  });
  it("busy", () => {
    let spawn = new MockSpawner(true, true);
    let body = new Array<BodyPartConstant>();
    expect(queueProduction(spawn, body)).toBe(ERR_BUSY);
  });
  it("invalid_args_no_body", () => {
    let spawn = new MockSpawner();
    let body = new Array<BodyPartConstant>();
    expect(queueProduction(spawn, body)).toBe(ERR_INVALID_ARGS);
  });
  it("invalid_args_large_body", () => {
    let spawn = new MockSpawner();
    let body = new Array<BodyPartConstant>();
    for (let i = 0; i < 100; i++) {
      body.push(MOVE);
    }
    expect(queueProduction(spawn, body)).toBe(ERR_INVALID_ARGS);
  });
  it("not_enough_energy", () => {
    let extensions = [] as StructureExtension[];
    let spawn = new MockSpawner(true, false, 0, extensions);
    let body = [MOVE] as BodyPartConstant[];
    expect(queueProduction(spawn, body)).toBe(ERR_NOT_ENOUGH_ENERGY);
  });
  it("queued", () => {
    let extensions = [] as StructureExtension[];
    let spawn = new MockSpawner(true, false, 1000, extensions);
    let body = [MOVE] as BodyPartConstant[];
    expect(queueProduction(spawn, body)).toBe(OK);
  });
});
