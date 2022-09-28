import { ISignal, ISignalHandler } from "./subscription";
import { DispatcherBase } from "./dispatche-base";

export class SignalDispatcher
  extends DispatcherBase<ISignalHandler>
  implements ISignal
{
  public constructor(once: boolean = false) {
    super(once);
  }

  public dispatch(): void {
    this.execute(this, arguments);
  }

  public asEvent(): ISignal {
    return super.asEvent();
  }
}
