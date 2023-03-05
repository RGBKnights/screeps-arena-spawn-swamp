export class Context {
  private static counter = 0;
  private generators: Map<number, Generator<void, void, void>>;
  public constructor() {
    this.generators = new Map<number, Generator<void, void, void>>();
  }
  public add(g: Generator<void, void, void>): void {
    this.generators.set(Context.counter++, g);
  }

  public update(): void {
    for (const [key, generator] of this.generators) {
      try {
        const result = generator.next();
        if (result.done === true) this.generators.delete(key);
      } catch (error: unknown) {
        this.generators.delete(key);
        if (error instanceof String) {
          console.log("Error", error);
        } else if (error instanceof Error) {
          console.log(error.name, error.message);
        }
      }
    }
  }
}

export const context = new Context();
