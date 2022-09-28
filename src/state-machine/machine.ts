import { ISignalHandler } from "dispatchers/subscription";
import { State } from "./state";

export class StateMachine {
  private changeStateQueue = new Array<string>();
  private states = new Map<string, State>();
  private currentState?: State;
  private isChangingState = false;

  public addState(
    name: string,
    before: ISignalHandler | undefined = undefined,
    durring: ISignalHandler | undefined = undefined,
    after: ISignalHandler | undefined = undefined
  ) {
    let state = new State(name, before, durring, after);

    this.states.set(state.name, state);

    return this;
  }

  public isCurrentState(name: string) {
    if (!this.currentState) return false;

    return this.currentState.name === name;
  }

  public setState(name: string) {
    if (this.states.has(name) === false) {
      throw Error(`Tried to change to unknown state: ${name}`);
    }

    if (this.isCurrentState(name)) {
      return;
    }

    if (this.isChangingState) {
      this.changeStateQueue.push(name);
      return;
    }

    this.isChangingState = true;

    // console.log(`Change from ${this.currentState?.name ?? 'none'} to ${name}`)

    if (this.currentState) {
      this.currentState.onExit.dispatch();
    }

    this.currentState = this.states.get(name)!;

    this.currentState.onEnter.dispatch();

    this.isChangingState = false;
  }

  public update(): void {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!);
      return;
    }

    if (this.currentState) {
      this.currentState.onUpdate.dispatch();
    }
  }
}
