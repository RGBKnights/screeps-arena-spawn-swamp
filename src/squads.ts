import groupBy from "lodash-es/groupBy";

export function getSquad() {
  const results = groupBy([1.3, 2.1, 2.4], Math.floor);
  console.log("groups", Object.keys(results).length);
}
