import { arenaInfo, getTicks } from 'game'
import { RoomPosition, StructureContainer } from 'game/prototypes'
import { environments, Environment } from 'common/environments'
import { InvaildEnvironmentError } from 'common/errors'
import { Zone } from 'common/zone'
import engine from 'common/engine'

export class Context {
  private readonly enviroment: Environment

  constructor() {
    let env = environments.find(_ => _.name == arenaInfo.name && _.level == arenaInfo.level)
    if (env == undefined)
      throw new InvaildEnvironmentError()

    this.enviroment = env
  }

  public getZones(): Array<Zone> {
    return this.enviroment.zones
  }

  public myBase(): Zone {
    return this.enviroment.myBase()
  }

  public thierBase(): Zone {
    return this.enviroment.thierBase()
  }

  public getContainers(zone: Zone): Array<StructureContainer> {
    return this.enviroment.getContainers(zone)
  }

  public findZoneByPosition(pos: RoomPosition) {
    return this.enviroment.findZoneByPosition(pos)
  }

  public findZoneByName(name: string) {
    return this.enviroment.findZoneByName(name)
  }
}

const ctx = new Context()
export default ctx