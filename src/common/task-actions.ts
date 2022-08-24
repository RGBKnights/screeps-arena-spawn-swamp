// import { CARRY, MOVE, WORK } from "game/constants"
import { OK, ResourceConstant } from "game/constants"
import { RESOURCE_ENERGY, CONSTRUCTION_COST } from "game/constants"
import { ConstructionSite, RoomPosition, StructureContainer, StructureExtension } from "game/prototypes"
import { Unit } from "common/units"
import { Zone } from "common/zone"
import ctx from "common/context"

import { TaskAction } from "expirmental/tasks"
import { UnitCanWork, HasMoreEnergy, UnitIsNear, UnitCanMove, UnitCanCarry, UnitInZone } from "expirmental/task-prerequisite"

const STRUCTURE_COST = new Map<string, number>(Object.entries(CONSTRUCTION_COST))

export class BuildAction extends TaskAction {
  public site: ConstructionSite

  constructor(site: ConstructionSite) {
    const zone = ctx.findZoneByPosition(site) as Zone
    const cost = STRUCTURE_COST.get(site.structure.constructor.name)

    super([
      new UnitCanWork(),
      new HasMoreEnergy(cost),
      new UnitInZone(zone)
    ])

    this.site = site
  }

  protected override * steps(unit: Unit): Generator<void, boolean, unknown> {
    if (unit.creep.build(this.site) == OK) {
      return true // Task is complete
    } else {
      return false // Unable to build, end task
    }
  }
}

export class MoveAction extends TaskAction {
  public destination: RoomPosition

  constructor(destination: RoomPosition) {
    super([
      new UnitCanMove(),
    ])
    this.destination = destination
  }

  protected override * steps(unit: Unit): Generator<void, boolean, unknown> {
    while (unit.creep.getRangeTo(this.destination) > 0) {
      unit.creep.moveTo(this.destination)
      yield
    }
    return true
  }

  public cost(unit: Unit): number {
    return unit.creep.getRangeTo(this.destination)
  }
}

class WithdrawAction extends TaskAction {
  public source: StructureContainer
  public resource: ResourceConstant

  constructor(source: StructureContainer, resource: ResourceConstant) {
    super([
      new UnitCanCarry(),
    ])

    this.resource = resource
    this.source = source
  }

  public override action(unit: Unit): boolean {
    let result = unit.creep.withdraw(this.source, this.resource)
    if (result == OK) {
      return true
    } else {
      return false
    }
  }
}

export class WithdrawEnergyAction extends WithdrawAction {
  constructor(source: StructureContainer) {
    super(source, RESOURCE_ENERGY)
  }
}


export class MoveToZoneAction extends TaskAction {
  public destination: Zone

  constructor(destination: Zone) {
    super([
      new UnitCanMove(),
    ])
    this.destination = destination
  }

  protected override * steps(unit: Unit): Generator<void, boolean, unknown> {
    while (unit.creep.getRangeTo(this.destination.centroid()) > 3) {
      unit.creep.moveTo(this.destination.centroid())
    }
    return true
  }

  public cost(unit: Unit): number {
    // as Crow Flys... try Pathfinding instead
    return unit.creep.getRangeTo(this.destination.centroid())
  }
}
