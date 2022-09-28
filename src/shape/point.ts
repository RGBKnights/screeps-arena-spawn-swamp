import { PathStep } from "game/path-finder";
import { RoomPosition } from "game/prototypes";

export class Point implements RoomPosition, PathStep {
  public x: number = 0;
  public y: number = 0;
}

export function pt(x: number, y: number): Point {
  return { x, y } as Point;
}
