import { RoomPosition } from "game/prototypes";
import { Visual } from 'game/visual'

class Polygon {
  public readonly points: Array<RoomPosition>

  constructor(points: Array<RoomPosition>) {
    this.points = points
  }

  public inside(position: RoomPosition): boolean {
    let x = position.x, y = position.y;

    let inside = false;
    for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
      let xi = this.points[i].x, yi = this.points[i].y;
      let xj = this.points[j].x, yj = this.points[j].y;

      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

  area() {
    let area = 0;
    let pts = this.points;
    let nPts = pts.length;
    let j = nPts - 1;
    let p1; let p2;

    for (let i = 0; i < nPts; j = i++) {
      p1 = pts[i]; p2 = pts[j];
      area += p1.x * p2.y;
      area -= p1.y * p2.x;
    }
    area /= 2;
    return area;
  }

  centroid() {
    let pts = this.points;
    let nPts = pts.length;
    let x = 0; let y = 0;
    let f;
    let j = nPts - 1;
    let p1; let p2;

    for (let i = 0; i < nPts; j = i++) {
      p1 = pts[i]; p2 = pts[j];
      f = p1.x * p2.y - p2.x * p1.y;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }

    f = this.area() * 6;

    return { x: (x / f), y: (y / f) } as RoomPosition;
  }

}

export interface ILabelPosition {
  where: RoomPosition
  what: string
}

export class LabelPosition implements ILabelPosition {
  public where: RoomPosition
  public what: string

  constructor(what: string, where: RoomPosition) {
    this.what = what
    this.where = where
  }
}

export class LabelCoordinates implements ILabelPosition {
  public where: RoomPosition
  public what: string

  constructor(what: string, x: Number, y: number) {
    this.what = what
    this.where = { x, y } as RoomPosition
  }
}

export class Zone {
  public readonly boundry: Polygon

  public name: ILabelPosition
  public rallyTo: Array<ILabelPosition>

  constructor(name: ILabelPosition, points: RoomPosition[], rally: ILabelPosition[]) {
    this.name = name
    this.boundry = new Polygon(points)
    this.rallyTo = rally
  }

  public draw(layer: Visual) {
    layer.poly(this.boundry.points, { strokeWidth: 0.3, opacity: 0.8 })
    layer.text(this.name.what, this.name.where, { font: 1.0, opacity: 0.6, })
  }
}