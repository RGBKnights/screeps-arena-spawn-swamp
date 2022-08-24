import { getTicks } from 'game/utils'
import { SignalDispatcher, ISignalHandler, IUnsubscribe } from 'common/dispatchers'
import { CancellationRequestedError } from 'common/errors'
import engine from 'common/engine'

export class CancellationToken {
  private readonly source: CancellationTokenSource

  constructor(source: CancellationTokenSource) {
    this.source = source
  }

  public isCancellationRequested(): boolean {
    return this.source?.isCancellationRequested()
  }

  public throwIfCancellationRequested(): void {
    if (this.source?.isCancellationRequested()) {
      throw new CancellationRequestedError()
    }
  }

  public register(handler: ISignalHandler): IUnsubscribe {
    return this.source?.register(handler)
  }
}

export class CancellationTokenSource {
  protected cancellationRequested: boolean
  protected dispatcher: SignalDispatcher

  constructor() {
    this.cancellationRequested = false
    this.dispatcher = new SignalDispatcher()
  }

  public register(handler: ISignalHandler): IUnsubscribe {
    return this.dispatcher.subscribe(handler, true)
  }

  public getToken(): CancellationToken {
    return new CancellationToken(this)
  }

  public cancel(): void {
    if (this.cancellationRequested == true)
      return

    this.cancellationRequested = true
    this.dispatcher.dispatch()
  }

  public isCancellationRequested(): boolean {
    return this.cancellationRequested
  }
}

export class CancelAtTickSource extends CancellationTokenSource {
  private readonly tick: number

  constructor(tick: number) {
    super()

    this.tick = tick

    engine.onEachTick(this.update)
  }

  private update() {
    if (getTicks() > this.tick)
      this.cancel()
  }
}

export class CancelInTicksSource extends CancelAtTickSource {
  constructor(delay: number) {
    super(delay + getTicks())
  }
}