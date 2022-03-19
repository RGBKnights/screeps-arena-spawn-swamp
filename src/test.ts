import { getTicks } from 'game/utils';

const scale = (inputY: number, yRange: Array<number>, xRange: Array<number>): number => {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const percent = (inputY - yMin) / (yMax - yMin);
  const outputX = percent * (xMax - xMin) + xMin;

  return Math.round(outputX);
};

function setup() {
  //TODO: Following Steps =>
  // #. Worker Path:
  // Find Paths [Container => My Spawn]
  // #. Attack Path:
  // Find Path My Spawn => Their Spawn
}

function update() {
  // #. Spawn Worker (paths):
  // Worker[MOVE, CARRY, WORK]
  // #. Set Path: (Worker Path)

  // #. Spawn attackers (∞)
  // scale(ticks, [1, 2000], [1, 10]) => int
  // [MOVE = (scale), ATTACK = (scale)] => 48 MAX
  // #. Set Path: (Attack Path)
  // Move path one step at a time
  // Attack adjacent enmey units
}

export function loop() {
  const ticks = getTicks()
  if (ticks == 1) {
    setup()
  } else {
    update()
  }
}