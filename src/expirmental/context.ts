// Game
import { getObjectsByPrototype, getCpuTime } from "game/utils"
import { Creep } from "game/prototypes"
import { arenaInfo } from "game"
// Infrastructure
import { SignalDispatcher } from "expirmental/dispatchers"
import { Owner } from "expirmental/ownership"
import { Point, pt } from "expirmental/point"
import { Zone, ZoneLocation } from "expirmental/zone"
import { Visual } from "game/visual"

class Arena {
  public readonly name: string
  public readonly level: number
  public readonly season: string
  public readonly size: number

  constructor() {
    this.size = 100
    this.name = arenaInfo.name
    this.level = arenaInfo.level
    this.season = arenaInfo.season
  }
}

class Context {
  private readonly generator: Generator<unknown, void, unknown>
  public readonly onStart: SignalDispatcher
  public readonly onEach: SignalDispatcher

  private cpuTimeLimit: number

  public arena: Arena
  public tick: number

  public zonesByLocation: Map<ZoneLocation, Zone>
  public zonesByOwner: Map<Owner, Array<Zone>>
  public creepsByPoint: Map<Point, Creep>
  public creepsByOwner: Map<Owner, Array<Creep>>

  constructor() {
    this.generator = this.steps()
    this.onStart = new SignalDispatcher()
    this.onStart.subscribe(() => this.start, true)
    this.onEach = new SignalDispatcher()
    this.onEach.subscribe(() => this.update)
    this.arena = new Arena()
    this.cpuTimeLimit = arenaInfo.cpuTimeLimitFirstTick
    this.tick = 1
    this.zonesByLocation = new Map<ZoneLocation, Zone>()
    this.zonesByOwner = new Map<Owner, Array<Zone>>()
    this.creepsByPoint = new Map<Point, Creep>()
    this.creepsByOwner = new Map<Owner, Array<Creep>>()
  }

  public getCpuUsage(): string {
    let usage = getCpuTime()
    return ((usage / this.cpuTimeLimit) * 100).toFixed(2)
  }

  private * steps(): Generator<unknown, void, unknown> {
    // Welcome Message
    console.log(`Welcome to ${this.arena.name} level ${this.arena.level} season ${this.arena.season}`)

    // Startup
    this.onStart.dispatch()
    this.onStart.clear()
    yield

    // Transiation: Startup => Tick
    this.cpuTimeLimit = arenaInfo.cpuTimeLimit

    // Each Tick
    for (; true; this.tick++) {
      this.onEach.dispatch()
      console.log("CPU Usage: %d", this.getCpuUsage())
      yield
    }
  }

  public next() {
    this.generator.next()
  }

  private start(): void {
    // TODO: Plan
    const leftBase = new Zone([pt(0, 32), pt(13, 32), pt(13, 58), pt(0, 58), pt(0, 32)])
    const rightBase = new Zone([pt(86, 41), pt(99, 41), pt(99, 67), pt(86, 67), pt(86, 41)])
    const topLane = new Zone([pt(0, 31), pt(0, 0), pt(99, 0), pt(99, 40), pt(86, 40), pt(86, 12), pt(13, 12), pt(13, 31), pt(0, 31)])
    const bottomLane = new Zone([pt(86, 68), pt(86, 87), pt(13, 86), pt(13, 59), pt(0, 59), pt(0, 99), pt(99, 99), pt(99, 68), pt(86, 68)])
    const jungle = new Zone([pt(14, 13), pt(85, 13), pt(85, 86), pt(14, 85), pt(14, 13)])

    this.zonesByLocation.set(ZoneLocation.LeftBase, leftBase)
    this.zonesByLocation.set(ZoneLocation.RightBase, rightBase)
    this.zonesByLocation.set(ZoneLocation.TopLane, topLane)
    this.zonesByLocation.set(ZoneLocation.BottomLane, bottomLane)
    this.zonesByLocation.set(ZoneLocation.Jungle, jungle)

    // TODO: Setup ownership based on where spawns are
    this.zonesByOwner.set(Owner.Friendly, [leftBase])
    this.zonesByOwner.set(Owner.Hostel, [rightBase])
    this.zonesByOwner.set(Owner.Netrual, [topLane, bottomLane, jungle])

    // TODO: Drawing
    var layer = new Visual(1, true)

    for (const item of this.zonesByLocation) {
      const zone = item[1]
      zone.draw(layer)
    }


  }

  private update(): void {
    this.creepsByPoint.clear()
    this.creepsByOwner.clear()
    this.creepsByOwner.set(Owner.Friendly, [])
    this.creepsByOwner.set(Owner.Hostel, [])
    this.creepsByOwner.set(Owner.Netrual, [])
    this.zonesByOwner.clear()
    this.zonesByOwner.set(Owner.Friendly, [])
    this.zonesByOwner.set(Owner.Hostel, [])
    this.zonesByOwner.set(Owner.Netrual, [])

    var creeps = getObjectsByPrototype(Creep)

    for (let creep of creeps) {
      this.creepsByPoint.set(creep as Point, creep)
      // TODO: if no attack body then Owner.Netrual
      let owner = creep.my ? Owner.Friendly : Owner.Hostel
      this.creepsByOwner.get(owner)?.push(creep)
    }

    for (const item of this.zonesByLocation) {
      const zone = item[1]
      // TODO: Weighting Forumla
      let weight = creeps.filter(c => zone.inside(c)).reduce((p, c) => p += c.my ? 1 : -1, 0)
      let owner = weight > 0 ? Owner.Friendly : weight < 0 ? Owner.Hostel : Owner.Netrual
      this.zonesByOwner.get(owner)?.push(zone)
    }

  }
}

const ctx = new Context()
export default ctx