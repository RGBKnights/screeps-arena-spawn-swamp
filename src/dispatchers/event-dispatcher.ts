import { IEvent, IEventHandler } from "dispatchers/subscription";
import { DispatcherBase } from "dispatchers/dispatche-base";

export class EventDispatcher<TArgs>
  extends DispatcherBase<IEventHandler<TArgs>>
  implements IEvent<TArgs>
{
  public constructor(once: boolean = false) {
    super(once);
  }

  public dispatch(args: TArgs) {
    this.execute(this, arguments);
  }

  public asEvent(): IEvent<TArgs> {
    return super.asEvent();
  }
}
