import { getConstructionProgress } from "@App/common";
import { BuildableStructure } from "game/constants";
import { FindPathOpts, PathStep } from "game/path-finder";
import { ConstructionSite, Id, RoomObjectJSON, RoomPosition, StructureTower } from "game/prototypes";

class mockConstructionSite implements ConstructionSite {
  prototype: ConstructionSite<BuildableStructure>;
  progress: number;
  progressTotal: number;
  structurePrototypeName: string;
  structure: BuildableStructure;
  my: boolean;
  id: Id<this>;
  exists: boolean;
  ticksToDecay?: number | undefined;
  x: number;
  y: number;

  public constructor(progress: number, total: number, structure: BuildableStructure, my: boolean = true) {
    this.id = "test" as Id<this>;
    this.prototype = this;
    this.progress = progress;
    this.progressTotal = total;
    this.my = my;
    this.exists = true;
    this.structure = structure;
    this.structurePrototypeName = "";
    this.x = 0;
    this.y = 0;
  }
  remove(): 0 | -1 {
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
  toJSON(): RoomObjectJSON {
    throw new Error("Method not implemented.");
  }
}

describe("testing getConstruction function", () => {
  it("NoSites", () => {
    let construction: ConstructionSite[] = [];
    expect(getConstructionProgress(construction)).toStrictEqual([]);
  });
  it("BuildingAt0", () => {
    let site = {} as StructureTower;
    let construction = [new mockConstructionSite(0, 100, site)] as ConstructionSite[];
    expect(getConstructionProgress(construction)).toStrictEqual([0]);
  });
  it("BuildingAt50", () => {
    let site = {} as StructureTower;
    let construction = [new mockConstructionSite(50, 100, site)] as ConstructionSite[];
    expect(getConstructionProgress(construction)).toStrictEqual([0.5]);
  });
  it("BuildingAt100", () => {
    let site = {} as StructureTower;
    let construction = [new mockConstructionSite(100, 100, site)] as ConstructionSite[];
    expect(getConstructionProgress(construction)).toStrictEqual([1]);
  });
});
