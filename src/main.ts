// import {
//   getCpuTime,
//   getHeapStatistics,
//   getObjectsByPrototype,
//   getTicks,
// } from "game/utils";
// import { StructureSpawn } from "game/prototypes";
// import { arenaInfo } from "game";

interface IHive {}

interface IManager {}

interface ISuperviser {}

interface IUnit {}

class ActionResult {}

class ActionStep {}

class ActionContext {
  public break: boolean = false;
}

class ActionRequest {}

interface IAction {
  act(request: ActionRequest): Generator<unknown, ActionResult, ActionStep>;
}

class Action implements IAction {
  public *act(
    request: ActionRequest
  ): Generator<ActionStep, ActionResult, ActionContext> {
    let ctx: ActionContext = yield new ActionStep();
    while (ctx.break === false) {
      ctx = yield new ActionStep();
    }
    return new ActionResult();
  }
}

let action = new Action();
let generator = action.act(new ActionRequest());

export function loop() {
  let ctx = new ActionContext();
  let next = generator.next(ctx);
  if (next.done) {
    let result = next.value as ActionResult;
  } else {
    let step = next.value as ActionResult;
  }
}
