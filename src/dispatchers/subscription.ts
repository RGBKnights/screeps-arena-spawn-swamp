export interface ISignalHandler {
  (): void;
}
export interface IEventHandler<TArgs> {
  (args: TArgs): void;
}

export type IUnsubscribe = () => void;
export type ISignal = ISubscribable<ISignalHandler>;
export type IEvent<TArgs> = ISubscribable<IEventHandler<TArgs>>;

export interface ISubscribable<TEventHandler> {
  readonly count: number;

  subscribe(fn: TEventHandler, onetime: boolean): () => void;
  unsubscribe(fn: TEventHandler): void;
  has(fn: TEventHandler): boolean;
  clear(): void;
}

export interface ISubscription<TEventHandler> {
  readonly handler: TEventHandler;
}

export class Subscription<TEventHandler>
  implements ISubscription<TEventHandler>
{
  private readonly once;
  private isExecuted;

  public constructor(public handler: TEventHandler, once: boolean) {
    this.once = once;
    this.isExecuted = false;
  }

  public execute(scope: any, args: IArguments): void {
    if (this.once && this.isExecuted) return;

    this.isExecuted = true;
    const fn: any = this.handler;
    fn.apply(scope, args);
  }
}
