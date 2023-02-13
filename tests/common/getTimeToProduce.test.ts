import { MOVE } from "../constants";

import { getTimeToProduce } from "@App/common";
import { BodyPartConstant } from "game/constants";

describe("testing getTimeToProduce function", () => {
  it("NoCreeps", () => {
    let body: BodyPartConstant[] = [];
    expect(getTimeToProduce(body)).toEqual(0);
  });
  it("SmallCreep", () => {
    let body: BodyPartConstant[] = [MOVE];
    expect(getTimeToProduce(body)).toEqual(body.length * 3);
  });
  it("LargeCreep", () => {
    let body: BodyPartConstant[] = [MOVE, MOVE, MOVE, MOVE, MOVE];
    expect(getTimeToProduce(body)).toEqual(body.length * 3);
  });
});
