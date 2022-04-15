import { RoomPosition } from 'game/prototypes'
import { CostMatrix, PathStep } from 'game/path-finder'
import { poly } from 'game/visual'

// private paths: Array<MyPath> = []
//   public getPaths(): Array<MyPath> {
//     return this.paths
//   }
//   public addPath(source: RoomPosition, target: RoomPosition, cost?: CostMatrix): MyPath {
//     const opts = { costMatrix: cost } as FindPathOpts
//     const result = searchPath(source, target, opts)
//     const path = {
//       path: result.path.slice(10, -10).reverse(),
//       cost: result.cost,
//       threat: 0.0
//     } as MyPath
//     this.paths.push(path)
//     return path
//   }

export interface MyPath {
  path: Array<PathStep>
  cost: number
  threat: number
}

export interface CostOpts {
  range: number
  value: number
}

export function getCost(cost: CostMatrix, path: Array<PathStep>, opts: CostOpts): void {
  const defaults = { range: 3, value: 255 }
  const options = { ...opts, defaults }

  for (const l of path) {
    for (let x = (l.x - options.range); x < (l.x + options.range); x++) {
      for (let y = (l.y - options.range); y < (l.y + options.range); y++) {
        cost.set(x, y, options.value)
      }
    }
  }
}

export function drawPath(path: RoomPosition[], color: string): void {
  const opts = {
    stroke: color,
    opacity: 1,
    strokeWidth: 0.2
  }
  poly(path, opts)
}