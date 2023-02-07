let mockGetRange = jest.fn().mockImplementation((q, p) => Math.sqrt(Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2)));

jest.mock("game/utils", () => ({
  getRange: mockGetRange
}));

import { getClusters } from "@App/common";
import { Creep } from "game/prototypes";

describe("testing getClusters function", () => {
  it("noCreeps", () => {
    let creeps: Creep[] = [];
    let groups = getClusters(creeps);
    expect(Object.keys(groups).length).toBe(0);
  });
  it("getClusters", () => {
    let creeps = [
      { x: 1, y: 1, my: false },
      { x: 0, y: 1, my: false },
      { x: 10, y: 10, my: false },
      { x: 10, y: 13, my: true },
      { x: 55, y: 55, my: true },
      { x: 89, y: 89, my: true },
      { x: 57, y: 55, my: true }
    ] as Creep[];
    let groups = getClusters(creeps);
    expect(Object.keys(groups).length).toBe(3);
  });
});
