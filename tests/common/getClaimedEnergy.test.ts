import { getEnergy, IHasStore } from "@App/common";
import { StructureExtension, StructureSpawn } from "game/prototypes";

describe("testing getClaimedEnergy function", () => {
  it("ZeroStructures", () => {
    let collection: IHasStore[] = [];
    expect(getEnergy(collection)).toBe(0);
  });
  it("ZeroEnergy", () => {
    let collection = [
      {
        my: true,
        store: {
          energy: 0
        }
      } as StructureSpawn,
      {
        my: true,
        store: {
          energy: 0
        }
      } as StructureExtension
    ];
    expect(getEnergy(collection)).toBe(0);
  });
  it("200CombinedEnergy", () => {
    let collection = [
      {
        my: true,
        store: {
          energy: 100
        }
      } as StructureSpawn,
      {
        my: true,
        store: {
          energy: 100
        }
      } as StructureExtension
    ];
    expect(getEnergy(collection)).toBe(200);
  });
});
