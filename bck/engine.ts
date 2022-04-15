export class Engine {
  private generator: Generator<never, void, unknown>

  constructor() {
    this.generator = this.setup()
  }

  public *setup(): Generator<never, void, unknown> {
    // abstract
  }

  public update(): void {
    // abstract
  }

  loop(): void {
    if (!this.generator.next()?.done)
      return

    this.update()
  }

}