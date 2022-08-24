import { BodyPartConstant, BODYPART_COST, CREEP_SPAWN_TIME } from "game/constants"
import { getObjectsByPrototype, getTicks } from "game/utils"
import { StructureSpawn } from "game/prototypes"
import { CancellationToken, CancellationTokenSource } from "common/cancellation-token"
import { Component } from "common/component"
import { Unit, DefaultUnitStates } from "common/units"
import { EventDispatcher } from "common/dispatchers"
import { CancellationRequestedError } from "./errors"

export class UnitProductionOrder {
  public body: Array<BodyPartConstant> = []
  //public state: R
}

export class UnitReadyEvent {
  constructor(unit: Unit) {
    this.unit = unit
  }

  public unit: Unit
}

export type UnitGenerator = Generator<void, Unit | undefined, unknown>;

export class UnitFabricator extends Component {
  private queue: Array<UnitGenerator> = []
  private current: UnitGenerator | undefined
  private spawn: StructureSpawn | undefined

  constructor() {
    super()

    this.onCreateReady = new EventDispatcher<UnitReadyEvent>()
  }

  public onCreateReady: EventDispatcher<UnitReadyEvent>

  private * buildCreepSteps(order: UnitProductionOrder, token: CancellationToken): UnitGenerator {
    let mySpawn = this.spawn
    if (mySpawn == undefined)
      throw new Error("No Spawn Found")

    let cost = order.body.reduce((p, c) => p + BODYPART_COST[c], 0)

    while (mySpawn.store.energy < cost) {
      token.throwIfCancellationRequested()
      yield
    }

    var creep = mySpawn.spawnCreep(order.body).object
    if (creep == undefined)
      throw new Error("Creep not created")

    let unit = new Unit(creep)
    unit.setState(DefaultUnitStates.SPAWNING)

    let delay = (order.body.length * CREEP_SPAWN_TIME) + getTicks()
    for (let t = getTicks(); t < delay; t++) {
      token.throwIfCancellationRequested()
      yield
    }

    unit.setState(DefaultUnitStates.READY)
    return unit
  }

  public build(order: UnitProductionOrder, token: CancellationToken) {
    //var cts = new CancellationTokenSource()
    let generator = this.buildCreepSteps(order, token)
    token.register(() => {
      let e = new CancellationRequestedError()
      generator.throw(e)
    })
    this.queue.push(generator)
  }

  protected override onStart(): void {
    this.spawn = getObjectsByPrototype(StructureSpawn).find(_ => _.my)
  }

  protected override onUpdate(): void {
    super.onUpdate()

    if (this.current == undefined) {
      this.current = this.queue.shift()
    }
    if (this.current == undefined) {
      return
    }

    try {
      let result = this.current.next()
      if (result.done == false) {
        return
      }

      this.current = undefined

      let unit = result.value as Unit
      var evt = new UnitReadyEvent(unit)
      this.onCreateReady.dispatch(evt)
    } catch (e) {
      console.log("Error", e)
    }
  }
}
