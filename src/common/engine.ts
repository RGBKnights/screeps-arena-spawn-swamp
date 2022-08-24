
import { arenaInfo, getCpuTime, getTicks } from 'game'
import { IUnsubscribe, SignalDispatcher, ISignalHandler, EventDispatcher, IEventHandler } from 'common/dispatchers'

class Engine {
  private readonly _onStart: SignalDispatcher
  private readonly _onNext: SignalDispatcher
  private readonly _onEach: SignalDispatcher

  constructor() {
    this._onStart = new SignalDispatcher()
    this._onNext = new SignalDispatcher()
    this._onEach = new SignalDispatcher()
  }

  private getCpuUsage() {
    let usage = getCpuTime()
    let limit = getTicks() == 1 ? arenaInfo.cpuTimeLimitFirstTick : arenaInfo.cpuTimeLimit
    return ((usage / limit) * 100).toFixed(2)
  }

  public update() {
    try {
      this._onNext.dispatch()
      this._onNext.clear()
      this._onStart.dispatch()
      this._onEach.dispatch()

      console.log("CPU Usage: %d", this.getCpuUsage())
    } catch (e) {
      console.log("Error", e)
    }
  }

  public onNextTick(handler: ISignalHandler): IUnsubscribe {
    return this._onNext.subscribe(handler, true);
  }

  public onEachTick(handler: ISignalHandler): IUnsubscribe {
    return this._onEach.subscribe(handler, false);
  }

  public onStart(handler: ISignalHandler): IUnsubscribe {
    return this._onStart.subscribe(handler, true);
  }

}

const engine = new Engine()
export default engine