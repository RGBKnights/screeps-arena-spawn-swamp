import 'polyfills'
import { Engine } from 'engine'
import {
    BodyPartConstant, MOVE, WORK, CARRY, TOUGH,
    RESOURCE_ENERGY,
    OK, ERR_NOT_IN_RANGE, ERR_FULL, ERR_NOT_ENOUGH_RESOURCES, ERR_INVALID_ARGS, ERR_NO_BODYPART, ERR_TIRED, ATTACK
} from 'game/constants'
import {
    Creep,
    RoomPosition, StructureContainer, StructureSpawn
} from 'game/prototypes'
import { getObjectsByPrototype, getDirection, getRange } from 'game/utils'
import { searchPath, CostMatrix, PathStep } from 'game/path-finder'
import { poly } from 'game/visual'

function drawPath(path: RoomPosition[], color: string) {
    const opts = {
        stroke: color,
        opacity: 1,
        strokeWidth: 0.2
    }
    poly(path, opts)
}

class Attacker {
    private creep: Creep
    private cxt: Context
    private path: Array<PathStep>
    private state: number

    constructor(cxt: Context, creep: Creep, path: Array<PathStep>) {
        this.cxt = cxt
        this.creep = creep
        this.path = path
        this.state = 0
    }

    public update(): void {
        if (this.state == 0) {
            // Find Start of Path
            const start = this.path.at(0) as PathStep
            var r = getRange(start, this.creep)
            if (r == 0) {
                this.state = 1
            } else {
                let result = this.creep.moveTo(start)
            }
        }

        if (this.state == 1) {
            // Move Along path till the End

            const end = this.path.at(-1) as PathStep
            var r = getRange(end, this.creep)
            if (r == 0) {
                this.state = 2
            } else {
                var creeps = this.creep.findInRange(this.cxt.theirCreeps(), 1)
                var target = creeps.at(0)
                if (target) {
                    this.creep.attack(target)
                }

                const index = this.path.findIndex(p => p.x == this.creep.x && p.y == this.creep.y);
                const current = this.path.at(index) as PathStep
                const next = this.path.at(index + 1) as PathStep
                const direction = getDirection(next.x - current.x, next.y - current.y);
                let result = this.creep.move(direction);
            }
        }

        if (this.state == 2) {
            // Find a destory their spawn
            const target = this.cxt.theirSpawn
            let result = this.creep.attack(target)
            if (result == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target)
                // TODO: MAKE THIS CHEAPER...!
            }
        }
    }
}

class Worker {
    private creep: Creep
    private cxt: Context
    private state: number

    constructor(cxt: Context, creep: Creep) {
        this.cxt = cxt
        this.creep = creep
        this.state = 1
    }

    public update(): void {
        if (this.state == 1) {
            for (const target of this.cxt.containers) {
                let result = this.creep.withdraw(target, RESOURCE_ENERGY)
                if (result == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                    break;
                } else if (result == ERR_FULL) {
                    this.state = 2
                    break;
                } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    continue;
                } else if (result == -4) {
                    console.log("spawning") // WTF..?
                }
            }
        } else if (this.state == 2) {
            const destinations = [this.cxt.mySpawn]
            for (const target of destinations) {
                let result = this.creep.transfer(target, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                } else if (result == ERR_FULL) {
                    // TODO: State = 3
                } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    this.state = 1
                }
            }
        }
    }
}

class Context {
    public primaryPath: Array<PathStep>
    public secondaryPath: Array<PathStep>
    public containers: Array<StructureContainer>
    public mySpawn: StructureSpawn
    public theirSpawn: StructureSpawn

    public workers: Array<Worker>
    public attackers: Array<Attacker>

    constructor(
        primaryPath: Array<PathStep>, secondaryPath: Array<PathStep>,
        containers: Array<StructureContainer>, mySpawn: StructureSpawn,
        theirSpawn: StructureSpawn
    ) {
        this.primaryPath = primaryPath
        this.secondaryPath = secondaryPath
        this.containers = containers
        this.mySpawn = mySpawn
        this.theirSpawn = theirSpawn
        this.workers = []
        this.attackers = []
    }

    public theirCreeps() {
        return getObjectsByPrototype(Creep).filter(_ => !_.my)
    }
}

// function* getNextUnitBody(): Generator<Array<BodyPartConstant>> {
//     while (true) {
//         yield [MOVE, ATTACK];
//         yield [MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH];
//     }
// }

class MyEngine extends Engine {

    private context: Context | undefined

    private getCost(path: Array<PathStep>, range: number, value: number = 255): CostMatrix {
        var cost = new CostMatrix()
        for (const l of path) {
            for (let x = (l.x - range); x < (l.x + range); x++) {
                for (let y = (l.y - range); y < (l.y + range); y++) {
                    cost.set(x, y, value)
                }
            }
        }
        return cost
    }

    override setup(): void {
        console.log("Setup")

        // Collect Context
        const mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my) as StructureSpawn
        const theirSpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my) as StructureSpawn
        const globalContainers = getObjectsByPrototype(StructureContainer)
        const myContainers = mySpawn.findInRange(globalContainers, 10)

        // Get Paths
        const p1 = searchPath(theirSpawn, mySpawn)
        const primary = p1.path.slice(10, -10).reverse()
        const opts = {
            costMatrix: this.getCost(primary, 2)
        }
        const p2 = searchPath(mySpawn, theirSpawn, opts)
        const secondary = p2.path.slice(10, -10)
        console.log("Path Delta", (primary.length - secondary.length))

        // Create Context
        this.context = new Context(primary, secondary, myContainers, mySpawn, theirSpawn)
    }
    override update(): void {
        console.log("Update")

        if (this.context == null)
            return

        if (this.context.workers.length < 3) {
            // Spawn Worker Creep
            const result = this.context.mySpawn.spawnCreep([MOVE, CARRY])
            if (result.object) {
                const worker = new Worker(this.context, result.object as Creep)
                this.context.workers.push(worker)
            }
        } else if (this.context.attackers.length < 100) {
            const path = (this.context.attackers.length % 2 == 0) ? this.context.primaryPath : this.context.secondaryPath;
            const result = this.context.mySpawn.spawnCreep([MOVE, ATTACK])
            if (result.object) {
                const unit = new Attacker(this.context, result.object, path)
                this.context.attackers.push(unit)
            }
        }

        for (const unit of this.context.workers) {
            unit.update()
        }
        for (const unit of this.context.attackers) {
            unit.update()
        }

        drawPath(this.context.primaryPath, '#e9990c')
        drawPath(this.context.secondaryPath, '#890AD1')
    }
}

var engine = new MyEngine()
export function loop() {
    engine.loop()
}