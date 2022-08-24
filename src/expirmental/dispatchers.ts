export interface ISignalHandler {
  (): void
}
export interface IEventHandler<TArgs> {
  (args: TArgs): void
}

export type IUnsubscribe = () => void
export type ISignal = ISubscribable<ISignalHandler>
export type IEvent<TArgs> = ISubscribable<IEventHandler<TArgs>>

export interface ISubscribable<TEventHandler> {
  readonly count: number

  subscribe(fn: TEventHandler, onetime: boolean): () => void
  unsubscribe(fn: TEventHandler): void
  has(fn: TEventHandler): boolean
  clear(): void
}

export interface ISubscription<TEventHandler> {
  readonly handler: TEventHandler;
}

export class Subscription<TEventHandler> implements ISubscription<TEventHandler> {
  private readonly onetime
  private isExecuted

  public constructor(public handler: TEventHandler, onetime: boolean) {
    this.onetime = onetime
    this.isExecuted = false
  }

  public execute(scope: any, args: IArguments): void {
    if (this.onetime && this.isExecuted)
      return

    this.isExecuted = true
    const fn: any = this.handler
    fn.apply(scope, args)
  }
}

abstract class DispatcherBase<TEventHandler> implements ISubscribable<TEventHandler> {
  protected _subscriptions = new Array<ISubscription<TEventHandler>>();

  public get count(): number {
    return this._subscriptions.length
  }

  public subscribe(fn: TEventHandler, onetime: boolean = false): IUnsubscribe {
    let sub = this.createSubscription(fn, onetime)
    this._subscriptions.push(sub)

    return () => { this.unsubscribe(fn) }
  }

  public unsubscribe(fn: TEventHandler): void {
    for (let i = 0; i < this._subscriptions.length; i++) {
      if (this._subscriptions[i].handler === fn) {
        this._subscriptions.splice(i, 1)
        break
      }
    }
  }

  public has(fn: TEventHandler): boolean {
    return this._subscriptions.some(sub => sub.handler === fn);
  }

  protected _dispatch(scope: any, args: IArguments): void {
    for (const sub of this._subscriptions) {
      const s = sub as Subscription<TEventHandler>
      s.execute(scope, args)
    }
  }

  protected createSubscription(handler: TEventHandler, onetime: boolean): ISubscription<TEventHandler> {
    return new Subscription<TEventHandler>(handler, onetime);
  }

  public asEvent(): ISubscribable<TEventHandler> {
    return this;
  }

  public clear(): void {
    if (this._subscriptions.length !== 0) {
      this._subscriptions.splice(0, this._subscriptions.length)
    }
  }
}

export class SignalDispatcher extends DispatcherBase<ISignalHandler> implements ISignal {
  public dispatch(): void {
    this._dispatch(this, arguments)
  }

  public asEvent(): ISignal {
    return super.asEvent()
  }
}

export class EventDispatcher<TArgs> extends DispatcherBase<IEventHandler<TArgs>> implements IEvent<TArgs> {
  public constructor() {
    super();
  }

  public dispatch(args: TArgs) {
    this._dispatch(this, arguments)
  }

  public asEvent(): IEvent<TArgs> {
    return super.asEvent()
  }
}