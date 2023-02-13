import { BODYPART_HITS, ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from "../constants";

import { getParts } from "@App/common";
import { Creep } from "game/prototypes";

describe("testing getParts function", () => {
  it("NoCreeps", () => {
    let creeps: Creep[] = [];
    expect(getParts(creeps)).toEqual({});
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
    let expected = {
      [WORK.toString()]: 1,
      [MOVE.toString()]: 1,
      [CARRY.toString()]: 1
    };
    expect(getParts(creeps)).toEqual(expected);
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
    let expected = {
      [ATTACK.toString()]: 1,
      [MOVE.toString()]: 2,
      [TOUGH.toString()]: 1,
      [HEAL.toString()]: 1,
      [RANGED_ATTACK.toString()]: 1
    };
    expect(getParts(creeps)).toEqual(expected);
  });
});
