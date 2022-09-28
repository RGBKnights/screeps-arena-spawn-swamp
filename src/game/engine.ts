import { getCpuTime, getHeapStatistics, getTicks } from "game/utils";
import { SignalDispatcher } from "dispatchers/signal-dispatcher";
import { arenaInfo } from "game";

class Engine {
  public ticks: number = 0;
  public onStart: SignalDispatcher;
  public onUpdate: SignalDispatcher;

  public constructor() {
    this.onStart = new SignalDispatcher(true);
    this.onUpdate = new SignalDispatcher(false);
  }

  public step(): void {
    this.ticks = getTicks();
    this.onStart.dispatch();
    this.onUpdate.dispatch();
    this.usageTime();
    this.usageMemory();
  }

  public isFirstTick(): boolean {
    return this.ticks === 1;
  }

  public cpuTimeLimit(): number {
    return this.isFirstTick()
      ? arenaInfo.cpuTimeLimitFirstTick
      : arenaInfo.cpuTimeLimit;
  }

  public usageTime(): number {
    let time = getCpuTime();
    let limit = this.cpuTimeLimit();
    console.log("Time Used:", `${time} / ${limit}`);
    return time / limit;
  }

  public usageMemory(): number {
    let heap = getHeapStatistics();
    let size = heap.total_heap_size;
    let limit = heap.heap_size_limit;
    console.log("Memory Used:", `${size} / ${limit}`);
    return size / limit;
  }
}

export const engine = new Engine();
