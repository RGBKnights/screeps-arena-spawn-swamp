import { ERR_NOT_IN_RANGE } from 'game/constants';
import { Creep, Structure } from 'game/prototypes';
import { } from 'game/utils';
import { StateMachine } from "serivces/state-machine";
import { IUnit } from 'units/unit';
import { Context } from 'serivces/context';

export class Attacker implements IUnit {
  private ctx: Context
  private sm: StateMachine
  private creep: Creep | undefined
  private target: Creep | Structure | undefined

  constructor(ctx: Context, self: Creep) {
    this.ctx = ctx
    this.creep = self
    this.sm = new StateMachine(this)
    this.sm
      .addState('idle')
      .addState('attack', {
        onUpdate: this.onAttack
      })
    this.sm.setState('idle')
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
      this.creep.moveTo(this.target)
    }
  }
}
