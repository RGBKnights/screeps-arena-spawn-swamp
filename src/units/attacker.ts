import { ERR_NOT_IN_RANGE } from 'game/constants';
import { Creep, Structure } from 'game/prototypes';
import { } from 'game/utils';
import { StateMachine } from "serivces/state-machine";
import { IUnit } from 'units/unit';
import { Context } from 'serivces/context';

export class Attacker implements IUnit {
  private ctx: Context
  private sm: StateMachine
  private target: Creep | Structure | undefined

  public creep: Creep

  constructor(ctx: Context, creep: Creep) {
    this.ctx = ctx
    this.creep = creep
    this.sm = new StateMachine(this)
    this.sm
      .addState('idle')
      .addState('attack', {
        onUpdate: this.onAttack
      })
    this.sm.setState('idle')

    // new state for:
    // - Assembly
  }

  public update() {
    this.sm.update()
  }

  public attack(target: Creep | Structure | undefined) {
    this.target = target
    this.sm.setState('attack')
  }

  private onAttack() {
    if (this.creep == undefined)
      return

    if (this.target == undefined)
      return

    let result = this.creep.attack(this.target)
    if (result == ERR_NOT_IN_RANGE) {
      let targets = this.creep.findInRange(this.ctx.theirUnits, 1).sort((lhs, rhs) => lhs.hits - rhs.hits)
      for (const target of targets) {
        this.creep.attack(target)
      }
      this.creep.moveTo(this.target)
    }
  }
}
