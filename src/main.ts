import { getRange, getTicks } from "game";
import { CARRY, MOVE, RESOURCE_ENERGY } from "game/constants";
import { searchPath } from "game/path-finder";
import { Creep, RoomPosition, StructureContainer, StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"

/*
interface Unit extends Creep {
    target: RoomPosition
}

function* CreateUnits() {
    let spawn = getObjectsByPrototype(StructureSpawn).find(_ => _.my) as StructureSpawn;
    var horiontal = [2, 3, 4];
    var y = 45;
    for (const x of horiontal) {
        var creep = spawn.spawnCreep([CARRY, CARRY, MOVE]).object as Unit;
        creep.target = { x, y } as RoomPosition
        yield
        while (getRange(creep.target, creep) > 0) {
            creep.moveTo(creep.target);
            yield
        }
    }
}

let generator = CreateUnits()

export function loop() {
    if (!generator.next().done)
        return

    let g_spawns = getObjectsByPrototype(StructureSpawn).filter(_ => _.my);
    var g_containers = getObjectsByPrototype(StructureContainer)
    let units = getObjectsByPrototype(Creep).filter(c => c.my) as Array<Unit>
    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        switch (i) {
            case 0:
                {
                    unit.transfer(units[i + 1], RESOURCE_ENERGY)

                    var containers = unit.findInRange(g_containers, 1).filter(_ => _.store.energy > 0).sort((a, b) => a.store.energy - b.store.energy)
                    for (const container of containers) {
                        unit.withdraw(container, RESOURCE_ENERGY)
                    }

                    continue;
                }
            case 1:
                unit.transfer(units[i + 1], RESOURCE_ENERGY)
                continue;
            case 2:
                {
                    var spawns = unit.findInRange(g_spawns, 1)
                    for (const spawn of spawns) {
                        unit.transfer(spawn, RESOURCE_ENERGY)
                    }
                    continue;
                }
            default:
                break;
        }
    }

}
*/

//var containers = getObjectsByPrototype(StructureContainer)
//let spawns = getObjectsByPrototype(StructureSpawn).filter(_ => _.my);
//let units = getObjectsByPrototype(Creep).filter(c => c.my)


function CreateWorkers() {
    const units = getObjectsByPrototype(Creep).filter(c => c.my).filter(_ => _.role == 1);
    if (units.length == 3)
        return

    const spawn = getObjectsByPrototype(StructureSpawn).find(_ => _.my) as StructureSpawn
    const container = getObjectsByPrototype(StructureContainer).find(_ => _.y == spawn.y) as StructureContainer
    const search = searchPath(spawn, container)
    const path = search.path.slice(0, -1)

    const result = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE])
    if (result.error)
        return

    let creep = result.object as any
    creep.role = 1
    creep.path = path
}

function UpdateWorkers() {
    const units = getObjectsByPrototype(Creep).filter(c => c.my).filter(_ => _.role == 1);
    for (const unit of units) {
        unit
    }
}


export function loop() {
    CreateWorkers();
    UpdateWorkers();
}