// => Engery
// Spawn => stored: 500e
// Tower? => build: 1250e
// Container => stored: 2500e
// => Paths
// primary
// secondary

/*
import { engine } from "game/engine";
export function loop() {
  engine.step();
}
*/

import {
  getCpuTime,
  getHeapStatistics,
  getObjectsByPrototype,
  getTerrainAt,
  getTicks,
} from "game/utils";
import { CostMatrix } from "game/path-finder";
import { StructureSpawn } from "game/prototypes";
import { arenaInfo } from "game";

let t = getTicks();
let spawns = getObjectsByPrototype(StructureSpawn);
let martix: number[] = [];

let i = 0;
let p = 0;
for (; p < 0.98; i++) {
  martix.push(1);
  p = getCpuTime() / arenaInfo.cpuTimeLimitFirstTick;
}

let heap = getHeapStatistics();
let used = (heap.total_heap_size / heap.heap_size_limit) * 100;

export function loop() {
  console.log(`index: ${i}`);
  console.log(`used: ${used}%`);
  console.log(`tick? ${t}`);
  console.log(`spawns ${spawns.length}`);
}
