import { getObjectsByPrototype } from 'game/utils';
import { ATTACK, MOVE } from 'game/constants';
import { StructureSpawn } from 'game/prototypes';

let attacker;
export function loop() {
    if (!attacker) {
        attacker = getObjectsByPrototype(StructureSpawn).find(i => i.my).spawnCreep([MOVE, ATTACK]);
    } else {
        const enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
        attacker.moveTo(enemySpawn);
        attacker.attack(enemySpawn);
    }
}