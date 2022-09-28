import {
  ISubscribable,
  ISubscription,
  IUnsubscribe,
  Subscription,
} from "dispatchers/subscription";

export abstract class DispatcherBase<TEventHandler>
  implements ISubscribable<TEventHandler>
{
  private once: boolean;
  protected subscriptions = new Array<ISubscription<TEventHandler>>();

  public constructor(once: boolean) {
    this.once = once;
  }

  public get count(): number {
    return this.subscriptions.length;
  }

  public subscribe(fn: TEventHandler): IUnsubscribe {
    let sub = this.createSubscription(fn);
    this.subscriptions.push(sub);

    return () => {
      this.unsubscribe(fn);
    };
  }

  public unsubscribe(fn: TEventHandler): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      if (this.subscriptions[i].handler === fn) {
        this.subscriptions.splice(i, 1);
        break;
      }
    }
  }

  public has(fn: TEventHandler): boolean {
    return this.subscriptions.some((sub) => sub.handler === fn);
  }

  protected execute(scope: any, args: IArguments): void {
    for (const sub of this.subscriptions) {
      const s = sub as Subscription<TEventHandler>;
      s.execute(scope, args);
    }
  }

  protected createSubscription(
    handler: TEventHandler
  ): ISubscription<TEventHandler> {
    return new Subscription<TEventHandler>(handler, this.once);
  }

  public asEvent(): ISubscribable<TEventHandler> {
    return this;
  }

  public clear(): void {
    if (this.subscriptions.length !== 0) {
      this.subscriptions.splice(0, this.subscriptions.length);
    }
  }
}
