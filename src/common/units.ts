import { IUnsubscribe } from 'common/dispatchers'
import { ConstructionSite, Creep, Id, Resource, RoomObjectJSON, RoomPosition, Source, Store, Structure, StructureConstant } from 'game/prototypes'
import { StateMachine } from 'common/state-machine'
import { ScoreCollector } from 'arena'
import { BodyPartConstant, ResourceConstant, DirectionConstant, CreepMoveReturnCode, CreepActionReturnCode, ScreepsReturnCode, BuildableStructure } from 'game/constants'
import { MoveToOpts, FindPathOpts, PathStep } from 'game/path-finder'
import engine from 'common/engine'

// function getCost(cost: CostMatrix, path: Array<PathStep>, opts: CostOpts): void {
//   const defaults = { range: 3, value: 255 }
//   const options = { ...opts, defaults }

//   for (const l of path) {
//     for (let x = (l.x - options.range); x < (l.x + options.range); x++) {
//       for (let y = (l.y - options.range); y < (l.y + options.range); y++) {
//         cost.set(x, y, options.value)
//       }
//     }
//   }
// }

export enum DefaultUnitRoles {
  UNKNOWN = 0,
  WORKER = 1,
  BUILDER = 2,
  RUSHER = 3,
  ATTACKER = 4,
  HEALER = 5,
}

export class DefaultUnitStates {
  public static NONE = "None"
  public static SPAWNING = "Spawning"
  public static READY = "Ready"
  public static DEAD = "Dead"
}

export class Unit {
  private readonly cancelUpdate: IUnsubscribe
  protected readonly brain: StateMachine

  public readonly creep: Creep

  constructor(creep: Creep) {
    this.creep = creep // OR tower?
    this.brain = new StateMachine()
      .addState(DefaultUnitStates.NONE)
      .addState(DefaultUnitStates.SPAWNING, undefined, this.onSpawning, this.afterSpawned)
      .addState(DefaultUnitStates.READY)
      .addState(DefaultUnitStates.DEAD, this.onDeath)

    this.cancelUpdate = engine.onEachTick(this.onUpdate)
  }

  public setState(state: string) {
    this.brain.setState(state)
  }

  protected onUpdate() {
    if (this.creep.exists == false) {
      this.setState(DefaultUnitStates.DEAD)
    }
  }

  protected onSpawning() {
    // Still being Constructed
  }

  protected afterSpawned() {
    // Ready for Actions
  }

  protected onDeath() {
    this.cancelUpdate()
  }
}