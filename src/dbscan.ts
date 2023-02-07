import { Creep } from "game/prototypes";
import { getRange } from "game/utils";

export class DBSCAN {
  private dataset: Creep[];
  private epsilon: number;
  private minPts: number;
  private clusters: number[][];
  private noise: number[];
  private visited: number[];
  private assigned: number[];

  public constructor(dataset: Creep[], epsilon = 1, minPts = 2) {
    this.dataset = dataset;
    this.epsilon = epsilon;
    this.minPts = minPts;
    this.clusters = [];
    this.noise = [];
    this.visited = new Array<number>(dataset.length);
    this.assigned = new Array<number>(dataset.length);
  }

  public run(): number[][] {
    for (let pointId = 0; pointId < this.dataset.length; pointId++) {
      if (this.visited[pointId] !== 1) {
        this.visited[pointId] = 1;
        const neighbors = this.regionQuery(pointId);
        if (neighbors.length < this.minPts) {
          this.noise.push(pointId);
        } else {
          const clusterId = this.clusters.length;
          this.clusters.push([]);
          this.addToCluster(pointId, clusterId);
          this.expandCluster(clusterId, neighbors);
        }
      }
    }
    return this.clusters;
  }

  // NOTE: It's very important to calculate length of neighbors array each time, as the number of elements changes over time
  private expandCluster(clusterId: number, neighbors: number[]): void {
    for (const pointId2 of neighbors) {
      if (this.visited[pointId2] !== 1) {
        this.visited[pointId2] = 1;
        const neighbors2 = this.regionQuery(pointId2);

        if (neighbors2.length >= this.minPts) {
          neighbors = this.mergeArrays(neighbors, neighbors2);
        }
      }
      if (this.assigned[pointId2] !== 1) {
        this.addToCluster(pointId2, clusterId);
      }
    }
  }

  private addToCluster(pointId: number, clusterId: number): void {
    this.clusters[clusterId].push(pointId);
    this.assigned[pointId] = 1;
  }

  private regionQuery(pointId: number): number[] {
    const neighbors = [];

    for (let id = 0; id < this.dataset.length; id++) {
      const dist = getRange(this.dataset[pointId], this.dataset[id]);
      if (dist < this.epsilon) {
        neighbors.push(id);
      }
    }

    return neighbors;
  }

  private mergeArrays = function (a: number[], b: number[]): number[] {
    const len = b.length;

    for (let i = 0; i < len; i++) {
      const P = b[i];
      if (a.indexOf(P) < 0) {
        a.push(P);
      }
    }

    return a;
  };
}

export function cluster(dataset: Creep[]): Creep[][] {
  const scaner = new DBSCAN(dataset, 7, 2);
  const clusters = scaner.run();
  return clusters.map(x => x.map(i => dataset[i]));
}
