import { arenaInfo } from "game";
import { engine } from "./engine";

export class Context {
  public name: string = "";
  public level: number = 0;
  public season: string = "";

  public constructor() {
    engine.onStart.subscribe(() => this.setup());
    engine.onUpdate.subscribe(() => this.update());
  }

  private setup(): void {
    this.name = arenaInfo.name;
    this.level = arenaInfo.level;
    this.season = arenaInfo.season;

    // regions: Polygon[]
  }

  private update(): void {
    // => Engery (max, claimed) where?
    // => Stregnth (ally, netural, enemy)
  }
}

export const context = new Context();
