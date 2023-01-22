import groupBy from "lodash-es/groupBy";
import { isFirstTick } from "./common";

const results = groupBy([1.3, 2.1, 2.4], Math.floor);

export function loop() {
  if (isFirstTick()) {
    console.log("first tick");
  } else {
    console.log("groups", Object.keys(results).length);
  }
}
