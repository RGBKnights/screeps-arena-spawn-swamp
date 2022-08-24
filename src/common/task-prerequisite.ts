import { CARRY, MOVE, RESOURCE_ENERGY, WORK } from "game/constants"
//import { OK, ERR_INVALID_TARGET, ERR_NOT_OWNER, ERR_NO_BODYPART, ERR_NO_PATH } from "game/constants"
//import { RESOURCE_ENERGY } from "game/constants"
import { RoomPosition } from "game/prototypes"
import { TaskAction, TaskPrerequisite } from "expirmental/tasks"
import { MoveToZoneAction, WithdrawEnergyAction } from "common/task-actions"
import { Unit } from "common/units"
import { Zone } from "common/zone"
import ctx from "common/context"

export class UnitCanWork extends TaskPrerequisite {
  public override meets(unit: Unit): boolean {
    return unit.creep.body.some(b => b.type == WORK)
  }
}

export class UnitCanCarry extends TaskPrerequisite {
  public override meets(unit: Unit): boolean {
    return unit.creep.body.some(b => b.type == CARRY)
  }
}

export class UnitNotFull extends TaskPrerequisite {
  public override meets(unit: Unit): boolean {
    let capacity = unit.creep.store.getFreeCapacity() ?? 0
    return capacity > 0
  }
}

export class UnitCanMove extends TaskPrerequisite {
  public override  meets(unit: Unit): boolean {
    return unit.creep.body.some(b => b.type == MOVE)
  }
}

export class HasMoreEnergy extends TaskPrerequisite {
  public readonly amount: number

  constructor(amount: number = 0) {
    super()
    this.amount = amount
  }

  public override meets(unit: Unit): boolean {
    return unit.creep.store.energy > this.amount
  }
  public override toMeet(unit: Unit): TaskAction[] {
    return (unit.creep.body.some(_ => _.type == CARRY)) ? ctx.getContainers(ctx.myBase()).map(s => new WithdrawEnergyAction(s)) : []
  }
}

export class UnitIsNear extends TaskPrerequisite {
  public target: RoomPosition
  public range: number

  constructor(target: RoomPosition, range: number) {
    super()
    this.target = target
    this.range = range
  }

  public override meets(unit: Unit): boolean {
    return unit.creep.getRangeTo(this.target) <= this.range
  }
  public cost(unit: Unit): number {
    return unit.creep.getRangeTo(this.target)
  }
}

export class UnitInZone extends TaskPrerequisite {
  public zone: Zone

  constructor(zone: Zone) {
    super()
    this.zone = zone
  }

  public override meets(unit: Unit): boolean {
    return this.zone.inside(unit.creep)
  }

  public override toMeet(unit: Unit): TaskAction[] {
    return [
      new MoveToZoneAction(this.zone)
    ]
  }
}