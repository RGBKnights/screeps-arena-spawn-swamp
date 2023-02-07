import { BODYPART_HITS, ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from "../constants";

import { getDurability } from "@App/common";
import { Creep } from "game/prototypes";

describe("testing getDurability function", () => {
  it("NoCreeps", () => {
    let creeps: Creep[] = [];
    expect(getDurability(creeps)).toBe(0);
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
    expect(getDurability(creeps)).toBe(BODYPART_HITS * 3);
  });
  it("LargeCreep", () => {
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
    expect(getDurability(creeps)).toBe(BODYPART_HITS * 6);
  });
});
