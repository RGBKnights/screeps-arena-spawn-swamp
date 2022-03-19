import {
  RESOURCE_ENERGY, ResourceConstant,
  ERR_NOT_IN_RANGE, ERR_FULL, ERR_NOT_ENOUGH_RESOURCES,
} from 'game/constants';
import { Creep, Structure } from 'game/prototypes';
import { } from 'game/utils';
import { StateMachine } from "serivces/state-machine";
import { IUnit } from 'units/unit';
import { Context } from 'serivces/context';

export class Worker implements IUnit {
  private ctx: Context
  private sm: StateMachine
  private creep: Creep | undefined
  sources: Array<Structure>
  destinations: Array<Structure>
  resource: ResourceConstant | undefined

  constructor(ctx: Context, self: Creep) {
    this.ctx = ctx
    this.creep = self
    this.sources = new Array<Structure>()
    this.destinations = new Array<Structure>()

    this.sm = new StateMachine(this)
    this.sm
      .addState('idle')
      .addState('gather', {
        onUpdate: this.onGather
      })
      .addState('delivery', {
        onUpdate: this.onDelivery
      })
    this.sm.setState('idle')
  }

  public update() {
    this.sm.update()
  }

  public gather(sources: Array<Structure>, destinations: Array<Structure>, resource: ResourceConstant) {
    this.sources = sources
    this.destinations = destinations
    this.resource = resource

    this.sm.setState('gather')
  }

  private onGather() {
    if (this.creep == undefined)
      return

    if (this.resource == undefined)
      return

    for (const target of this.sources) {
      let result = this.creep.withdraw(target, this.resource)
      if (result == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
        break;
      } else if (result == ERR_FULL) {
        this.sm.setState('delivery')
        break;
      } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
        continue;
      }
    }
  }

  private onDelivery() {
    if (this.creep == undefined)
      return

    for (const target of this.destinations) {
      let result = this.creep.transfer(target, RESOURCE_ENERGY);
      if (result == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
      } else if (result == ERR_FULL) {
        this.sm.setState('idle')
      } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
        this.sm.setState('gather')
      }
    }
  }
}