import { groupBy } from "@App/common";
import { Creep } from "game/prototypes";

describe("testing getSupply function", () => {
  it("NoCreeps", () => {
    let creeps: Creep[] = [];
    var expected = new Map<boolean, Creep[]>();
    expect(groupBy(creeps, c => c.my)).toEqual(expected);
  });
  it("MineVsTheirs", () => {
    let creeps = [{ my: true }, { my: true }, { my: true }, { my: false }, { my: false }, { my: false }] as Creep[];
    let expected = new Map<boolean, Creep[]>([
      [true, [{ my: true }, { my: true }, { my: true }] as Creep[]],
      [false, [{ my: false }, { my: false }, { my: false }] as Creep[]]
    ]);
    expect(groupBy(creeps, c => c.my)).toEqual(expected);
  });
});
