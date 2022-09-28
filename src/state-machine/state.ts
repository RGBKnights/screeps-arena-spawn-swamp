import { ISignalHandler } from "dispatchers/subscription";
import { SignalDispatcher } from "dispatchers/signal-dispatcher";

export interface IState {
  name: string;
  onEnter: SignalDispatcher;
  onUpdate: SignalDispatcher;
  onExit: SignalDispatcher;
}

export class State implements IState {
  public name: string;
  public onEnter: SignalDispatcher;
  public onUpdate: SignalDispatcher;
  public onExit: SignalDispatcher;

  public constructor(
    name: string,
    before: ISignalHandler | undefined = undefined,
    durring: ISignalHandler | undefined = undefined,
    after: ISignalHandler | undefined = undefined
  ) {
    this.name = name;
    this.onEnter = new SignalDispatcher();
    if (before) this.onEnter.subscribe(before);
    this.onUpdate = new SignalDispatcher();
    if (durring) this.onEnter.subscribe(durring);
    this.onExit = new SignalDispatcher();
    if (after) this.onEnter.subscribe(after);
  }
}
