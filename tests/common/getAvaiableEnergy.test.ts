import { getEnergy } from "@App/common";
import { StructureContainer } from "game/prototypes";

describe("testing getAvaiableEnergy function", () => {
  it("ZeroContainers", () => {
    let containers: StructureContainer[] = [];
    expect(getEnergy(containers)).toBe(0);
  });
  it("ZeroEngery", () => {
    let containers = [
      {
        store: {
          energy: 0
        }
      }
    ] as StructureContainer[];
    expect(getEnergy(containers)).toBe(0);
  });
  it("2500Engery", () => {
    let containers = [
      {
        store: {
          energy: 2500
        }
      }
    ] as StructureContainer[];
    expect(getEnergy(containers)).toBe(2500);
  });
  it("1500CombinedEngery", () => {
    let containers = [
      {
        store: {
          energy: 1000
        }
      },
      {
        store: {
          energy: 500
        }
      }
    ] as StructureContainer[];
    expect(getEnergy(containers)).toBe(1500);
  });
});
