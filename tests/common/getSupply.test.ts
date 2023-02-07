import { BODYPART_COST, BODYPART_HITS, ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from "../constants";

let mockGetObjectsByPrototype = jest.fn();
jest.mock("game/utils", () => ({
  getObjectsByPrototype: mockGetObjectsByPrototype
}));

jest.mock("game/constants", () => ({
  BODYPART_COST: BODYPART_COST
}));

import { getSupply } from "@App/common";
import { Creep } from "game/prototypes";

describe("testing getSupply function", () => {
  it("NoCreeps", () => {
    let creeps: Creep[] = [];
    expect(getSupply(creeps)).toBe(0);
  });
  it("SmallCreep", () => {
    let creeps = [
      {
        my: true,
        body: [
          {
            type: WORK,
            hits: BODYPART_HITS
          },
          {
            type: MOVE,
            hits: BODYPART_HITS
          },
          {
            type: CARRY,
            hits: BODYPART_HITS
          }
        ]
      }
    ] as Creep[];
    let cost = BODYPART_COST[WORK] + BODYPART_COST[MOVE] + BODYPART_COST[CARRY];
    expect(getSupply(creeps)).toBe(cost);
  });
  it("LargeCreep", () => {
    // mockGetObjectsByPrototype.mockReset();
    // mockGetObjectsByPrototype.mockImplementationOnce(() => );
    let creeps = [
      {
        my: true,
        body: [
          {
            type: ATTACK,
            hits: BODYPART_HITS
          },
          {
            type: MOVE,
            hits: BODYPART_HITS
          },
          {
            type: MOVE,
            hits: BODYPART_HITS
          },
          {
            type: TOUGH,
            hits: BODYPART_HITS
          },
          {
            type: HEAL,
            hits: BODYPART_HITS
          },
          {
            type: RANGED_ATTACK,
            hits: BODYPART_HITS
          }
        ]
      }
    ] as Creep[];
    let cost = BODYPART_COST[ATTACK] + BODYPART_COST[MOVE] + BODYPART_COST[MOVE] + BODYPART_COST[TOUGH] + BODYPART_COST[HEAL] + BODYPART_COST[RANGED_ATTACK];
    expect(getSupply(creeps)).toBe(cost);
  });
});
