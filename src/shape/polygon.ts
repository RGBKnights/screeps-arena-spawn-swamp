import { Point } from "shape/point";
import { Visual } from "game/visual";

export class Polygon {
  public readonly points: Point[];
  private readonly layer: Visual;
  private readonly style: PolyStyle;

  public constructor(points: Point[]) {
    this.points = points;
    this.layer = new Visual(10, true);
    this.style = { strokeWidth: 0.3, opacity: 0.8 } as PolyStyle;
  }

  public inside(position: Point): boolean {
    let x = position.x;
    let y = position.y;

    let inside = false;
    for (
      let i = 0, j = this.points.length - 1;
      i < this.points.length;
      j = i++
    ) {
      let xi = this.points[i].x;
      let yi = this.points[i].y;
      let xj = this.points[j].x;
      let yj = this.points[j].y;

      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  public area() {
    let area = 0;
    let pts = this.points;
    let nPts = pts.length;
    let j = nPts - 1;
    let p1;
    let p2;

    for (let i = 0; i < nPts; j = i++) {
      p1 = pts[i];
      p2 = pts[j];
      area += p1.x * p2.y;
      area -= p1.y * p2.x;
    }
    area /= 2;
    return area;
  }

  public centroid() {
    let pts = this.points;
    let nPts = pts.length;
    let x = 0;
    let y = 0;
    let f;
    let j = nPts - 1;
    let p1;
    let p2;

    for (let i = 0; i < nPts; j = i++) {
      p1 = pts[i];
      p2 = pts[j];
      f = p1.x * p2.y - p2.x * p1.y;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }

    f = this.area() * 6;

    return { x: x / f, y: y / f } as Point;
  }

  public draw(layer?: Visual, style?: PolyStyle) {
    let l = layer || this.layer;
    l.poly(this.points, style || this.style);
  }
}
