import { getObjectsByPrototype } from 'game/utils';
import { ATTACK, MOVE } from 'game/constants';
import { Creep, StructureSpawn } from 'game/prototypes';

let attacker: Creep | undefined;

export function loop() {
    if (attacker) {
        const enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
        if(enemySpawn) {
            attacker.moveTo(enemySpawn);
            attacker.attack(enemySpawn);
        }
    } else {
        var spawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
        if(spawn) {
            var result = spawn.spawnCreep([MOVE, ATTACK]);
            attacker = result.object;
        }
    }
}