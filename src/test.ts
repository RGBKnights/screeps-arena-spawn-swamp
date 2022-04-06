import { Context } from 'serivces/context';
var ctx = new Context()
export function loop() {
  ctx.update();
}