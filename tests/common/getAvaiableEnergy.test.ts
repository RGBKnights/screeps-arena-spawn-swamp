let mockGetObjectsByPrototype = jest.fn();
jest.mock("game/utils", () => ({
  getObjectsByPrototype: mockGetObjectsByPrototype
}));

import { getAvaiableEnergy } from "@App/common";
import { StructureContainer } from "game/prototypes";

describe("testing getAvaiableEnergy function", () => {
  it("ZeroContainers", () => {
    mockGetObjectsByPrototype.mockImplementation(() => []);
    expect(getAvaiableEnergy()).toBe(0);
  });
  it("ZeroEngery", () => {
    mockGetObjectsByPrototype.mockImplementation(() => [
      {
        store: {
          energy: 0
        }
      } as StructureContainer
    ]);
    expect(getAvaiableEnergy()).toBe(0);
  });
  it("2500Engery", () => {
    mockGetObjectsByPrototype.mockImplementation(() => [
      {
        store: {
          energy: 2500
        }
      } as StructureContainer
    ]);
    expect(getAvaiableEnergy()).toBe(2500);
  });
  it("1500CombinedEngery", () => {
    mockGetObjectsByPrototype.mockImplementation(() => [
      {
        store: {
          energy: 1000
        }
      } as StructureContainer,
      {
        store: {
          energy: 500
        }
      } as StructureContainer
    ]);
    expect(getAvaiableEnergy()).toBe(1500);
  });
});
