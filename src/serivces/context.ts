import { arenaInfo } from 'game';
import {} from 'game/constants';
import { StructureSpawn } from 'game/prototypes';
import { getObjectsByPrototype, getCpuTime, getTicks } from 'game/utils';
import { Spawn } from 'base/spawn';
import { IUnit } from 'units/unit';

export class Context {
  ticks: number

  myUnits: Array<IUnit> = new Array<IUnit>();
  mySpawns: Array<Spawn> = new Array<Spawn>();
  theirSpawns: Array<StructureSpawn> = new Array<StructureSpawn>();

  constructor() {
    this.ticks = 0
  }

  public update() : void {
    this.ticks = getTicks()

    if(this.ticks == 1) {
      this.setupEntities()
    }

    this.updateEntities()

    this.timestamp("Context:Update")
  }

  setupEntities() {
    this.mySpawns = getObjectsByPrototype(StructureSpawn).filter(i => i.my).map(s => new Spawn(this, s));
    this.theirSpawns = getObjectsByPrototype(StructureSpawn).filter(i => !i.my);
  }

  updateEntities() {
    for (const base of this.mySpawns) {
        base.update()
    }
    for (const unit of this.myUnits) {
        unit.update()
    }
  }

  timestamp(title: string): void {
    // nanoseconds
    var limit = this.getCpuLimit()
    var time = this.getCpuTime()
    var delta = (time / limit) * 100
    var useage = delta.toFixed(2)
    console.log(title, `${useage}% [CPU Usage]`)
  }

  public getCpuLimit(): number {
    return (this.ticks == 1) ? arenaInfo.cpuTimeLimitFirstTick : arenaInfo.cpuTimeLimit
  }

  public getCpuTime(): number {
    return getCpuTime()
  }

  public getTickLimit(): number {
    return arenaInfo.ticksLimit;
  }
}