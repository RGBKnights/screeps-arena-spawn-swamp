import { getTicks } from 'game/utils';

export class Engine {
  setup(): void {
    // 
  }
  update(): void {
    // 
  }

  loop(): void {
    const ticks = getTicks()
    if (ticks == 1) {
      this.setup()
    } else {
      this.update()
    }
  }
}