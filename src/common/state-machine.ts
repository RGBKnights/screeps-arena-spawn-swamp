import { Component } from "common/component"
import { ISignal, ISignalHandler, SignalDispatcher } from "common/dispatchers"

interface IState {
  name: string
  onEnter: SignalDispatcher
  onUpdate: SignalDispatcher
  onExit: SignalDispatcher
}

class State implements IState {
  name: string
  onEnter: SignalDispatcher
  onUpdate: SignalDispatcher
  onExit: SignalDispatcher

  constructor(name: string, before: ISignalHandler | undefined = undefined, durring: ISignalHandler | undefined = undefined, after: ISignalHandler | undefined = undefined) {
    this.name = name
    this.onEnter = new SignalDispatcher()
    if (before) this.onEnter.subscribe(before, true)
    this.onUpdate = new SignalDispatcher()
    if (durring) this.onEnter.subscribe(durring, false)
    this.onExit = new SignalDispatcher()
    if (after) this.onEnter.subscribe(after, true)
  }
}

export class StateMachine extends Component {
  private changeStateQueue = new Array<string>()
  private states = new Map<string, State>()
  private currentState?: State
  private isChangingState = false

  constructor() {
    super()
  }

  addState(name: string, before: ISignalHandler | undefined = undefined, durring: ISignalHandler | undefined = undefined, after: ISignalHandler | undefined = undefined) {

    var state = new State(name, before, durring, after)

    this.states.set(state.name, state)

    return this
  }

  isCurrentState(name: string) {
    if (!this.currentState)
      return false

    return this.currentState.name === name
  }

  setState(name: string) {
    if (this.states.has(name) == false) {
      throw Error(`Tried to change to unknown state: ${name}`)
    }

    if (this.isCurrentState(name)) {
      return
    }

    if (this.isChangingState) {
      this.changeStateQueue.push(name)
      return
    }

    this.isChangingState = true

    //console.log(`Change from ${this.currentState?.name ?? 'none'} to ${name}`)

    if (this.currentState) {
      this.currentState.onExit.dispatch()
    }

    this.currentState = this.states.get(name)!

    this.currentState.onEnter.dispatch()

    this.isChangingState = false
  }

  protected override onUpdate(): void {
    super.onUpdate()

    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!)
      return
    }

    if (this.currentState) {
      this.currentState.onUpdate.dispatch()
    }
  }
}