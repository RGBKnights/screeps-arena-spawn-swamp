import engine from 'common/engine'

export class Component {
  constructor() {
    engine.onStart(this.onStart)
    engine.onEachTick(this.onUpdate)
  }

  protected onStart() {

  }

  protected onUpdate() {

  }
}