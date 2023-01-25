let mockGetObjectsByPrototype = jest.fn();

jest.mock("game/utils", () => ({
  getObjectsByPrototype: mockGetObjectsByPrototype
}));

import { getClaimedEnergy } from "@App/common";
import { StructureExtension, StructureSpawn } from "game/prototypes";

describe("testing getClaimedEnergy function", () => {
  it("MineZeroEnergy", () => {
    mockGetObjectsByPrototype.mockReset();
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: true,
        store: {
          energy: 0
        }
      } as StructureSpawn
    ]);
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: true,
        store: {
          energy: 0
        }
      } as StructureExtension
    ]);
    expect(getClaimedEnergy(true)).toBe(0);
  });
  it("Mine200CombinedEnergy", () => {
    mockGetObjectsByPrototype.mockReset();
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: true,
        store: {
          energy: 100
        }
      } as StructureSpawn
    ]);
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: true,
        store: {
          energy: 100
        }
      } as StructureExtension
    ]);
    expect(getClaimedEnergy(true)).toBe(200);
  });
  it("MineZeroStructures", () => {
    mockGetObjectsByPrototype.mockReset();
    mockGetObjectsByPrototype.mockImplementationOnce(() => [{ my: false }]);
    mockGetObjectsByPrototype.mockImplementationOnce(() => []);
    expect(getClaimedEnergy(true)).toBe(0);
  });
  it("TheirsZeroStructures", () => {
    mockGetObjectsByPrototype.mockReset();
    mockGetObjectsByPrototype.mockImplementationOnce(() => [{ my: true }]);
    mockGetObjectsByPrototype.mockImplementationOnce(() => []);
    expect(getClaimedEnergy(false)).toBe(0);
  });
  it("TheirsZeroEnergy", () => {
    mockGetObjectsByPrototype.mockReset();
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: false,
        store: {
          energy: 0
        }
      } as StructureSpawn
    ]);
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: false,
        store: {
          energy: 0
        }
      } as StructureExtension
    ]);
    expect(getClaimedEnergy(false)).toBe(0);
  });
  it("Theirs400CombinedEnergy", () => {
    mockGetObjectsByPrototype.mockReset();
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: false,
        store: {
          energy: 200
        }
      } as StructureSpawn
    ]);
    mockGetObjectsByPrototype.mockImplementationOnce(() => [
      {
        my: false,
        store: {
          energy: 200
        }
      } as StructureExtension
    ]);
    expect(getClaimedEnergy(false)).toBe(400);
  });
});
