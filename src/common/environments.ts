import { RoomPosition, StructureContainer, StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { LabelCoordinates, LabelPosition, Zone } from "common/zone"
import { MethodNotImplementedError } from "common/errors"
import { Visual } from "game/visual"

// const palette = [
//   '#2489D9', '#A4EA34', '#D9AD24', '#D924C3', '#24D9A8', '#8924D9', '#1BBD40',
// ]

function pt(x: number, y: number): RoomPosition {
  return { x, y } as RoomPosition
}

export abstract class Environment {

  public readonly store: Array<any>
  public readonly zones: Array<Zone>
  public readonly name: string
  public readonly level: number

  constructor(name: string, level: number, zones: Array<Zone>) {
    this.name = name
    this.level = level
    this.zones = zones
    this.store = new Array<any>()
  }

  public draw(): void {
    const layer = new Visual(1, true)
    for (const zone of this.zones) {
      zone.draw(layer)
    }
  }

  public findZoneByPosition(position: RoomPosition): Zone | undefined {
    return this.zones.find(_ => _.boundry?.inside(position))
  }

  public findZoneByName(name: string): Zone | undefined {
    return this.zones.find(_ => _.name?.what == name)
  }

  abstract thierBase(): Zone
  abstract myBase(): Zone
  abstract getContainers(zone: Zone): StructureContainer[]
}

export class CTFBasic extends Environment {

  constructor() {
    let zones = new Array<Zone>()
    // TODO: Triables based on the river in the middle with 2 bases in corners
    super("Capture The Flag", 1, zones)
  }

  thierBase(): Zone {
    throw new MethodNotImplementedError()
  }

  myBase(): Zone {
    throw new MethodNotImplementedError()
  }

  getContainers(): StructureContainer[] {
    throw new MethodNotImplementedError()
  }
}

export class CTFAdv extends Environment {
  constructor() {
    let zones = new Array<Zone>()
    // TODO: ¯\_(ツ)_/¯
    super("Capture The Flag", 2, zones)
  }

  thierBase(): Zone {
    throw new MethodNotImplementedError()
  }

  myBase(): Zone {
    throw new MethodNotImplementedError()
  }

  getContainers(): StructureContainer[] {
    throw new MethodNotImplementedError()
  }
}

export class SSBasic extends Environment {
  constructor() {

    let left_base = new Zone(
      new LabelPosition("Left Base", pt(0, 0)),
      [
        pt(0, 32), pt(13, 32), pt(13, 58), pt(0, 58), pt(0, 32)
      ],
      [
        new LabelCoordinates("Alpha", 0, 0),
        new LabelCoordinates("Beta", 0, 0),
        new LabelCoordinates("Grama", 0, 0)
      ]
    )

    // Runtime
    // left_base.pois = []
    // left_base.waypoints = []

    // let zones = new Array<Zone>()
    // zones.push(zone(
    //   "Left Base",
    //   point(0, 32),
    //   point(13, 32),
    //   point(13, 58),
    //   point(0, 58),
    //   point(0, 32),
    // ))

    // zones.push(zone(
    //   "Right Base",
    //   point(86, 41),
    //   point(99, 41),
    //   point(99, 67),
    //   point(86, 67),
    //   point(86, 41),
    // ))

    // zones.push(zone(
    //   "Top Lane",
    //   point(0, 31),
    //   point(0, 0),
    //   point(99, 0),
    //   point(99, 40),
    //   point(86, 40),
    //   point(86, 12),
    //   point(13, 12),
    //   point(13, 31),
    //   point(0, 31),
    // ))

    // zones.push(zone(
    //   "Bottom Lane",
    //   point(86, 68),
    //   point(86, 87),
    //   point(13, 86),
    //   point(13, 59),
    //   point(0, 59),
    //   point(0, 99),
    //   point(99, 99),
    //   point(99, 68),
    //   point(86, 68),
    // ))

    // zones.push(zone(
    //   "Jungle",
    //   point(14, 13),
    //   point(85, 13),
    //   point(85, 86),
    //   point(14, 85),
    //   point(14, 13),
    // ))

    super("Spawn and Swamp", 1, [])
  }

  thierBase(): Zone {
    const spawn = getObjectsByPrototype(StructureSpawn).find(_ => !_.my)
    if (!spawn)
      throw new Error("Opponent Spawn Not Found.")

    const zone = this.findZoneByPosition(spawn)
    if (!zone)
      throw new Error("No Zone Where the Enemy Spawn is Located.")

    return zone
  }

  myBase(): Zone {
    const spawn = getObjectsByPrototype(StructureSpawn).find(_ => _.my)
    if (!spawn)
      throw new Error("My Spawn Not Found.")

    const zone = this.findZoneByPosition(spawn)
    if (!zone)
      throw new Error("No Zone Where My Spawn is Located.")

    return zone
  }

  getContainers(zone: Zone): StructureContainer[] {
    const containers = getObjectsByPrototype(StructureContainer)
    return containers.filter(_ => zone.boundry.inside(_)).filter(_ => _.store.energy > 0)
  }
}

export class SSADv extends Environment {
  constructor() {
    let zones = new Array<Zone>()
    // TODO: ¯\_(ツ)_/¯
    super("Spawn and Swamp", 2, zones)
  }

  thierBase(): Zone {
    throw new MethodNotImplementedError()
  }

  myBase(): Zone {
    throw new MethodNotImplementedError()
  }

  getContainers(): StructureContainer[] {
    throw new MethodNotImplementedError()
  }
}

export class CCBasic extends Environment {
  constructor() {
    let zones = new Array<Zone>()
    // TODO: ¯\_(ツ)_/¯
    super("Collect And Control", 1, zones)
  }

  thierBase(): Zone {
    throw new MethodNotImplementedError()
  }

  myBase(): Zone {
    throw new MethodNotImplementedError()
  }

  getContainers(): StructureContainer[] {
    throw new MethodNotImplementedError()
  }
}

export class CCAdv extends Environment {
  constructor() {
    let zones = new Array<Zone>()
    // TODO: ¯\_(ツ)_/¯
    super("Collect And Control", 2, zones)
  }

  thierBase(): Zone {
    throw new MethodNotImplementedError()
  }

  myBase(): Zone {
    throw new MethodNotImplementedError()
  }

  getContainers(): StructureContainer[] {
    throw new MethodNotImplementedError()
  }
}

const environments: Array<Environment> = [
  new CTFBasic(), new CTFAdv(),
  new SSBasic(), new SSADv(),
  new CCBasic(), new CCAdv()
]

export { environments }