import { ATTACK, ATTACK_POWER, CARRY, HEAL, MOVE, RANGED_ATTACK, RANGED_ATTACK_POWER, TOUGH, WORK } from "../constants";

let mockGetObjectsByPrototype = jest.fn();
jest.mock("game/utils", () => ({
  getObjectsByPrototype: mockGetObjectsByPrototype
}));

jest.mock("game/constants", () => ({
  ATTACK: ATTACK,
  RANGED_ATTACK: RANGED_ATTACK,
  ATTACK_POWER: ATTACK_POWER,
  RANGED_ATTACK_POWER: RANGED_ATTACK_POWER
}));

import { getDamage } from "@App/common";
import { Creep } from "game/prototypes";

describe("testing getDamage function", () => {
  it("NoCreeps", () => {
    let creeps: Creep[] = [];
    expect(getDamage(creeps)).toBe(0);
  });
  it("SmallCreep", () => {
    let creeps = [
      {
        my: true,
        body: [
          {
            type: WORK
          },
          {
            type: MOVE
          },
          {
            type: CARRY
          }
        ]
      }
    ] as Creep[];
    expect(getDamage(creeps)).toBe(0);
  });
  it("LargeCreep", () => {
    let creeps = [
      {
        my: true,
        body: [
          {
            type: ATTACK
          },
          {
            type: MOVE
          },
          {
            type: MOVE
          },
          {
            type: TOUGH
          },
          {
            type: HEAL
          },
          {
            type: RANGED_ATTACK
          }
        ]
      }
    ] as Creep[];
    expect(getDamage(creeps)).toBe(ATTACK_POWER + RANGED_ATTACK_POWER);
  });
});
