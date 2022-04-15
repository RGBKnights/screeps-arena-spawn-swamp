import {
  RESOURCE_ENERGY,
  OK, ERR_NOT_IN_RANGE, ERR_FULL, ERR_NOT_ENOUGH_RESOURCES
} from 'game/constants'
import { Creep } from 'game/prototypes'
import { getDirection, getRange } from 'game/utils'
import { PathStep } from 'game/path-finder'


export class Attacker {
  private creep: Creep
  private cxt: Context
  private path: Array<PathStep>
  private state: number

  constructor(cxt: Context, creep: Creep, path: Array<PathStep>) {
    this.cxt = cxt
    this.creep = creep
    this.path = path
    this.state = 0
  }

  public update(): void {
    if (this.state == 0) {
      // Find Start of Path
      const start = this.path.at(0) as PathStep
      var r = getRange(start, this.creep)
      if (r == 0) {
        this.state = 1
      } else {
        let result = this.creep.moveTo(start)
      }
    }

    if (this.state == 1) {
      // Move Along path till the End

      const end = this.path.at(-1) as PathStep
      var r = getRange(end, this.creep)
      if (r == 0) {
        this.state = 2
      } else {
        var creeps = this.creep.findInRange(this.cxt.theirCreeps(), 1)
        var target = creeps.at(0)
        if (target) {
          this.creep.attack(target)
        }

        const index = this.path.findIndex(p => p.x == this.creep.x && p.y == this.creep.y);
        const current = this.path.at(index) as PathStep
        const next = this.path.at(index + 1) as PathStep
        const direction = getDirection(next.x - current.x, next.y - current.y);
        let result = this.creep.move(direction);
      }
    }

    if (this.state == 2) {
      // Find a destory their spawn
      const target = this.cxt.theirSpawn
      let result = this.creep.attack(target)
      if (result == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target)
        // TODO: MAKE THIS CHEAPER...!
      }
    }
  }
}

export class Worker {
  private creep: Creep
  private cxt: Context
  private state: number

  constructor(cxt: Context, creep: Creep) {
    this.cxt = cxt
    this.creep = creep
    this.state = 1
  }

  public update(): void {
    if (this.state == 1) {
      for (const target of this.cxt.containers) {
        let result = this.creep.withdraw(target, RESOURCE_ENERGY)
        if (result == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
          break;
        } else if (result == ERR_FULL) {
          this.state = 2
          break;
        } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
          continue;
        } else if (result == -4) {
          console.log("spawning") // WTF..?
        }
      }
    } else if (this.state == 2) {
      const destinations = [this.cxt.mySpawn]
      for (const target of destinations) {
        let result = this.creep.transfer(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
        } else if (result == ERR_FULL) {
          // TODO: State = 3
        } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
          this.state = 1
        }
      }
    }
  }
}