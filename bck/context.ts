
//import {} from 'game/constants'
import {
  Creep,
  StructureContainer, StructureSpawn
} from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'

export interface TypedCreep extends Creep {
  type: string
}

export interface AttackerCreep extends TypedCreep {
  target: string
}

export interface WorkerCreep extends TypedCreep {
  source: string
  target: string
}

export class Context {

  public getMyContainers(): Array<StructureContainer> {
    var collection = getObjectsByPrototype(StructureContainer)
    return this.getMySpawn().findInRange(collection, 10);
  }

  public getMySpawn(): StructureSpawn {
    return getObjectsByPrototype(StructureSpawn).find(_ => _.my) as StructureSpawn
  }

  public getTheirSpawn(): StructureSpawn {
    return getObjectsByPrototype(StructureSpawn).find(_ => _.my) as StructureSpawn
  }

  public getMyCreeps<T extends TypedCreep>(): Array<T> {
    return getObjectsByPrototype(Creep).filter(c => c.my) as Array<T>
  }

  public getTheirCreeps(): Array<Creep> {
    return getObjectsByPrototype(Creep).filter(c => !c.my)
  }
}